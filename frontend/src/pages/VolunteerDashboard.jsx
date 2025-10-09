import React from 'react';
import Navbar from '../components/Navbar'; // Asegúrate de importarla si la usas

const VolunteerDashboard = () => { // <--- El nombre del componente
    return (
        <>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <h1>Panel de Voluntario 🚒</h1>
                <p>Aquí se reciben las asignaciones de incidentes y se actualiza el estado de la misión.</p>
            </div>
        </>
    );
};

// ¡ESTA LÍNEA DEBE EXISTIR!
export default VolunteerDashboard;