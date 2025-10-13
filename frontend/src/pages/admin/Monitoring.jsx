import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './Monitoring.css';

const Monitoring = () => {
    const navigate = useNavigate();
    const [monitoringData, setMonitoringData] = useState({
        systemStatus: 'operativo',
        activeUsers: 0,
        serverLoad: 0,
        memoryUsage: 0,
        databaseConnections: 0,
        lastUpdate: new Date(),
        activeIncidents: [],
        loading: true
    });

    useEffect(() => {
        fetchActiveIncidents();
        const interval = setInterval(() => {
            fetchActiveIncidents();
        }, 10000); // Actualizar cada 10 segundos

        return () => clearInterval(interval);
    }, []);

    const fetchActiveIncidents = async () => {
        try {
            const [incidentsResponse, usersResponse] = await Promise.all([
                fetch('http://localhost:3310/api/incidents', { credentials: 'include' }),
                fetch('http://localhost:3310/api/users', { credentials: 'include' })
            ]);

            const incidentsData = await incidentsResponse.json();
            const usersData = await usersResponse.json();

            if (!incidentsResponse.ok || !usersResponse.ok) {
                throw new Error('Error al cargar datos');
            }

            // Filtrar incidentes activos
            const activeIncidents = (incidentsData.data || []).filter(incident => 
                incident.status === 'activo'
            );

            // Simular métricas del sistema
            const activeUsers = (usersData.data || []).filter(user => 
                user.is_active
            ).length;

            setMonitoringData(prev => ({
                ...prev,
                activeIncidents,
                activeUsers,
                serverLoad: Math.floor(Math.random() * 100),
                memoryUsage: Math.floor(Math.random() * 80) + 20,
                databaseConnections: Math.floor(Math.random() * 20) + 5,
                lastUpdate: new Date(),
                loading: false
            }));

        } catch (error) {
            console.error('Error al cargar datos de monitoreo:', error);
            setMonitoringData(prev => ({ ...prev, loading: false }));
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'alto': return '#e74c3c';
            case 'medio': return '#f39c12';
            case 'bajo': return '#27ae60';
            default: return '#95a5a6';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'alto': return '🔴';
            case 'medio': return '🟡';
            case 'bajo': return '🟢';
            default: return '⚪';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Navbar />
            <div className="monitoring-page">
                <div className="monitoring-header">
                    <h1>📡 Monitoreo del Sistema</h1>
                    <p>Sistema de Comando de Incidentes - Panel de monitoreo en tiempo real</p>
                    <button 
                        className="refresh-btn"
                        onClick={fetchActiveIncidents}
                        disabled={monitoringData.loading}
                    >
                        {monitoringData.loading ? '🔄 Cargando...' : '🔄 Actualizar'}
                    </button>
                </div>

                {/* Métricas del sistema */}
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-icon">🚨</div>
                        <div className="metric-content">
                            <h3>Incidentes Activos</h3>
                            <span className="metric-value">{monitoringData.activeIncidents.length}</span>
                            <p className="metric-description">Requiriendo atención</p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">👥</div>
                        <div className="metric-content">
                            <h3>Usuarios Activos</h3>
                            <span className="metric-value">{monitoringData.activeUsers}</span>
                            <p className="metric-description">En el sistema</p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">⚡</div>
                        <div className="metric-content">
                            <h3>Carga del Servidor</h3>
                            <span className="metric-value">{monitoringData.serverLoad}%</span>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ 
                                        width: `${monitoringData.serverLoad}%`,
                                        background: monitoringData.serverLoad > 80 ? '#e74c3c' : 
                                                   monitoringData.serverLoad > 60 ? '#f39c12' : '#27ae60'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon">💾</div>
                        <div className="metric-content">
                            <h3>Uso de Memoria</h3>
                            <span className="metric-value">{monitoringData.memoryUsage}%</span>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ 
                                        width: `${monitoringData.memoryUsage}%`,
                                        background: monitoringData.memoryUsage > 80 ? '#e74c3c' : 
                                                   monitoringData.memoryUsage > 60 ? '#f39c12' : '#27ae60'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Incidentes Activos */}
                <div className="incidents-section">
                    <h2>🚨 Incidentes Activos</h2>
                    {monitoringData.loading ? (
                        <div className="loading-state">Cargando incidentes...</div>
                    ) : monitoringData.activeIncidents.length === 0 ? (
                        <div className="no-incidents">
                            <div className="no-incidents-icon">✅</div>
                            <h3>No hay incidentes activos</h3>
                            <p>El sistema se encuentra en estado normal</p>
                        </div>
                    ) : (
                        <div className="incidents-grid">
                            {monitoringData.activeIncidents.map(incident => (
                                <div key={incident.id} className="incident-card">
                                    <div className="incident-header">
                                        <div className="incident-severity">
                                            <span 
                                                className="severity-icon"
                                                style={{ color: getSeverityColor(incident.severity_level) }}
                                            >
                                                {getSeverityIcon(incident.severity_level)}
                                            </span>
                                            <span 
                                                className="severity-badge"
                                                style={{ backgroundColor: getSeverityColor(incident.severity_level) }}
                                            >
                                                {incident.severity_level || 'No especificado'}
                                            </span>
                                        </div>
                                        <div className="incident-type">
                                            {incident.incident_type || 'Tipo no especificado'}
                                        </div>
                                    </div>
                                    
                                    <h3 className="incident-name">{incident.incident_name}</h3>
                                    <p className="incident-description">{incident.description}</p>
                                    
                                    <div className="incident-details">
                                        <div className="detail-item">
                                            <strong>📍 Ubicación:</strong>
                                            <span>{incident.location || 'No especificada'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>🕐 Inicio:</strong>
                                            <span>{formatDate(incident.start_date)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <strong>⏱️ Duración estimada:</strong>
                                            <span>{incident.estimated_duration || 'No especificada'}</span>
                                        </div>
                                    </div>

                                    {/* Información del Comandante */}
                                    <div className="commander-section">
                                        <h4>👤 Comandante del Incidente</h4>
                                        {incident.commander_info ? (
                                            <div className="commander-info">
                                                <div className="commander-name">
                                                    <strong>{incident.commander_info.name}</strong>
                                                </div>
                                                <div className="commander-details">
                                                    <span className="commander-role">
                                                        {incident.commander_info.role}
                                                    </span>
                                                    {incident.commander_info.unit && (
                                                        <span className="commander-unit">
                                                            - {incident.commander_info.unit}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="no-commander">
                                                <span className="warning-text">No asignado</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Personal Asignado */}
                                    <div className="assigned-personnel">
                                        <h4>👥 Personal Asignado</h4>
                                        <div className="personnel-grid">
                                            {incident.pio_info && (
                                                <div className="personnel-item">
                                                    <span className="personnel-role">Oficial de Información:</span>
                                                    <span className="personnel-name">{incident.pio_info.name}</span>
                                                </div>
                                            )}
                                            {incident.lio_info && (
                                                <div className="personnel-item">
                                                    <span className="personnel-role">Oficial de Enlaces:</span>
                                                    <span className="personnel-name">{incident.lio_info.name}</span>
                                                </div>
                                            )}
                                            {incident.so_info && (
                                                <div className="personnel-item">
                                                    <span className="personnel-role">Oficial de Seguridad:</span>
                                                    <span className="personnel-name">{incident.so_info.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="incident-footer">
                                        <div className="incident-id">
                                            ID: #{incident.id}
                                        </div>
                                        <div className="incident-updated">
                                            Actualizado: {new Date(incident.updated_at || incident.created_at).toLocaleTimeString('es-ES')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Información del sistema */}
                <div className="system-info">
                    <h2>ℹ️ Información del Sistema</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <strong>Estado del Sistema:</strong>
                            <span className={`status-indicator ${monitoringData.activeIncidents.length > 0 ? 'active' : 'normal'}`}>
                                {monitoringData.activeIncidents.length > 0 ? '🚨 ACTIVO' : '✅ NORMAL'}
                            </span>
                        </div>
                        <div className="info-item">
                            <strong>Versión:</strong> SICI v1.0.0
                        </div>
                        <div className="info-item">
                            <strong>Servidor:</strong> Node.js + Express
                        </div>
                        <div className="info-item">
                            <strong>Base de Datos:</strong> MySQL
                        </div>
                        <div className="info-item">
                            <strong>Última Actualización:</strong> {monitoringData.lastUpdate.toLocaleTimeString('es-ES')}
                        </div>
                        <div className="info-item">
                            <strong>Tiempo Activo:</strong> 15 días 8h 32m
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Monitoring;