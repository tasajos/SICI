import React, { useState, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { STATUS_NAV } from '../config/nav';
import '../styles/dashboard.css';

const StatusDashboard = () => {
    const [stats, setStats] = useState({ activeIncidents: 0, availableUnits: 0, todayIncidents: 0, loading: true });

    useEffect(() => { fetchStats(); }, []);

    const fetchStats = async () => {
        setStats(prev => ({ ...prev, loading: true }));
        try {
            const [incidentsResponse, unitsResponse] = await Promise.all([
                fetch('http://localhost:3310/api/incidents', { credentials: 'include' }),
                fetch('http://localhost:3310/api/units', { credentials: 'include' })
            ]);
            const incidentsData = await incidentsResponse.json();
            const unitsData = await unitsResponse.json();

            const activeIncidents = (incidentsData.data || []).filter(i => i.status === 'activo').length;
            const availableUnits = (unitsData.data || []).filter(u => u.status === 'activo').length;
            const today = new Date().toISOString().split('T')[0];
            const todayIncidents = (incidentsData.data || []).filter(i => {
                const d = new Date(i.created_at).toISOString().split('T')[0];
                return d === today;
            }).length;

            setStats({ activeIncidents, availableUnits, todayIncidents, loading: false });
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const kpis = [
        { key: 'activeIncidents', label: 'Incidentes Activos', hint: 'En tiempo real', icon: '🚨', accent: '#e74c3c' },
        { key: 'availableUnits', label: 'Unidades Operativas', hint: 'Disponibles', icon: '🛠️', accent: '#27ae60' },
        { key: 'todayIncidents', label: 'Reportados Hoy', hint: new Date().toLocaleDateString('es-ES'), icon: '📅', accent: '#f39c12' },
    ];

    const refreshBtn = (
        <button className="app-btn" onClick={fetchStats} disabled={stats.loading}>
            <span className={stats.loading ? 'app-spin' : ''}>🔄</span>
            {stats.loading ? 'Cargando...' : 'Actualizar'}
        </button>
    );

    return (
        <AppLayout
            navItems={STATUS_NAV}
            subtitle="Panel de Estado"
            title="Panel de Estado 🗺️"
            pageSubtitle="Visualización en tiempo real de los incidentes activos"
            actions={refreshBtn}
        >
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

            <section className={`system-banner ${stats.activeIncidents > 0 ? 'is-active' : 'is-normal'}`}>
                <div className="system-banner__badge">
                    {stats.activeIncidents > 0 ? '🚨 ACTIVO' : '✅ NORMAL'}
                </div>
                <p>
                    El sistema se encuentra{' '}
                    <strong>{stats.activeIncidents > 0 ? 'en estado activo' : 'en estado normal'}</strong>
                    {' '}con {stats.activeIncidents} incidente(s) activo(s).
                </p>
                <span className="system-banner__time">
                    Actualizado: {new Date().toLocaleTimeString('es-ES')}
                </span>
            </section>
        </AppLayout>
    );
};

export default StatusDashboard;
