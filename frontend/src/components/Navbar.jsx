import React, { useContext } from 'react'; // <-- useContext
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // <-- Importar el Contexto
import styled from 'styled-components';

// ... (Estilos styled-components se mantienen igual) ...

// --- Lógica del Componente ---
const Navbar = () => {
    const { user, isLoading, logout } = useContext(AuthContext); // <-- Usamos useContext
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout(); // La función logout del contexto ya redirige a '/'
    };

    if (isLoading || !user) {
        return null; // Opcional: Esto no debería pasar en rutas protegidas, pero es seguro.
    }

    // ... (La lógica de getNavLinks(role) se mantiene igual) ...

    const links = getNavLinks(user.role);

    return (
        <NavContainer>
            <Logo to={links[0]?.path || '/'}>
                SICI - {user.role}
            </Logo>
            <NavList>
                {links.map(link => (
                    <NavItem key={link.path}>
                        <NavLink to={link.path}>{link.name}</NavLink>
                    </NavItem>
                ))}
            </NavList>
            <LogoutButton onClick={handleLogout}>
                Salir ({user.username})
            </LogoutButton>
        </NavContainer>
    );
};

export default Navbar;