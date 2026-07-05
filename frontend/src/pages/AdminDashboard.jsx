import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { ADMIN_NAV } from '../config/nav';
import { AuthContext } from '../context/AuthContext';
import '../styles/dashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        activeIncidents: 0,
        availableUnits: 0,
        totalUsers: 0,
        todayIncidents: 0,
        loading: true
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        setStats(prev => ({ ...prev, loading: true }));
        try {
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

            const activeIncidents = (incidentsData.data || []).filter(i => i.status === 'activo').length;
            const availableUnits = (unitsData.data || []).filter(u => u.status === 'activo').length;
            const totalUsers = (usersData.data || []).length;

            const today = new Date().toISOString().split('T')[0];
            const todayIncidents = (incidentsData.data || []).filter(incident => {
                const incidentDate = new Date(incident.created_at).toISOString().split('T')[0];
                return incidentDate === today;
            }).length;

            setStats({ activeIncidents, availableUnits, totalUsers, todayIncidents, loading: false });
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const cards = [
        { id: 1, title: 'Listado de Incidentes Actuales', description: 'Gestiona y monitorea todos los incidentes activos en el sistema', buttonText: 'Ver Incidentes', path: '/admin/incidents', color: '#e74c3c', icon: '🚨' },
        { id: 2, title: 'Crear un SCI Nuevo', description: 'Inicia un nuevo Sistema de Comando de Incidentes', buttonText: 'Crear SCI', path: '/admin/create-sci', color: '#27ae60', icon: '➕' },
        { id: 3, title: 'Equipos y Unidades', description: 'Administra recursos, equipos y personal disponible', buttonText: 'Gestionar Recursos', path: '/admin/resources', color: '#2980b9', icon: '🛠️' },
        { id: 4, title: 'Reportes y Estadísticas', description: 'Genera reportes y visualiza métricas del sistema', buttonText: 'Ver Reportes', path: '/admin/reports', color: '#8e44ad', icon: '📊' },
        { id: 5, title: 'Configuración del Sistema', description: 'Configura parámetros y preferencias del SICI', buttonText: 'Configurar', path: '/admin/settings', color: '#f39c12', icon: '⚙️' },
        { id: 6, title: 'Gestión de Usuarios', description: 'Administra usuarios, roles y permisos del sistema', buttonText: 'Gestionar Usuarios', path: '/admin/users', color: '#16a085', icon: '👥' },
        { id: 7, title: 'Monitoreo en Tiempo Real', description: 'Monitorea actividad del sistema, logs y rendimiento', buttonText: 'Ir al Monitoreo', path: '/admin/monitoring', color: '#9b59b6', icon: '📡' }
    ];

    const kpis = [
        { key: 'activeIncidents', label: 'Incidentes Activos', hint: 'En este momento', icon: '🚨', accent: '#e74c3c' },
        { key: 'availableUnits', label: 'Equipos Disponibles', hint: 'Listos para acción', icon: '🛠️', accent: '#27ae60' },
        { key: 'totalUsers', label: 'Usuarios Totales', hint: 'Registrados', icon: '👥', accent: '#2980b9' },
        { key: 'todayIncidents', label: 'SCI Creados Hoy', hint: new Date().toLocaleDateString('es-ES'), icon: '📅', accent: '#f39c12' },
    ];

    const refreshBtn = (
        <button className="app-btn" onClick={fetchDashboardStats} disabled={stats.loading}>
            <span className={stats.loading ? 'app-spin' : ''}>🔄</span>
            {stats.loading ? 'Cargando...' : 'Actualizar'}
        </button>
    );

    return (
        <AppLayout
            navItems={ADMIN_NAV}
            subtitle="Panel de Administración"
            title="Panel de Control"
            pageSubtitle={`Bienvenido${user?.username ? `, ${user.username}` : ''} 👋`}
            actions={refreshBtn}
        >
            {/* KPIs */}
            <section className="kpi-grid">
                {kpis.map(kpi => (
                    <div className="kpi-card" key={kpi.key} style={{ '--accent': kpi.accent }}>
                        <div className="kpi-card__icon">{kpi.icon}</div>
                        <div className="kpi-card__body">
                            <span className="kpi-card__label">{kpi.label}</span>
                            {stats.loading
                                ? <span className="kpi-card__value is-loading">···</span>
                                : <span className="kpi-card__value">{stats[kpi.key]}</span>}
                            <span className="kpi-card__hint">{kpi.hint}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* Estado del sistema */}
            <section className={`system-banner ${stats.activeIncidents > 0 ? 'is-active' : 'is-normal'}`}>
                <div className="system-banner__badge">
                    {stats.activeIncidents > 0 ? '🚨 ACTIVO' : '✅ NORMAL'}
                </div>
                <p>
                    El sistema se encuentra{' '}
                    <strong>{stats.activeIncidents > 0 ? 'en estado activo' : 'en estado normal'}</strong>
                    {' '}con {stats.activeIncidents} incidente(s) requiriendo atención.
                </p>
                <span className="system-banner__time">
                    Actualizado: {new Date().toLocaleTimeString('es-ES')}
                </span>
            </section>

            {/* Accesos rápidos */}
            <h2 className="section-title">Accesos rápidos</h2>
            <section className="module-grid">
                {cards.map(card => (
                    <button
                        key={card.id}
                        className="module-card"
                        style={{ '--card-color': card.color }}
                        onClick={() => navigate(card.path)}
                    >
                        <div className="module-card__icon">{card.icon}</div>
                        <div className="module-card__text">
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </div>
                        <span className="module-card__cta">{card.buttonText} →</span>
                    </button>
                ))}
            </section>
        </AppLayout>
    );
};

export default AdminDashboard;
