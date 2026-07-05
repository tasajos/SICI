import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import './LoginPage.css';
import SiciLogo from '../assets/sici_t.png';

// Rutas de destino según el rol registrado del usuario.
const ROLE_ROUTES = {
    Administrador: '/admin',
    Voluntario: '/volunteer',
    Estado: '/status',
};

const LoginPage = () => {
    const { login, logout } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const loggedInUser = await login(username, password);
            const targetRoute = ROLE_ROUTES[loggedInUser.role];

            if (targetRoute) {
                // Redirección automática según el rol devuelto por el backend.
                navigate(targetRoute);
            } else {
                setError('Tu usuario no tiene un rol válido asignado. Contacta al administrador.');
                await logout();
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Credenciales inválidas. Verifica tu usuario y contraseña.');
            } else {
                setError('Error de conexión. Asegúrate de que el backend esté operativo (Puerto 3310).');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                {/* Panel de marca (izquierda en escritorio) */}
                <aside className="login-brand">
                    <div className="login-brand__content">
                        <img src={SiciLogo} alt="Logo SICI" className="login-brand__logo" />
                        <h2 className="login-brand__title">SICI</h2>
                        <p className="login-brand__tagline">
                            Sistema de Comando de Incidentes
                        </p>
                        <ul className="login-brand__features">
                            <li>Gestión coordinada de emergencias</li>
                            <li>Formularios SCI estandarizados</li>
                            <li>Monitoreo en tiempo real</li>
                        </ul>
                    </div>
                    <p className="login-brand__footer">© {new Date().getFullYear()} SICI · ChakuySoft</p>
                </aside>

                {/* Panel de formulario (derecha en escritorio) */}
                <section className="login-form-panel">
                    <img src={SiciLogo} alt="Logo SICI" className="login-form-panel__logo" />

                    <header className="login-form-panel__header">
                        <h1>Bienvenido</h1>
                        <p>Inicia sesión para acceder al sistema</p>
                    </header>

                    <form onSubmit={handleSubmit} className="login-form" noValidate>

                        {/* Usuario */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">Usuario</label>
                            <div className="input-wrapper">
                                <UserIcon />
                                <input
                                    id="username"
                                    className="form-input"
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Contraseña */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Contraseña</label>
                            <div className="input-wrapper">
                                <LockIcon />
                                <input
                                    id="password"
                                    className="form-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Ingresa tu contraseña"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="error-text" role="alert">
                                <AlertIcon />
                                <span>{error}</span>
                            </p>
                        )}

                        <button type="submit" className="login-button" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="spinner" aria-hidden="true" />
                                    Ingresando...
                                </>
                            ) : (
                                'Ingresar'
                            )}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

/* --- Iconos SVG inline (sin dependencias externas) --- */
const UserIcon = () => (
    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const LockIcon = () => (
    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const EyeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default LoginPage;
