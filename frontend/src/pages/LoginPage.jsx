import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx'; 
// CORRECCIÓN: Usar ./LoginPage.css porque está en la misma carpeta 'pages'
import './LoginPage.css'; 

const LoginPage = () => {
    // Usamos el contexto para acceder a la función login y logout
    const { login, logout } = useContext(AuthContext); 
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Administrador'); 
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const roles = ['Administrador', 'Voluntario', 'Estado'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Intentar iniciar sesión
            const loggedInUser = await login(username, password); 
            
            const userRole = loggedInUser.role;
            const targetRole = role; 

            // 2. Verificar que el rol seleccionado coincida con el rol de la DB
            if (userRole === targetRole) {
                // Redirección exitosa basada en el rol
                if (userRole === 'Administrador') navigate('/admin');
                else if (userRole === 'Voluntario') navigate('/volunteer');
                else if (userRole === 'Estado') navigate('/status');
            } else {
                // Si el login fue exitoso pero el rol no coincide
                setError(`Tu rol registrado es "${userRole}". Selecciona el rol correcto.`);
                // Forzamos el cierre de sesión para limpiar la cookie
                await logout();
            }

        } catch (err) {
            // Manejar errores de credenciales (401) o conexión
             if (err.response && err.response.status === 401) {
                setError('Credenciales inválidas. Verifica tu usuario, contraseña.');
            } else {
                setError('Error de conexión. Asegúrate de que el backend esté operativo (Puerto 3310).');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">SICI</h1>
                <p className="login-subtitle">Sistema de Comando de Incidentes</p>

                <form onSubmit={handleSubmit}>
                    
                    {/* Selector de Rol */}
                    <div className="form-group">
                        <label className="form-label">Rol de Acceso:</label>
                        <select 
                            className="form-select"
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            {roles.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    {/* Campo de Usuario */}
                    <div className="form-group">
                        <label className="form-label">Usuario:</label>
                        <input
                            className="form-input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo de Contraseña */}
                    <div className="form-group">
                        <label className="form-label">Contraseña:</label>
                        <input
                            className="form-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Mensaje de Error */}
                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" className="login-button">
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
