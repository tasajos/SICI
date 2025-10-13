import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeIncidents: 0,
        availableUnits: 0,
        totalUsers: 0,
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
            const [incidentsResponse, usersResponse, unitsResponse] = await Promise.all([
                fetch('http://localhost:3310/api/incidents', { credentials: 'include' }),
                fetch('http://localhost:3310/api/users', { credentials: 'include' }),
                fetch('http://localhost:3310/api/units', { credentials: 'include' })
            ]);

            const incidentsData = await incidentsResponse.json();
            const usersData = await usersResponse.json();
            const unitsData = await unitsResponse.json();

            if (!incidentsResponse.ok || !usersResponse.ok || !unitsResponse.ok) {
                throw new Error('Error al cargar estadísticas');
            }

            // Calcular estadísticas
            const activeIncidents = (incidentsData.data || []).filter(incident => 
                incident.status === 'activo'
            ).length;

            const availableUnits = (unitsData.data || []).filter(unit => 
                unit.status === 'activo'
            ).length;

            const totalUsers = (usersData.data || []).length;

            // Calcular incidentes de hoy
            const today = new Date().toISOString().split('T')[0];
            const todayIncidents = (incidentsData.data || []).filter(incident => {
                const incidentDate = new Date(incident.created_at).toISOString().split('T')[0];
                return incidentDate === today;
            }).length;

            setStats({
                activeIncidents,
                availableUnits,
                totalUsers,
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
            title: '📋 Listado de Comandos de Incidentes Actuales',
            description: 'Gestiona y monitorea todos los incidentes activos en el sistema',
            buttonText: 'Ver Incidentes',
            path: '/admin/incidents',
            color: '#e74c3c',
            icon: '🚨'
        },
        {
            id: 2,
            title: '🆕 Crear un SCI Nuevo',
            description: 'Inicia un nuevo Sistema de Comando de Incidentes',
            buttonText: 'Crear SCI',
            path: '/admin/create-sci',
            color: '#27ae60',
            icon: '➕'
        },
        {
            id: 3,
            title: '👥 Equipos y Unidades Disponibles',
            description: 'Administra recursos, equipos y personal disponible',
            buttonText: 'Gestionar Recursos',
            path: '/admin/resources',
            color: '#2980b9',
            icon: '🛠️'
        },
        {
            id: 4,
            title: '📊 Reportes y Estadísticas',
            description: 'Genera reportes y visualiza métricas del sistema',
            buttonText: 'Ver Reportes',
            path: '/admin/reports',
            color: '#8e44ad',
            icon: '📈'
        },
        {
            id: 5,
            title: '⚙️ Configuración del Sistema',
            description: 'Configura parámetros y preferencias del SICI',
            buttonText: 'Configurar',
            path: '/admin/settings',
            color: '#f39c12',
            icon: '⚙️'
        },
        {
            id: 6,
            title: '👤 Gestión de Usuarios',
            description: 'Administra usuarios, roles y permisos del sistema',
            buttonText: 'Gestionar Usuarios',
            path: '/admin/users',
            color: '#16a085',
            icon: '👥'
        },
        {
            id: 7,
            title: '📡 Monitoreo en Tiempo Real',
            description: 'Monitorea actividad del sistema, logs y rendimiento en tiempo real',
            buttonText: 'Ir al Monitoreo',
            path: '/admin/monitoring',
            color: '#9b59b6',
            icon: '📡'
        }
    ];

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <>
            <Navbar />
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h1>Panel de Control - Administrador</h1>
                    <p>Gestiona todos los aspectos del Sistema de Comando de Incidentes</p>
                    <button 
                        className="refresh-stats-btn"
                        onClick={fetchDashboardStats}
                        disabled={stats.loading}
                    >
                        {stats.loading ? '🔄 Cargando...' : '🔄 Actualizar Estadísticas'}
                    </button>
                </div>
                
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
                            <p className="stat-description">En este momento</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">🛠️</div>
                        <div className="stat-content">
                            <h4>Equipos Disponibles</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.availableUnits}</span>
                            )}
                            <p className="stat-description">Listos para acción</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h4>Usuarios Totales</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.totalUsers}</span>
                            )}
                            <p className="stat-description">Registrados en el sistema</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h4>SCI Creados Hoy</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.todayIncidents}</span>
                            )}
                            <p className="stat-description">{new Date().toLocaleDateString('es-ES')}</p>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="dashboard-info">
                    <div className="info-card">
                        <h3>📈 Resumen del Sistema</h3>
                        <div className="info-content">
                            <p>
                                El Sistema de Comando de Incidentes (SICI) se encuentra 
                                <strong> {stats.activeIncidents > 0 ? 'en estado activo' : 'en estado normal'}</strong> 
                                con {stats.activeIncidents} incidente(s) requiriendo atención.
                            </p>
                            <div className="info-stats">
                                <span className={`status-indicator ${stats.activeIncidents > 0 ? 'active' : 'normal'}`}>
                                    {stats.activeIncidents > 0 ? '🚨 ACTIVO' : '✅ NORMAL'}
                                </span>
                                <span className="last-update">
                                    Actualizado: {new Date().toLocaleTimeString('es-ES')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;