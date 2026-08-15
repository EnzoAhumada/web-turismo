import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import './LandingPage.css';

export default function LandingPage() {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError('Correo o contraseña incorrectos.');
    } else {
      navigate('/inicio');
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!nombre.trim() || !apellido.trim()) {
      setError('Por favor ingresa tu nombre y apellido.');
      return;
    }
    setLoading(true);
    const { error: err } = await signUp(email, password, nombre, apellido);
    setLoading(false);
    if (err) {
      setError(err.message || 'No se pudo crear la cuenta.');
    } else {
      setSuccessMsg('Cuenta creada. Revisa tu correo para confirmar tu cuenta y luego inicia sesión.');
      setTab('login');
    }
  }

  return (
    <main className="landing">
      <div className="landing__overlay" aria-hidden="true" />

      <div className="landing__content">
        <div className="landing__logo">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <polygon points="24,4 44,40 4,40" fill="var(--color-gold)" />
            <circle cx="24" cy="32" r="8" fill="var(--color-navy)" />
            <circle cx="24" cy="32" r="4" fill="var(--color-gold)" />
          </svg>
          <span>Thaki<span>Go</span></span>
        </div>

        <p className="landing__tagline">Explora tu próximo camino</p>

        {/* Auth card */}
        <div className="landing__auth-card">
          <div className="landing__auth-tabs">
            <button
              type="button"
              className={`landing__auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); setSuccessMsg(''); }}
            >
              Ingresar
            </button>
            <button
              type="button"
              className={`landing__auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError(''); setSuccessMsg(''); }}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="landing__auth-error" role="alert">{error}</div>
          )}
          {successMsg && (
            <div className="landing__auth-success" role="status">{successMsg}</div>
          )}

          {tab === 'login' ? (
            <form className="landing__auth-form" onSubmit={handleLogin} noValidate>
              <div className="landing__field">
                <label htmlFor="login-email">Correo electrónico</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.cl"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="landing__field">
                <label htmlFor="login-password">Contraseña</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" variant="gold" size="lg" fullWidth disabled={loading}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </form>
          ) : (
            <form className="landing__auth-form" onSubmit={handleRegister} noValidate>
              <div className="landing__field-row">
                <div className="landing__field">
                  <label htmlFor="reg-nombre">Nombre</label>
                  <input
                    id="reg-nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ana"
                    required
                  />
                </div>
                <div className="landing__field">
                  <label htmlFor="reg-apellido">Apellido</label>
                  <input
                    id="reg-apellido"
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Valdés"
                    required
                  />
                </div>
              </div>
              <div className="landing__field">
                <label htmlFor="reg-email">Correo electrónico</label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.cl"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="landing__field">
                <label htmlFor="reg-password">Contraseña</label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" variant="gold" size="lg" fullWidth disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </Button>
            </form>
          )}

          <div className="landing__auth-divider">
            <span>o</span>
          </div>

          <Button variant="outline" size="md" fullWidth onClick={() => navigate('/explorar')}>
            Explorar sin cuenta
          </Button>
        </div>

        <div className="landing__features">
          {[
            { icon: '🗺️', label: 'Mapa interactivo' },
            { icon: '⭐', label: 'Recomendaciones' },
            { icon: '🔭', label: 'Turismo astronómico' },
            { icon: '🎉', label: 'Eventos locales' },
          ].map(({ icon, label }) => (
            <div key={label} className="landing__feature">
              <span>{icon}</span>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
