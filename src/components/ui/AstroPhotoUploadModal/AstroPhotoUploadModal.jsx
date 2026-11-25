import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  ASTRO_SPOTS,
  createAstroPhoto,
  uploadAstroPhotoFile,
} from '../../../services/astrophotos.service';
import { getAstroPresetOptions, resolveAstroImage } from '../../../lib/astroScenes';
import Icon from '../Icon';
import Button from '../Button';
import FeedbackBanner from '../FeedbackBanner';
import './AstroPhotoUploadModal.css';

const PRESETS = getAstroPresetOptions();

export default function AstroPhotoUploadModal({ isOpen, onClose, onUploaded }) {
  const { user } = useAuth();
  const [selectedPreset, setSelectedPreset] = useState('milkyway');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [titulo, setTitulo] = useState('');
  const [spot, setSpot] = useState(ASTRO_SPOTS[0]);
  const [descripcion, setDescripcion] = useState('');
  const [camera, setCamera] = useState('Sony DSC-H300');
  const [iso, setIso] = useState('ISO 1600');
  const [shutter, setShutter] = useState('30 seg');
  const [aperture, setAperture] = useState('f/5.6');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && !selectedFile) {
      setPreviewSrc(resolveAstroImage(`preset:${selectedPreset}`));
    }
  }, [isOpen, selectedPreset, selectedFile]);

  if (!isOpen) return null;

  function handleSelectPreset(e, key) {
    e.preventDefault();
    setSelectedFile(null);
    setSelectedPreset(key);
    setPreviewSrc(resolveAstroImage(`preset:${key}`));
    setError('');
  }

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen (JPG, PNG o WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen supera el máximo permitido de 5 MB.');
      return;
    }
    setError('');
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewSrc(String(ev.target.result || ''));
    reader.readAsDataURL(file);
  }

  function resetAndClose(e) {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setTitulo('');
    setDescripcion('');
    setSelectedFile(null);
    setSelectedPreset('milkyway');
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user?.id) {
      setError('Debes iniciar sesión para publicar en la galería.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      let imagenUrl = `preset:${selectedPreset}`;
      if (selectedFile) {
        imagenUrl = await uploadAstroPhotoFile(selectedFile, user.id);
      }

      const created = await createAstroPhoto({
        authorId: user.id,
        titulo,
        spot,
        descripcion,
        imagenUrl,
        exifCamera: camera,
        exifIso: iso,
        exifShutter: shutter,
        exifAperture: aperture,
      });

      setTitulo('');
      setDescripcion('');
      setSelectedFile(null);
      if (onUploaded) onUploaded(created);
      onClose();
    } catch (err) {
      setError(err?.message || 'No se pudo publicar la astrofotografía.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="astro-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="astro-upload-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) resetAndClose(e);
      }}
    >
      <div className="astro-modal">
        <header className="astro-modal__head">
          <div>
            <h2 id="astro-upload-title">Publicar Astrofotografía</h2>
            <p>Comparte tu captura nocturna con la comunidad de Andacollo</p>
          </div>
          <button
            type="button"
            className="astro-modal__close"
            onClick={resetAndClose}
            aria-label="Cerrar ventana"
          >
            <Icon name="x" size={18} />
          </button>
        </header>

        <FeedbackBanner type="error" message={error} onDismiss={() => setError('')} />

        <form className="astro-upload-form" onSubmit={handleSubmit}>
          <div className="astro-upload-media">
            <div className="astro-upload-media__controls">
              <label htmlFor="astro-file-input" className="astro-upload-label">
                Archivo de imagen (máx. 5 MB) o escena rápida
              </label>
              <input
                id="astro-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="astro-upload-file"
              />
              <p className="astro-upload-hint">O prueba con una captura de muestra:</p>
              <div className="astro-preset-row">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    className={`astro-preset-btn ${
                      !selectedFile && selectedPreset === preset.key ? 'active' : ''
                    }`}
                    onClick={(e) => handleSelectPreset(e, preset.key)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="astro-upload-preview">
              {previewSrc && <img src={previewSrc} alt="Vista previa de astrofotografía" />}
              <span className="astro-upload-preview__tag">Vista Previa</span>
            </div>
          </div>

          <div className="astro-upload-grid-2">
            <div className="astro-field">
              <label htmlFor="astro-title-input">Título de la captura</label>
              <input
                id="astro-title-input"
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Arco Galáctico sobre Cerro Yahuín"
              />
            </div>

            <div className="astro-field">
              <label htmlFor="astro-spot-select">Sector de observación</label>
              <select
                id="astro-spot-select"
                value={spot}
                onChange={(e) => setSpot(e.target.value)}
              >
                {ASTRO_SPOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="astro-field">
            <label htmlFor="astro-desc-input">Descripción e historia de la toma</label>
            <textarea
              id="astro-desc-input"
              rows="3"
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cuenta las condiciones del cielo, hora de captura o detalles del objeto astronómico..."
            />
          </div>

          <div className="astro-upload-grid-4">
            <div className="astro-field">
              <label htmlFor="astro-camera-input">Cámara / Equipo</label>
              <input
                id="astro-camera-input"
                type="text"
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
              />
            </div>
            <div className="astro-field">
              <label htmlFor="astro-iso-input">ISO</label>
              <input
                id="astro-iso-input"
                type="text"
                value={iso}
                onChange={(e) => setIso(e.target.value)}
              />
            </div>
            <div className="astro-field">
              <label htmlFor="astro-shutter-input">Exposición</label>
              <input
                id="astro-shutter-input"
                type="text"
                value={shutter}
                onChange={(e) => setShutter(e.target.value)}
              />
            </div>
            <div className="astro-field">
              <label htmlFor="astro-aperture-input">Apertura</label>
              <input
                id="astro-aperture-input"
                type="text"
                value={aperture}
                onChange={(e) => setAperture(e.target.value)}
              />
            </div>
          </div>

          <div className="astro-modal__actions">
            <Button type="button" variant="outline" onClick={resetAndClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold" disabled={submitting}>
              {submitting ? 'Publicando...' : 'Publicar en Galería'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
