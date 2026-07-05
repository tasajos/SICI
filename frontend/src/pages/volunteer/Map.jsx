import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { VOLUNTEER_NAV } from '../../config/nav';

const VolunteerMap = () => {
    const navigate = useNavigate();

    return (
        <AppLayout navItems={VOLUNTEER_NAV} subtitle="Panel de Voluntario" title="Mapa Operativo">
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
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>🗺️ Mapa Operativo</h1>
                    <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
                        Visualización de incidentes y recursos en tiempo real
                    </p>
                    
                    <div style={{
                        background: '#f8f9fa',
                        padding: '2rem',
                        borderRadius: '15px',
                        marginBottom: '2rem'
                    }}>
                        <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
                            El mapa operativo muestra la ubicación de todos los incidentes activos 
                            y los recursos disponibles en tiempo real.
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
        </AppLayout>
    );
};

export default VolunteerMap;