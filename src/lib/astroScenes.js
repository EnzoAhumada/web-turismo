const SCENE_CACHE = {};

const PRESET_LIST = [
  { key: 'milkyway', label: 'Vía Láctea', caption: 'Núcleo Galáctico' },
  { key: 'carina', label: 'Nebulosa Carina', caption: 'Cielo Profundo' },
  { key: 'startrails', label: 'Circumpolar', caption: 'Trazas Estelares' },
];

export function getAstroPresetOptions() {
  return PRESET_LIST;
}

export function generateAstroScene(type = 'milkyway') {
  if (SCENE_CACHE[type]) return SCENE_CACHE[type];
  if (typeof document === 'undefined') return '';

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const skyGrad = ctx.createLinearGradient(0, 0, 0, 600);
    if (type === 'carina') {
      skyGrad.addColorStop(0, '#031126');
      skyGrad.addColorStop(0.55, '#190b2e');
      skyGrad.addColorStop(1, '#071B3A');
    } else if (type === 'collowara_dome' || type === 'collowara_terrace') {
      skyGrad.addColorStop(0, '#031126');
      skyGrad.addColorStop(0.6, '#071B3A');
      skyGrad.addColorStop(1, '#12294d');
    } else if (type === 'chacana') {
      skyGrad.addColorStop(0, '#031126');
      skyGrad.addColorStop(0.65, '#0c2244');
      skyGrad.addColorStop(1, '#1a202c');
    } else {
      skyGrad.addColorStop(0, '#031126');
      skyGrad.addColorStop(0.6, '#071B3A');
      skyGrad.addColorStop(1, '#0e254b');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 960, 600);

    let seed = String(type)
      .split('')
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 17);
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < 420; i += 1) {
      const x = rand() * 960;
      const y = rand() * 520;
      const r = rand() * 1.6 + 0.3;
      const alpha = rand() * 0.85 + 0.15;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle =
        i % 9 === 0
          ? `rgba(255, 184, 0, ${alpha})`
          : i % 7 === 0
            ? `rgba(125, 211, 252, ${alpha})`
            : `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    if (type === 'milkyway' || type === 'collowara_dome') {
      ctx.save();
      ctx.translate(480, 260);
      ctx.rotate(-0.48);
      const mwGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, 390);
      mwGrad.addColorStop(0, 'rgba(255, 184, 0, 0.36)');
      mwGrad.addColorStop(0.28, 'rgba(255, 157, 0, 0.24)');
      mwGrad.addColorStop(0.58, 'rgba(56, 189, 248, 0.16)');
      mwGrad.addColorStop(1, 'rgba(3, 17, 38, 0)');
      ctx.fillStyle = mwGrad;
      ctx.scale(1.6, 0.45);
      ctx.beginPath();
      ctx.arc(0, 0, 390, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (type === 'carina') {
      const neb = ctx.createRadialGradient(460, 270, 20, 460, 270, 240);
      neb.addColorStop(0, 'rgba(255, 157, 0, 0.55)');
      neb.addColorStop(0.42, 'rgba(217, 70, 239, 0.32)');
      neb.addColorStop(0.75, 'rgba(56, 189, 248, 0.18)');
      neb.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb;
      ctx.fillRect(100, 30, 760, 480);

      for (let i = 0; i < 160; i += 1) {
        const angle = rand() * Math.PI * 2;
        const dist = rand() * 185;
        ctx.beginPath();
        ctx.arc(
          460 + Math.cos(angle) * dist * 1.3,
          270 + Math.sin(angle) * dist * 0.85,
          rand() * 1.7 + 0.4,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 245, 230, ${rand() * 0.9})`;
        ctx.fill();
      }
    }

    if (type === 'startrails') {
      ctx.save();
      ctx.translate(480, 240);
      for (let r = 35; r < 340; r += 13) {
        ctx.beginPath();
        const start = rand() * Math.PI * 2;
        ctx.arc(0, 0, r, start, start + 1.15 + rand() * 0.9);
        ctx.strokeStyle =
          r % 26 === 0
            ? 'rgba(255, 184, 0, 0.48)'
            : 'rgba(125, 211, 252, 0.42)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      ctx.restore();
    }

    if (type === 'moon_mining') {
      const glow = ctx.createRadialGradient(690, 175, 15, 690, 175, 150);
      glow.addColorStop(0, 'rgba(255, 184, 0, 0.45)');
      glow.addColorStop(1, 'rgba(3, 17, 38, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(520, 20, 340, 320);

      ctx.beginPath();
      ctx.arc(690, 175, 42, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE4A3';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(708, 168, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#071B3A';
      ctx.fill();
    }

    // Silueta cordillerana de Andacollo
    ctx.beginPath();
    ctx.moveTo(0, 600);
    ctx.lineTo(0, 465);
    ctx.lineTo(140, 430);
    ctx.lineTo(290, 455);
    ctx.lineTo(445, 395);
    ctx.lineTo(615, 445);
    ctx.lineTo(790, 410);
    ctx.lineTo(960, 450);
    ctx.lineTo(960, 600);
    ctx.closePath();
    ctx.fillStyle = '#031126';
    ctx.fill();

    // Cúpula Collowara o terrazas
    if (type === 'collowara_dome') {
      ctx.fillStyle = '#0e254b';
      ctx.beginPath();
      ctx.arc(480, 405, 68, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(405, 405, 150, 45);
      ctx.strokeStyle = 'rgba(255, 184, 0, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(480, 405, 68, Math.PI + 0.35, -0.35);
      ctx.stroke();
    } else if (type === 'collowara_terrace') {
      ctx.fillStyle = '#0e254b';
      ctx.fillRect(210, 430, 540, 20);
      [310, 480, 650].forEach((tx) => {
        ctx.strokeStyle = '#FFB800';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tx, 430);
        ctx.lineTo(tx - 16, 465);
        ctx.moveTo(tx, 430);
        ctx.lineTo(tx + 16, 465);
        ctx.moveTo(tx - 24, 410);
        ctx.lineTo(tx + 28, 378);
        ctx.stroke();
      });
    } else if (type === 'chacana') {
      ctx.strokeStyle = 'rgba(255, 184, 0, 0.72)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(440, 380, 80, 80);
      ctx.strokeRect(420, 400, 120, 40);
      ctx.strokeRect(460, 360, 40, 120);
    }

    const url = canvas.toDataURL('image/jpeg', 0.86);
    SCENE_CACHE[type] = url;
    return url;
  } catch {
    return '';
  }
}

export function resolveAstroImage(src, fallbackPreset = 'milkyway') {
  if (!src) return generateAstroScene(fallbackPreset);
  if (typeof src === 'string' && src.startsWith('preset:')) {
    const key = src.slice('preset:'.length).trim() || fallbackPreset;
    return generateAstroScene(key);
  }
  return src;
}
