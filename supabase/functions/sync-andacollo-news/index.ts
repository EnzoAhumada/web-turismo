// Supabase Edge Function: sync-andacollo-news
// Obtiene noticias recientes desde fuentes públicas RSS de Andacollo y las persiste sin duplicados.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const NEWS_SOURCES = [
  {
    name: 'Andacollo Conectado',
    url: 'https://andacolloconectado.cl/feed/',
    defaultCategory: 'Comuna',
  },
  {
    name: 'El Observatodo · Andacollo',
    url: 'https://www.elobservatodo.cl/taxonomy/term/113/all/feed',
    defaultCategory: 'Comuna',
  },
];

function stripHtml(text: string): string {
  return (text || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#8211;|&ndash;/gi, '–')
    .replace(/&#8217;|&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function extractTag(block: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = block.match(regex);
  return match ? match[1].trim() : '';
}

function extractImage(block: string): string | null {
  const mediaMatch =
    block.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
    block.match(/<enclosure[^>]+url=["']([^"']+)["']/i) ||
    block.match(/<img[^>]+src=["']([^"']+)["']/i);
  return mediaMatch ? mediaMatch[1] : null;
}

function parseRssItems(xml: string, sourceName: string, defaultCategory: string) {
  const items: Array<Record<string, unknown>> = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];

  for (const rawItem of itemMatches.slice(0, 10)) {
    const titulo = stripHtml(extractTag(rawItem, 'title'));
    const link = stripHtml(extractTag(rawItem, 'link'));
    const description = stripHtml(extractTag(rawItem, 'description'));
    const contentEncoded = stripHtml(extractTag(rawItem, 'content:encoded'));
    const pubDateRaw = stripHtml(extractTag(rawItem, 'pubDate'));
    const categoryRaw = stripHtml(extractTag(rawItem, 'category'));

    if (!titulo || titulo.length < 6) continue;

    const parsedDate = pubDateRaw ? new Date(pubDateRaw) : new Date();
    const fechaPublicacion = Number.isNaN(parsedDate.getTime())
      ? new Date().toISOString()
      : parsedDate.toISOString();

    const resumen = (description || contentEncoded || titulo).slice(0, 240);
    const contenido = (contentEncoded || description || resumen).slice(0, 2000);

    items.push({
      titulo,
      slug: slugify(titulo),
      resumen,
      contenido,
      imagen_url: extractImage(rawItem),
      fuente: sourceName,
      url_externa: link || null,
      categoria: categoryRaw ? categoryRaw.slice(0, 32) : defaultCategory,
      origen: 'automatica',
      fecha_publicacion: fechaPublicacion,
      destacada: false,
      activa: true,
      comuna: 'Andacollo',
      region: 'Coquimbo',
    });
  }

  return items;
}

async function fetchWithTimeout(url: string, timeoutMs = 6000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'ThakiGo-Andacollo-NewsSync/1.0' },
    });
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          synced: false,
          inserted: 0,
          skipped: 0,
          message: 'Configuración de entorno incompleta para sincronización.',
        }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    let collected: Array<Record<string, unknown>> = [];
    let usedSource = '';

    for (const source of NEWS_SOURCES) {
      try {
        const res = await fetchWithTimeout(source.url, 6000);
        if (!res.ok) continue;
        const xml = await res.text();
        const parsed = parseRssItems(xml, source.name, source.defaultCategory);
        if (parsed.length > 0) {
          collected = parsed;
          usedSource = source.name;
          break;
        }
      } catch {
        // Continuar con la siguiente fuente pública
      }
    }

    if (collected.length === 0) {
      return new Response(
        JSON.stringify({
          synced: false,
          inserted: 0,
          skipped: 0,
          fallback: true,
          message: 'No se pudo obtener noticias nuevas desde fuentes externas. Se mantienen las noticias almacenadas.',
        }),
        { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    let inserted = 0;
    let skipped = 0;

    for (const item of collected) {
      const { error } = await supabase
        .from('noticias')
        .upsert(item, { onConflict: 'slug', ignoreDuplicates: true });

      if (error) {
        skipped += 1;
      } else {
        inserted += 1;
      }
    }

    return new Response(
      JSON.stringify({
        synced: true,
        inserted,
        skipped,
        source: usedSource,
        message: `Sincronización completada desde ${usedSource}.`,
      }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        synced: false,
        inserted: 0,
        skipped: 0,
        fallback: true,
        message: err instanceof Error ? err.message : 'Error inesperado al sincronizar noticias.',
      }),
      { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
