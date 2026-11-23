import { Link } from 'react-router-dom';
import BrandLogo from '../../ui/BrandLogo';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <BrandLogo variant="dark" size="md" />
          <p className="footer__tagline">
            Explora tu próximo camino en Andacollo, Región de Coquimbo, Chile.
          </p>
        </div>

        <nav className="footer__links" aria-label="Links del sitio">
          <div className="footer__col">
            <h3 className="footer__col-title">Explorar</h3>
            <ul>
              <li><Link to="/explorar">Categorías</Link></li>
              <li><Link to="/mapa">Mapa interactivo</Link></li>
              <li><Link to="/eventos">Eventos</Link></li>
              <li><Link to="/experiencias">Experiencias</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h3 className="footer__col-title">Descubrir</h3>
            <ul>
              <li><Link to="/astronomia">Turismo astronómico</Link></li>
              <li><Link to="/recomendaciones">Recomendaciones</Link></li>
              <li><Link to="/planificador">Planificador</Link></li>
              <li><Link to="/gamificacion">Gamificación</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h3 className="footer__col-title">Andacollo</h3>
            <ul>
              <li><Link to="/restaurantes">Gastronomía local</Link></li>
              <li><Link to="/alojamientos">Alojamientos</Link></li>
              <li><Link to="/admin">Panel municipal</Link></li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="footer__bottom">
        <p>© 2026 ThakiGo – Turismo Andacollo, Coquimbo, Chile. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
