import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './Reports.css';

const Reports = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [incidents, setIncidents] = useState([]);
    const [users, setUsers] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchData();
    }, [timeRange]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // En una aplicación real, estos serían endpoints específicos para reportes
            const [incidentsResponse, usersResponse, unitsResponse] = await Promise.all([
                fetch('http://localhost:3310/api/incidents', { credentials: 'include' }),
                fetch('http://localhost:3310/api/users', { credentials: 'include' }),
                fetch('http://localhost:3310/api/units', { credentials: 'include' })
            ]);

            const incidentsData = await incidentsResponse.json();
            const usersData = await usersResponse.json();
            const unitsData = await unitsResponse.json();

            if (!incidentsResponse.ok || !usersResponse.ok || !unitsResponse.ok) {
                throw new Error('Error al cargar datos para reportes');
            }

            setIncidents(incidentsData.data || []);
            setUsers(usersData.data || []);
            setUnits(unitsData.data || []);

            // Calcular estadísticas
            calculateStats(incidentsData.data || [], usersData.data || [], unitsData.data || []);

        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (incidentsData, usersData, unitsData) => {
        const currentDate = new Date();
        let startDate;

        switch (timeRange) {
            case '7d':
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
                break;
            case '30d':
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
                break;
            case '90d':
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 90));
                break;
            case '1y':
                startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
                break;
            default:
                startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
        }

        // Filtrar datos por rango de tiempo
        const filteredIncidents = incidentsData.filter(incident => 
            new Date(incident.created_at) >= startDate
        );

        // Estadísticas de incidentes
        const incidentStats = {
            total: filteredIncidents.length,
            active: filteredIncidents.filter(i => i.status === 'activo').length,
            closed: filteredIncidents.filter(i => i.status === 'cerrado').length,
            suspended: filteredIncidents.filter(i => i.status === 'suspendido').length,
            byType: getIncidentsByType(filteredIncidents),
            bySeverity: getIncidentsBySeverity(filteredIncidents),
            monthlyTrend: getMonthlyTrend(filteredIncidents)
        };

        // Estadísticas de usuarios
        const userStats = {
            total: usersData.length,
            active: usersData.filter(u => u.is_active).length,
            byRole: getUsersByRole(usersData),
            newThisPeriod: usersData.filter(u => new Date(u.created_at) >= startDate).length
        };

        // Estadísticas de unidades
        const unitStats = {
            total: unitsData.length,
            emergency: unitsData.filter(u => u.is_emergency_unit).length,
            support: unitsData.filter(u => !u.is_emergency_unit).length,
            available: unitsData.filter(u => u.status === 'activo').length,
            onMission: unitsData.filter(u => u.status === 'en_mision').length,
            totalPersonnel: unitsData.reduce((sum, unit) => sum + unit.available_members, 0),
            totalVehicles: unitsData.reduce((sum, unit) => sum + unit.available_vehicles, 0),
            byType: getUnitsByType(unitsData)
        };

        setStats({
            incidents: incidentStats,
            users: userStats,
            units: unitStats,
            timeRange
        });
    };

    const getIncidentsByType = (incidents) => {
        const types = {};
        incidents.forEach(incident => {
            types[incident.incident_type] = (types[incident.incident_type] || 0) + 1;
        });
        return Object.entries(types)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count);
    };

    const getIncidentsBySeverity = (incidents) => {
        const severities = {
            bajo: 0,
            medio: 0,
            alto: 0,
            critico: 0
        };
        incidents.forEach(incident => {
            severities[incident.severity_level] = (severities[incident.severity_level] || 0) + 1;
        });
        return severities;
    };

    const getMonthlyTrend = (incidents) => {
        const months = {};
        incidents.forEach(incident => {
            const date = new Date(incident.created_at);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            months[monthKey] = (months[monthKey] || 0) + 1;
        });
        
        return Object.entries(months)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-6); // Últimos 6 meses
    };

    const getUsersByRole = (users) => {
        const roles = {};
        users.forEach(user => {
            roles[user.role_name] = (roles[user.role_name] || 0) + 1;
        });
        return roles;
    };

    const getUnitsByType = (units) => {
        const types = {};
        units.forEach(unit => {
            types[unit.unit_type_name] = (types[unit.unit_type_name] || 0) + 1;
        });
        return Object.entries(types)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count);
    };

    const getTimeRangeLabel = () => {
        const labels = {
            '7d': 'Últimos 7 días',
            '30d': 'Últimos 30 días',
            '90d': 'Últimos 90 días',
            '1y': 'Último año'
        };
        return labels[timeRange] || 'Últimos 30 días';
    };

    const getSeverityColor = (severity) => {
        const colors = {
            bajo: '#27ae60',
            medio: '#f39c12',
            alto: '#e67e22',
            critico: '#e74c3c'
        };
        return colors[severity] || '#95a5a6';
    };

    const getRoleColor = (role) => {
        const colors = {
            'Administrador': '#e74c3c',
            'Voluntario': '#3498db',
            'Estado': '#9b59b6'
        };
        return colors[role] || '#95a5a6';
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="reports-container">
                    <div className="loading-spinner">Cargando reportes...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="reports-container">
                <div className="reports-header">
                    <button className="back-button" onClick={() => navigate('/admin')}>
                        ← Volver al Dashboard
                    </button>
                    <h1>📊 Reportes y Estadísticas</h1>
                    <p>Análisis completo del sistema SICI - Período: {getTimeRangeLabel()}</p>
                </div>

                {/* Filtros de tiempo */}
                <div className="time-filters">
                    <div className="filter-buttons">
                        <button 
                            className={`time-btn ${timeRange === '7d' ? 'active' : ''}`}
                            onClick={() => setTimeRange('7d')}
                        >
                            7 Días
                        </button>
                        <button 
                            className={`time-btn ${timeRange === '30d' ? 'active' : ''}`}
                            onClick={() => setTimeRange('30d')}
                        >
                            30 Días
                        </button>
                        <button 
                            className={`time-btn ${timeRange === '90d' ? 'active' : ''}`}
                            onClick={() => setTimeRange('90d')}
                        >
                            90 Días
                        </button>
                        <button 
                            className={`time-btn ${timeRange === '1y' ? 'active' : ''}`}
                            onClick={() => setTimeRange('1y')}
                        >
                            1 Año
                        </button>
                    </div>
                    <button className="refresh-btn" onClick={fetchData}>
                        🔄 Actualizar Datos
                    </button>
                </div>

                {/* Resumen General */}
                <div className="summary-cards">
                    <div className="summary-card primary">
                        <div className="summary-icon">🚨</div>
                        <div className="summary-content">
                            <h3>{stats.incidents?.total || 0}</h3>
                            <p>Incidentes Totales</p>
                            <div className="summary-details">
                                <span className="active">{stats.incidents?.active || 0} Activos</span>
                                <span className="closed">{stats.incidents?.closed || 0} Cerrados</span>
                            </div>
                        </div>
                    </div>

                    <div className="summary-card success">
                        <div className="summary-icon">👥</div>
                        <div className="summary-content">
                            <h3>{stats.users?.total || 0}</h3>
                            <p>Usuarios Registrados</p>
                            <div className="summary-details">
                                <span className="active">{stats.users?.active || 0} Activos</span>
                                <span className="new">{stats.users?.newThisPeriod || 0} Nuevos</span>
                            </div>
                        </div>
                    </div>

                    <div className="summary-card warning">
                        <div className="summary-icon">🛠️</div>
                        <div className="summary-content">
                            <h3>{stats.units?.total || 0}</h3>
                            <p>Unidades Operativas</p>
                            <div className="summary-details">
                                <span className="available">{stats.units?.available || 0} Disponibles</span>
                                <span className="mission">{stats.units?.onMission || 0} En Misión</span>
                            </div>
                        </div>
                    </div>

                    <div className="summary-card info">
                        <div className="summary-icon">🚗</div>
                        <div className="summary-content">
                            <h3>{stats.units?.totalVehicles || 0}</h3>
                            <p>Vehículos Totales</p>
                            <div className="summary-details">
                                <span className="personnel">{stats.units?.totalPersonnel || 0} Personal</span>
                                <span className="emergency">{stats.units?.emergency || 0} Emergencia</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráficos y Estadísticas Detalladas */}
                <div className="charts-grid">
                    {/* Incidentes por Tipo */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>📋 Incidentes por Tipo</h3>
                            <span className="chart-subtitle">Distribución por categoría</span>
                        </div>
                        <div className="chart-content">
                            {stats.incidents?.byType?.length > 0 ? (
                                <div className="bar-chart">
                                    {stats.incidents.byType.map((item, index) => (
                                        <div key={item.type} className="bar-item">
                                            <div className="bar-label">
                                                <span>{item.type}</span>
                                                <span className="bar-count">{item.count}</span>
                                            </div>
                                            <div className="bar-track">
                                                <div 
                                                    className="bar-fill"
                                                    style={{
                                                        width: `${(item.count / stats.incidents.total) * 100}%`,
                                                        backgroundColor: `hsl(${index * 40}, 70%, 50%)`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-data">No hay datos de incidentes</div>
                            )}
                        </div>
                    </div>

                    {/* Severidad de Incidentes */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>⚠️ Niveles de Severidad</h3>
                            <span className="chart-subtitle">Distribución por gravedad</span>
                        </div>
                        <div className="chart-content">
                            <div className="severity-grid">
                                {Object.entries(stats.incidents?.bySeverity || {}).map(([severity, count]) => (
                                    <div key={severity} className="severity-item">
                                        <div 
                                            className="severity-dot"
                                            style={{ backgroundColor: getSeverityColor(severity) }}
                                        ></div>
                                        <div className="severity-info">
                                            <span className="severity-level">
                                                {severity.charAt(0).toUpperCase() + severity.slice(1)}
                                            </span>
                                            <span className="severity-count">{count}</span>
                                        </div>
                                        <div className="severity-percentage">
                                            {((count / stats.incidents.total) * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Distribución de Usuarios */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>👤 Usuarios por Rol</h3>
                            <span className="chart-subtitle">Distribución de permisos</span>
                        </div>
                        <div className="chart-content">
                            <div className="pie-chart-container">
                                {Object.entries(stats.users?.byRole || {}).map(([role, count], index) => (
                                    <div key={role} className="pie-item">
                                        <div className="pie-slice">
                                            <div 
                                                className="pie-color"
                                                style={{ backgroundColor: getRoleColor(role) }}
                                            ></div>
                                            <span className="pie-label">{role}</span>
                                        </div>
                                        <div className="pie-info">
                                            <span className="pie-count">{count}</span>
                                            <span className="pie-percentage">
                                                {((count / stats.users.total) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Unidades por Tipo */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>🏢 Unidades por Tipo</h3>
                            <span className="chart-subtitle">Distribución operativa</span>
                        </div>
                        <div className="chart-content">
                            {stats.units?.byType?.length > 0 ? (
                                <div className="units-grid">
                                    {stats.units.byType.map((item, index) => (
                                        <div key={item.type} className="unit-type-item">
                                            <div className="unit-type-header">
                                                <span className="unit-type-name">{item.type}</span>
                                                <span className="unit-type-count">{item.count}</span>
                                            </div>
                                            <div className="unit-type-bar">
                                                <div 
                                                    className="unit-type-fill"
                                                    style={{
                                                        width: `${(item.count / stats.units.total) * 100}%`,
                                                        backgroundColor: `hsl(${index * 60}, 80%, 45%)`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-data">No hay datos de unidades</div>
                            )}
                        </div>
                    </div>

                    {/* Tendencias Mensuales */}
                    <div className="chart-card full-width">
                        <div className="chart-header">
                            <h3>📈 Tendencia de Incidentes</h3>
                            <span className="chart-subtitle">Evolución mensual</span>
                        </div>
                        <div className="chart-content">
                            {stats.incidents?.monthlyTrend?.length > 0 ? (
                                <div className="trend-chart">
                                    <div className="trend-bars">
                                        {stats.incidents.monthlyTrend.map((item, index) => {
                                            const maxCount = Math.max(...stats.incidents.monthlyTrend.map(t => t.count));
                                            const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                                            
                                            return (
                                                <div key={item.month} className="trend-bar-container">
                                                    <div 
                                                        className="trend-bar"
                                                        style={{ height: `${height}%` }}
                                                    ></div>
                                                    <span className="trend-count">{item.count}</span>
                                                    <span className="trend-month">
                                                        {new Date(item.month + '-01').toLocaleDateString('es-ES', { month: 'short' })}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="no-data">No hay datos de tendencias</div>
                            )}
                        </div>
                    </div>

                    {/* Métricas de Eficiencia */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>⚡ Métricas de Respuesta</h3>
                            <span className="chart-subtitle">Indicadores clave</span>
                        </div>
                        <div className="chart-content">
                            <div className="metrics-grid">
                                <div className="metric-item">
                                    <div className="metric-value">
                                        {stats.incidents?.closed || 0}
                                    </div>
                                    <div className="metric-label">Incidentes Cerrados</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-value">
                                        {stats.units?.available || 0}
                                    </div>
                                    <div className="metric-label">Unidades Disponibles</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-value">
                                        {stats.users?.active || 0}
                                    </div>
                                    <div className="metric-label">Usuarios Activos</div>
                                </div>
                                <div className="metric-item">
                                    <div className="metric-value">
                                        {stats.incidents?.active || 0}
                                    </div>
                                    <div className="metric-label">Incidentes Activos</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="quick-actions">
                    <h3>🚀 Acciones Rápidas</h3>
                    <div className="action-buttons">
                        <button 
                            className="action-btn primary"
                            onClick={() => navigate('/admin/incidents')}
                        >
                            📋 Ver Todos los Incidentes
                        </button>
                        <button 
                            className="action-btn success"
                            onClick={() => navigate('/admin/users')}
                        >
                            👥 Gestionar Usuarios
                        </button>
                        <button 
                            className="action-btn warning"
                            onClick={() => navigate('/admin/resources')}
                        >
                            🛠️ Gestionar Unidades
                        </button>
                        <button 
                            className="action-btn info"
                            onClick={() => navigate('/admin/create-sci')}
                        >
                            🆕 Crear Nuevo SCI
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reports;