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

    const openIncidentDetails = (incident) => {
        // Abrir nueva ventana con los detalles del incidente
        const incidentWindow = window.open('', `incident_${incident.id}`, 
            'width=1200,height=800,scrollbars=yes,resizable=yes');
        
        if (incidentWindow) {
            incidentWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Incidente: ${incident.incident_name}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 0; 
                            padding: 20px; 
                            background-color: #f5f5f5;
                        }
                        .container { 
                            max-width: 1000px; 
                            margin: 0 auto; 
                            background: white; 
                            padding: 20px; 
                            border-radius: 10px; 
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }
                        .header { 
                            display: flex; 
                            justify-content: space-between; 
                            align-items: center; 
                            margin-bottom: 20px; 
                            padding-bottom: 15px; 
                            border-bottom: 2px solid #eee;
                        }
                        .incident-title { 
                            color: #2c3e50; 
                            margin: 0; 
                            font-size: 24px;
                        }
                        .refresh-btn { 
                            background: #3498db; 
                            color: white; 
                            border: none; 
                            padding: 8px 16px; 
                            border-radius: 5px; 
                            cursor: pointer;
                        }
                        .section { 
                            margin-bottom: 25px; 
                            padding: 15px; 
                            border: 1px solid #ddd; 
                            border-radius: 8px;
                        }
                        .section h3 { 
                            color: #2c3e50; 
                            margin-top: 0; 
                            border-bottom: 1px solid #eee; 
                            padding-bottom: 8px;
                        }
                        .info-grid { 
                            display: grid; 
                            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                            gap: 10px; 
                        }
                        .info-item { 
                            display: flex; 
                            justify-content: space-between; 
                            padding: 8px 0; 
                            border-bottom: 1px solid #f0f0f0;
                        }
                        .info-item:last-child { border-bottom: none; }
                        .info-label { font-weight: bold; color: #555; }
                        .info-value { color: #333; }
                        .personnel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
                        .personnel-card { padding: 12px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #3498db; }
                        .form-section { background: #e8f4fd; border-color: #3498db; }
                        .loading { text-align: center; padding: 20px; color: #666; }
                        .last-update { color: #888; font-size: 12px; text-align: right; margin-top: 10px; }
                        .severity-high { border-left-color: #e74c3c !important; background: #fdf2f2; }
                        .severity-medium { border-left-color: #f39c12 !important; background: #fef9e7; }
                        .severity-low { border-left-color: #27ae60 !important; background: #f2fdf2; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 class="incident-title">🚨 ${incident.incident_name}</h1>
                            <button class="refresh-btn" onclick="refreshIncident()">🔄 Actualizar</button>
                        </div>
                        
                        <div id="incident-content">
                            <div class="loading">Cargando información del incidente...</div>
                        </div>
                    </div>

                    <script>
                        let refreshInterval;

                        function refreshIncident() {
                            loadIncidentData();
                        }

                        function loadIncidentData() {
                            fetch('http://localhost:3310/api/incidents/${incident.id}', {
                                credentials: 'include'
                            })
                            .then(response => response.json())
                            .then(incidentData => {
                                const incident = incidentData.data;
                                renderIncidentDetails(incident);
                                loadForm201(incident.id);
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                document.getElementById('incident-content').innerHTML = 
                                    '<div class="error">Error al cargar los datos del incidente</div>';
                            });
                        }

                        function loadForm201(incidentId) {
                            fetch('http://localhost:3310/api/forms/incident/' + incidentId, {
                                credentials: 'include'
                            })
                            .then(response => response.json())
                            .then(formsData => {
                                const form201 = formsData.data.find(form => form.form_type === 'form201');
                                renderForm201(form201);
                            })
                            .catch(error => {
                                console.error('Error al cargar formulario 201:', error);
                                renderForm201(null);
                            });
                        }

                        function renderIncidentDetails(incident) {
                            const severityClass = getSeverityClass(incident.severity_level);
                            
                            document.getElementById('incident-content').innerHTML = \`
                                <div class="section \${severityClass}">
                                    <h3>📋 Información General del Incidente</h3>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <span class="info-label">Tipo:</span>
                                            <span class="info-value">\${incident.incident_type || 'No especificado'}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Severidad:</span>
                                            <span class="info-value">\${incident.severity_level || 'No especificada'}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Ubicación:</span>
                                            <span class="info-value">\${incident.location || 'No especificada'}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Fecha Inicio:</span>
                                            <span class="info-value">\${formatDate(incident.start_date)}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Duración Estimada:</span>
                                            <span class="info-value">\${incident.estimated_duration || 'No especificada'}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Estado:</span>
                                            <span class="info-value" style="color: \${getStatusColor(incident.status)}">\${incident.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="section">
                                    <h3>📝 Descripción</h3>
                                    <p>\${incident.description || 'No hay descripción disponible'}</p>
                                </div>

                                <div class="section">
                                    <h3>👤 Comando del Incidente</h3>
                                    <div class="personnel-grid">
                                        \${renderPersonnelCard('Comandante', incident.commander_info)}
                                        \${renderPersonnelCard('Oficial de Información Pública', incident.pio_info)}
                                        \${renderPersonnelCard('Oficial de Enlaces', incident.lio_info)}
                                        \${renderPersonnelCard('Oficial de Seguridad', incident.so_info)}
                                    </div>
                                </div>

                                <div id="form201-section" class="section form-section">
                                    <h3>📄 Formulario 201 - Resumen de Situación</h3>
                                    <div class="loading">Cargando formulario 201...</div>
                                </div>

                                <div class="section">
                                    <h3>📊 Información Adicional</h3>
                                    <div class="info-grid">
                                        <div class="info-item">
                                            <span class="info-label">Recursos Necesarios:</span>
                                            <span class="info-value">\${incident.resources_needed || 'No especificados'}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Contactos de Emergencia:</span>
                                            <span class="info-value">\${incident.emergency_contacts || 'No especificados'}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Creado por:</span>
                                            <span class="info-value">\${incident.created_by_username || 'Sistema'}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="info-label">Última Actualización:</span>
                                            <span class="info-value">\${formatDate(incident.updated_at || incident.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="last-update">
                                    Actualizado: \${new Date().toLocaleTimeString('es-ES')}
                                </div>
                            \`;
                        }

                        function renderForm201(form201) {
                            const formSection = document.getElementById('form201-section');
                            
                            if (!form201) {
                                formSection.innerHTML = \`
                                    <h3>📄 Formulario 201 - Resumen de Situación</h3>
                                    <p>No se ha completado el Formulario 201 para este incidente.</p>
                                \`;
                                return;
                            }

                            formSection.innerHTML = \`
                                <h3>📄 Formulario 201 - Resumen de Situación</h3>
                                <div class="info-grid">
                                    \${renderFormField('Situación Actual', form201.situacion_actual)}
                                    \${renderFormField('Objetivos del Incidente', form201.objetivos_incidente)}
                                    \${renderFormField('Recursos Desplegados', form201.recursos_desplegados)}
                                    \${renderFormField('Lesiones/Bajas', form201.lesiones_bajas)}
                                    \${renderFormField('Daños a Propiedad', form201.danos_propiedad)}
                                    \${renderFormField('Acciones Inmediatas', form201.acciones_inmediatas)}
                                    \${renderFormField('Pronóstico del Tiempo', form201.pronostico_tiempo)}
                                    \${renderFormField('Comentarios Adicionales', form201.comentarios_adicionales)}
                                </div>
                                <div class="last-update">
                                    Formulario actualizado: \${formatDate(form201.updated_at || form201.created_at)}
                                </div>
                            \`;
                        }

                        function renderFormField(label, value) {
                            if (!value) return '';
                            return \`
                                <div class="info-item">
                                    <span class="info-label">\${label}:</span>
                                    <span class="info-value">\${value}</span>
                                </div>
                            \`;
                        }

                        function renderPersonnelCard(role, personnel) {
                            if (!personnel || !personnel.name) {
                                return \`
                                    <div class="personnel-card">
                                        <strong>\${role}</strong>
                                        <div style="color: #e74c3c;">No asignado</div>
                                    </div>
                                \`;
                            }

                            return \`
                                <div class="personnel-card">
                                    <strong>\${role}</strong>
                                    <div>\${personnel.name}</div>
                                    <div style="color: #666; font-size: 0.9em;">
                                        \${personnel.role}\${personnel.unit ? ' - ' + personnel.unit : ''}
                                    </div>
                                </div>
                            \`;
                        }

                        function getSeverityClass(severity) {
                            switch(severity?.toLowerCase()) {
                                case 'alto': return 'severity-high';
                                case 'medio': return 'severity-medium';
                                case 'bajo': return 'severity-low';
                                default: return '';
                            }
                        }

                        function getStatusColor(status) {
                            switch(status) {
                                case 'activo': return '#e74c3c';
                                case 'cerrado': return '#27ae60';
                                case 'suspendido': return '#f39c12';
                                default: return '#95a5a6';
                            }
                        }

                        function formatDate(dateString) {
                            if (!dateString) return 'No especificada';
                            const date = new Date(dateString);
                            return date.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                        }

                        // Cargar datos iniciales
                        loadIncidentData();

                        // Configurar actualización automática cada 30 segundos
                        refreshInterval = setInterval(loadIncidentData, 30000);

                        // Limpiar intervalo cuando se cierre la ventana
                        window.addEventListener('beforeunload', () => {
                            if (refreshInterval) {
                                clearInterval(refreshInterval);
                            }
                        });
                    </script>
                </body>
                </html>
            `);
            incidentWindow.document.close();
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
                                <div 
                                    key={incident.id} 
                                    className="incident-card clickable-incident"
                                    onClick={() => openIncidentDetails(incident)}
                                >
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

                                    <div className="incident-footer">
                                        <div className="incident-id">
                                            ID: #{incident.id}
                                        </div>
                                        <div className="click-hint">
                                            👆 Haz clic para ver detalles completos
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