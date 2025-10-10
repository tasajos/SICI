import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './VolunteerDashboard.css';

const VolunteerDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeIncidents: 0,
        myInvolvedIncidents: 0,
        availableUnits: 0,
        todayIncidents: 0,
        loading: true
    });

    // Cargar estadísticas al montar el componente
    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            // Hacer múltiples requests en paralelo
            const [incidentsResponse, unitsResponse] = await Promise.all([
                fetch('http://localhost:3310/api/incidents', { credentials: 'include' }),
                fetch('http://localhost:3310/api/units', { credentials: 'include' })
            ]);

            const incidentsData = await incidentsResponse.json();
            const unitsData = await unitsResponse.json();

            if (!incidentsResponse.ok || !unitsResponse.ok) {
                throw new Error('Error al cargar estadísticas');
            }

            // Calcular estadísticas
            const activeIncidents = (incidentsData.data || []).filter(incident => 
                incident.status === 'activo'
            ).length;

            const availableUnits = (unitsData.data || []).filter(unit => 
                unit.status === 'activo'
            ).length;

            // Calcular incidentes de hoy
            const today = new Date().toISOString().split('T')[0];
            const todayIncidents = (incidentsData.data || []).filter(incident => {
                const incidentDate = new Date(incident.created_at).toISOString().split('T')[0];
                return incidentDate === today;
            }).length;

            // Para voluntarios, mostramos 0 en "Mis Incidentes" por ahora
            // En una implementación real, esto vendría de la base de datos
            const myInvolvedIncidents = 0;

            setStats({
                activeIncidents,
                myInvolvedIncidents,
                availableUnits,
                todayIncidents,
                loading: false
            });

        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const cards = [
        {
            id: 1,
            title: '🆕 Crear Nuevo SCI',
            description: 'Inicia un nuevo Sistema de Comando de Incidentes',
            buttonText: 'Crear SCI',
            path: '/volunteer/create-sci',
            color: '#27ae60',
            icon: '➕'
        },
        {
            id: 2,
            title: '📋 Incidentes Activos',
            description: 'Consulta y monitorea todos los incidentes en curso',
            buttonText: 'Ver Incidentes',
            path: '/volunteer/incidents',
            color: '#e74c3c',
            icon: '🚨'
        },
        {
            id: 3,
            title: '🛠️ Recursos Disponibles',
            description: 'Consulta equipos y unidades de respuesta disponibles',
            buttonText: 'Ver Recursos',
            path: '/volunteer/resources',
            color: '#2980b9',
            icon: '👥'
        },
        {
            id: 4,
            title: '📝 Mis Reportes',
            description: 'Gestiona los reportes e incidentes en los que participas',
            buttonText: 'Mis Reportes',
            path: '/volunteer/my-reports',
            color: '#8e44ad',
            icon: '📋'
        },
        {
            id: 5,
            title: '🗺️ Mapa Operativo',
            description: 'Visualiza incidentes y recursos en tiempo real',
            buttonText: 'Ver Mapa',
            path: '/volunteer/map',
            color: '#f39c12',
            icon: '🗺️'
        },
        {
            id: 6,
            title: '📚 Guías Rápidas',
            description: 'Protocolos y procedimientos de respuesta',
            buttonText: 'Consultar',
            path: '/volunteer/guides',
            color: '#16a085',
            icon: '📚'
        }
    ];

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <>
            <Navbar />
            <div className="volunteer-dashboard">
                <div className="dashboard-header">
                    <h1>🚑 Panel de Voluntario</h1>
                    <p>Bienvenido al Sistema de Comando de Incidentes - Módulo de Respuesta</p>
                    <button 
                        className="refresh-stats-btn"
                        onClick={fetchDashboardStats}
                        disabled={stats.loading}
                    >
                        {stats.loading ? '🔄 Cargando...' : '🔄 Actualizar'}
                    </button>
                </div>
                
                {/* Estadísticas rápidas */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon">🚨</div>
                        <div className="stat-content">
                            <h4>Incidentes Activos</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.activeIncidents}</span>
                            )}
                            <p className="stat-description">Requieren atención inmediata</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">👤</div>
                        <div className="stat-content">
                            <h4>Mis Asignaciones</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.myInvolvedIncidents}</span>
                            )}
                            <p className="stat-description">Incidentes asignados</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">🛠️</div>
                        <div className="stat-content">
                            <h4>Recursos Disponibles</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.availableUnits}</span>
                            )}
                            <p className="stat-description">Unidades operativas</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h4>Nuevos Hoy</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.todayIncidents}</span>
                            )}
                            <p className="stat-description">Incidentes reportados hoy</p>
                        </div>
                    </div>
                </div>

                {/* Tarjetas de funcionalidades */}
                <div className="dashboard-cards">
                    {cards.map(card => (
                        <div 
                            key={card.id} 
                            className="dashboard-card"
                            style={{ '--card-color': card.color }}
                        >
                            <div className="card-icon">
                                {card.icon}
                            </div>
                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-description">{card.description}</p>
                            <button 
                                className="card-button"
                                onClick={() => handleCardClick(card.path)}
                            >
                                {card.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Alertas y notificaciones */}
                <div className="alerts-section">
                    <h3>⚠️ Alertas Importantes</h3>
                    <div className="alerts-container">
                        <div className="alert-item critical">
                            <div className="alert-icon">🚨</div>
                            <div className="alert-content">
                                <h4>Incidentes Críticos Activos</h4>
                                <p>
                                    {stats.activeIncidents > 0 
                                        ? `Existen ${stats.activeIncidents} incidente(s) requiriendo respuesta inmediata.`
                                        : 'No hay incidentes críticos activos en este momento.'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="alert-item info">
                            <div className="alert-icon">📋</div>
                            <div className="alert-content">
                                <h4>Recordatorio de Protocolos</h4>
                                <p>Sigue los procedimientos establecidos y reporta cualquier situación anómala inmediatamente.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="quick-actions">
                    <h3>🚀 Acciones Inmediatas</h3>
                    <div className="action-buttons">
                        <button 
                            className="action-btn emergency"
                            onClick={() => navigate('/volunteer/create-sci')}
                        >
                            🚨 Reportar Emergencia
                        </button>
                        <button 
                            className="action-btn primary"
                            onClick={() => navigate('/volunteer/incidents')}
                        >
                            📋 Ver Todos los Incidentes
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => navigate('/volunteer/resources')}
                        >
                            🛠️ Consultar Recursos
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VolunteerDashboard;