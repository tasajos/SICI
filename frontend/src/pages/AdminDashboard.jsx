import React from 'react';
import Navbar from '../components/Navbar'; 

const AdminDashboard = () => { // <--- El nombre del componente
    return (
        <>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <h1>Panel de Administrador 🚨</h1>
                <p>Aquí se gestionan usuarios, roles y la configuración general del SICI.</p>
            </div>
        </>
    );
};

// ¡Asegúrate de que esta línea exista!
export default AdminDashboard;