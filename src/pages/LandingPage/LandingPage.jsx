import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/ui/BrandLogo';
import Icon from '../../components/ui/Icon';
import Button from '../../components/ui/Button';
import FeedbackBanner from '../../components/ui/FeedbackBanner';
import './LandingPage.css';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
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
      setSuccessMsg(
        'Cuenta creada. Revisa tu correo para confirmar tu cuenta y luego inicia sesión.'
      );
      setTab('login');
    }
  }

  return (
    <main className="landing">
      <div className="landing__overlay" aria-hidden="true" />

      <div className="landing__content">
        <div className="landing__brand">
          <BrandLogo variant="dark" size="lg" stacked />
          <p className="landing__tagline">Explora tu próximo camino</p>
        </div>

        {!showAuth ? (
          <div className="landing__welcome">
            <div className="landing__headline-row">
              <h1 className="landing__headline">
                Andacollo
                <span>te encanta</span>
              </h1>
              <span className="landing__headline-heart" aria-hidden="true">
                <Icon name="heart" size={42} strokeWidth={1.8} />
              </span>
            </div>

            <p className="landing__subtitle">
              Tierra minera, religiosa y astronómica.
            </p>

            <div className="landing__cta-group">
              <Button
                variant="gold"
                size="lg"
                fullWidth
                onClick={(e) => {
                  if (e && e.preventDefault) e.preventDefault();
                  setShowAuth(true);
                }}
              >
                Comenzar
              </Button>
              <button
                type="button"
                className="landing__guest-btn"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/explorar');
                }}
              >
                Explorar sin cuenta
              </button>
            </div>
          </div>
        ) : (
          <div className="landing__auth-card">
            <div className="landing__auth-top">
              <button
                type="button"
                className="landing__auth-back"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAuth(false);
                  setError('');
                  setSuccessMsg('');
                }}
                aria-label="Volver a bienvenida"
              >
                <Icon name="chevron-left" size={18} />
                <span>Volver</span>
              </button>
            </div>

            <div className="landing__auth-tabs">
              <button
                type="button"
                className={`landing__auth-tab ${tab === 'login' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setTab('login');
                  setError('');
                  setSuccessMsg('');
                }}
              >
                Ingresar
              </button>
              <button
                type="button"
                className={`landing__auth-tab ${tab === 'register' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setTab('register');
                  setError('');
                  setSuccessMsg('');
                }}
              >
                Registrarse
              </button>
            </div>

            <FeedbackBanner type="error" message={error} onDismiss={() => setError('')} />
            <FeedbackBanner
              type="success"
              message={successMsg}
              onDismiss={() => setSuccessMsg('')}
            />

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

            <button
              type="button"
              className="landing__guest-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate('/explorar');
              }}
            >
              Explorar sin cuenta
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
