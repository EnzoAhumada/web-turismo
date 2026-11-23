import './BrandLogo.css';

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  stacked = false,
  showText = true,
  className = '',
}) {
  return (
    <span
      className={`brand-logo brand-logo--${variant} brand-logo--${size} ${
        stacked ? 'brand-logo--stacked' : ''
      } ${className}`.trim()}
    >
      <span className="brand-logo__mark">
        <img src="/logo-thakigo.png" alt="ThakiGo" className="brand-logo__img" />
      </span>
      {showText && (
        <span className="brand-logo__wordmark">
          Thaki<span>Go</span>
        </span>
      )}
    </span>
  );
}
