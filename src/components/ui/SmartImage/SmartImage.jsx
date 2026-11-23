import { useState, useEffect } from 'react';
import './SmartImage.css';

const FALLBACK_SRC = '/fallback-andacollo.svg';

export default function SmartImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
}) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_SRC);

  useEffect(() => {
    setImgSrc(src || FALLBACK_SRC);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`smart-image ${className}`.trim()}
      loading={loading}
      onError={() => {
        if (imgSrc !== FALLBACK_SRC) {
          setImgSrc(FALLBACK_SRC);
        }
      }}
    />
  );
}
