import React from 'react';
import Navbar from '../components/Navbar'; // Asegúrate de importarla si la usas

const StatusDashboard = () => { // <--- El nombre del componente
    return (
        <>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <h1>Panel de Estado (Visualización) 🗺️</h1>
                <p>Este panel solo muestra información en tiempo real de los incidentes activos.</p>
            </div>
        </>
    );
};

// ¡ESTA LÍNEA DEBE EXISTIR!
export default StatusDashboard;