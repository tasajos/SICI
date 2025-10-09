import React, { useContext } from 'react'; // <-- useContext
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // <-- Importar el Contexto

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, isLoading } = useContext(AuthContext); // <-- Usamos useContext

    if (isLoading) {
        return <div style={{textAlign: 'center', padding: '50px', fontSize: '24px', color: '#e74c3c'}}>Cargando sistema de seguridad...</div>;
    }

    if (user && allowedRoles.includes(user.role)) {
        // Usuario autenticado y con el rol correcto: permite el acceso
        return <Outlet />;
    } else if (user) {
        // Autenticado, pero rol incorrecto: muestra un error de permiso
        return <Navigate to="/unauthorized" replace />; // Redirige a una página de No Autorizado
    } else {
        // No autenticado: redirige al login
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;