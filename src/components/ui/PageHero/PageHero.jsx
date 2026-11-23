import './PageHero.css';

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  bgClass = '',
  bgImage = '',
  children,
}) {
  return (
    <section className={`page-hero ${bgClass}`}>
      <div
        className="page-hero__bg"
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
        aria-hidden="true"
      />
      <div className="page-hero__overlay" aria-hidden="true" />
      <div className="page-hero__content container">
        {eyebrow && <span className="page-hero__eyebrow">{eyebrow}</span>}
        <h1 className="page-hero__title">{title}</h1>
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
        {children && <div className="page-hero__extra">{children}</div>}
      </div>
    </section>
  );
}
