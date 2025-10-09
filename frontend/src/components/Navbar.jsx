import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'; // Usaremos CSS simple para los estilos

const Navbar = () => {
    const { user, isLoading, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Función para definir los enlaces basados en el rol
    const getNavLinks = (role) => {
        switch (role) {
            case 'Administrador':
                return [
                    { path: '/admin', name: 'Dashboard' },
                    { path: '/admin/incidents', name: 'Gestión de Incidentes' }, // NUEVO ENLACE
                    { path: '/admin/users', name: 'Gestión de Usuarios' },
                ];
            case 'Voluntario':
                return [
                    { path: '/volunteer', name: 'Mi Misión' },
                    { path: '/volunteer/incidents', name: 'Incidentes Activos' },
                ];
            case 'Estado':
                return [
                    { path: '/status', name: 'Mapa Operativo' },
                    { path: '/status/feed', name: 'Flujo de Incidentes' },
                ];
            default:
                return [];
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    if (isLoading || !user) {
        return null;
    }

    const links = getNavLinks(user.role);

    return (
        <nav className="navbar-container">
            <Link to={links[0]?.path || '/'} className="navbar-logo">
                SICI - {user.role}
            </Link>
            <ul className="navbar-list">
                {links.map(link => (
                    <li key={link.path} className="navbar-item">
                        <Link to={link.path} className="navbar-link">{link.name}</Link>
                    </li>
                ))}
            </ul>
            <button onClick={handleLogout} className="navbar-logout-btn">
                Salir ({user.username})
            </button>
        </nav>
    );
};

export default Navbar;
