import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const VolunteerResources = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div style={{ 
                padding: '2rem', 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '100vh'
            }}>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>🛠️ Recursos Disponibles</h1>
                    <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
                        Consulta de equipos y unidades de respuesta disponibles
                    </p>
                    
                    <div style={{
                        background: '#f8f9fa',
                        padding: '2rem',
                        borderRadius: '15px',
                        marginBottom: '2rem'
                    }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>📞 Contacto de Recursos</h3>
                        <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
                            Esta sección muestra todos los recursos disponibles para emergencias. 
                            Puedes consultar información de contacto y disponibilidad, pero no 
                            modificar los datos.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/volunteer')}
                        style={{
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        ← Volver al Dashboard
                    </button>
                </div>
            </div>
        </>
    );
};

export default VolunteerResources;