import { supabase } from '../lib/supabase';

const SYNC_CACHE_KEY = 'thakigo_news_last_sync_at';
const AUTO_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 horas

export function buildNewsSlug(title) {
  return (title || 'noticia-andacollo')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export async function getLatestNews({ limit = 10, category = null, onlyActive = true } = {}) {
  let query = supabase
    .from('noticias')
    .select('*')
    .order('destacada', { ascending: false })
    .order('fecha_publicacion', { ascending: false });

  if (onlyActive) {
    query = query.eq('activa', true);
  }

  if (category && category !== 'Todas') {
    query = query.eq('categoria', category);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error('No se pudieron cargar las noticias de Andacollo.');
  }

  return data || [];
}

export async function syncAndacolloNews({ force = false } = {}) {
  if (!force) {
    try {
      const lastSync = Number(window.localStorage.getItem(SYNC_CACHE_KEY) || 0);
      if (lastSync && Date.now() - lastSync < AUTO_SYNC_INTERVAL_MS) {
        return {
          synced: false,
          inserted: 0,
          skipped: 0,
          throttled: true,
          message: 'Noticias actualizadas recientemente.',
        };
      }
    } catch {
      // Ignorar restricciones de almacenamiento local
    }
  }

  try {
    const { data, error } = await supabase.functions.invoke('sync-andacollo-news', {
      body: { force },
    });

    if (error || !data) {
      return {
        synced: false,
        inserted: 0,
        skipped: 0,
        fallback: true,
        message: 'La fuente externa no respondió en este momento. Se muestran las noticias almacenadas.',
      };
    }

    try {
      window.localStorage.setItem(SYNC_CACHE_KEY, String(Date.now()));
    } catch {
      // Ignorar restricciones de almacenamiento local
    }

    return data;
  } catch {
    return {
      synced: false,
      inserted: 0,
      skipped: 0,
      fallback: true,
      message: 'No fue posible conectar con la fuente externa. Se muestran las noticias almacenadas.',
    };
  }
}
