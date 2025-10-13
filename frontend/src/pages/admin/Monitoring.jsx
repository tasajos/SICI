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
        }, 10000);

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

            const activeIncidents = (incidentsData.data || []).filter(incident => 
                incident.status === 'activo'
            );

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

    const openIncidentDetails = async (incident) => {
        const incidentWindow = window.open('', `incident_${incident.id}`, 
            'width=1400,height=900,scrollbars=yes,resizable=yes');
        
        if (incidentWindow) {
            try {
                // Cargar datos del Form 201 por incident_name
                let form201 = null;
                try {
                    const form201Response = await fetch(`http://localhost:3310/api/forms/form201-by-incident/${encodeURIComponent(incident.incident_name)}`, {
                        credentials: 'include'
                    });
                    if (form201Response.ok) {
                        const form201Data = await form201Response.json();
                        form201 = form201Data.data;
                    }
                } catch (error) {
                    console.log('Form 201 no disponible:', error);
                }

                // Cargar datos del Form 203 por incident_name
                let form203 = null;
                try {
                    const form203Response = await fetch(`http://localhost:3310/api/forms/form203-by-incident/${encodeURIComponent(incident.incident_name)}`, {
                        credentials: 'include'
                    });
                    if (form203Response.ok) {
                        const form203Data = await form203Response.json();
                        form203 = form203Data.data;
                    }
                } catch (error) {
                    console.log('Form 203 no disponible:', error);
                }

                renderIncidentWindow(incidentWindow, incident, form201, form203);
            } catch (error) {
                console.error('Error al cargar formularios:', error);
                // Mostrar ventana sin formularios en caso de error
                renderIncidentWindow(incidentWindow, incident, null, null);
            }
        }
    };

    const renderIncidentWindow = (window, incident, form201, form203) => {
        // Función auxiliar para renderizar tarjeta de personal
        const renderPersonnelCard = (role, personnel) => {
            if (!personnel || !personnel.name) {
                return `
                    <div class="personnel-card">
                        <strong>${role}</strong>
                        <div style="color: #e74c3c;">No asignado</div>
                    </div>
                `;
            }

            return `
                <div class="personnel-card">
                    <strong>${role}</strong>
                    <div>${personnel.name}</div>
                    <div style="color: #666; font-size: 0.9em;">
                        ${personnel.role}${personnel.unit ? ' - ' + personnel.unit : ''}
                    </div>
                </div>
            `;
        };

        // Función auxiliar para obtener clase de severidad
        const getSeverityClass = (severity) => {
            switch(severity?.toLowerCase()) {
                case 'alto': return 'severity-high';
                case 'medio': return 'severity-medium';
                case 'bajo': return 'severity-low';
                default: return '';
            }
        };

        // Función auxiliar para obtener color de estado
        const getStatusColor = (status) => {
            switch(status) {
                case 'activo': return '#e74c3c';
                case 'cerrado': return '#27ae60';
                case 'suspendido': return '#f39c12';
                default: return '#95a5a6';
            }
        };

        // Renderizar tab de resumen
        const renderOverviewTab = (incident) => {
            const severityClass = getSeverityClass(incident.severity_level);
            
            return `
                <div class="section ${severityClass}">
                    <h3>📋 Información General del Incidente</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Tipo:</span>
                            <span class="info-value">${incident.incident_type || 'No especificado'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Severidad:</span>
                            <span class="info-value">${incident.severity_level || 'No especificada'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Ubicación:</span>
                            <span class="info-value">${incident.location || 'No especificada'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Fecha Inicio:</span>
                            <span class="info-value">${formatDate(incident.start_date)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Duración Estimada:</span>
                            <span class="info-value">${incident.estimated_duration || 'No especificada'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Estado:</span>
                            <span class="info-value" style="color: ${getStatusColor(incident.status)}">${incident.status}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>📝 Descripción</h3>
                    <p>${incident.description || 'No hay descripción disponible'}</p>
                </div>

                <div class="section">
                    <h3>👤 Comando del Incidente</h3>
                    <div class="personnel-grid">
                        ${renderPersonnelCard('Comandante', incident.commander_info)}
                        ${renderPersonnelCard('Oficial de Información Pública', incident.pio_info)}
                        ${renderPersonnelCard('Oficial de Enlaces', incident.lio_info)}
                        ${renderPersonnelCard('Oficial de Seguridad', incident.so_info)}
                    </div>
                </div>

                <div class="last-update">
                    Actualizado: ${new Date().toLocaleTimeString('es-ES')}
                </div>
            `;
        };



        // Renderizar tab de Form 201
        const renderForm201Tab = () => {
    if (!form201) {
        return `
            <div class="section form-201-section">
                <h3>📄 Formulario 201 - Resumen de Situación</h3>
                <p class="no-data">No se ha completado el Formulario 201 para este incidente.</p>
            </div>
        `;
    }

    const renderFormField = (label, value) => {
        if (!value) return '';
        return `
            <div class="form-field-card">
                <div class="form-field-label">${label}</div>
                <div class="form-field-value">${value}</div>
            </div>
        `;
    };

    return `
        <div class="section form-201-section">
            <h3>📄 Formulario 201 - Resumen de Situación</h3>
            
            <div class="form-content-grid">
                <!-- Información Básica -->
                <div class="form-section">
                    <h4>📋 Información Básica</h4>
                    <div class="form-fields-grid">
                        ${renderFormField('Comandante del Incidente', form201.incident_commander)}
                        ${renderFormField('Fecha del Incidente', formatDate(form201.incident_date))}
                        ${renderFormField('Ubicación', form201.form_location || form201.incident_location)}
                    </div>
                </div>

                <!-- Descripción y Objetivos -->
                <div class="form-section">
                    <h4>🎯 Descripción y Objetivos</h4>
                    <div class="form-fields-grid">
                        ${renderFormField('Descripción del Incidente', form201.incident_description)}
                        ${renderFormField('Objetivos del Incidente', form201.incident_objectives)}
                    </div>
                </div>

                <!-- Acciones y Recursos -->
                <div class="form-section">
                    <h4>🛠️ Acciones y Recursos</h4>
                    <div class="form-fields-grid">
                        ${renderFormField('Acciones Tomadas', form201.actions_taken)}
                        ${renderFormField('Recursos Asignados', form201.assigned_resources)}
                    </div>
                </div>

                <!-- Información Adicional -->
                <div class="form-section">
                    <h4>📝 Información Adicional</h4>
                    <div class="form-fields-grid">
                        ${renderFormField('Notas Adicionales', form201.additional_notes)}
                        ${renderFormField('ID del Formulario', form201.form201_id)}
                    </div>
                </div>
            </div>

            <div class="last-update">
                Formulario actualizado: ${formatDate(form201.updated_at || form201.created_at)}
            </div>
        </div>
    `;
};

// En el método renderForm203Tab dentro de renderIncidentWindow
const renderForm203Tab = () => {
    if (!form203) {
        return `
            <div class="section form-203-section">
                <h3>🏢 Formulario 203 - Organización del Incidente</h3>
                <p class="no-data">No se ha completado el Formulario 203 para este incidente.</p>
            </div>
        `;
    }

    const renderFormField = (label, value) => {
        if (!value) return '';
        return `
            <div class="info-item">
                <span class="info-label">${label}:</span>
                <span class="info-value">${value}</span>
            </div>
        `;
    };

    const renderOrganizationSection = (sectionTitle, roles) => {
        const rolesHtml = roles.map(role => `
            <div class="organization-card">
                <div class="organization-role">${role.role}</div>
                <div class="organization-details">
                    <div><strong>Nombre:</strong> ${role.name || '<span class="no-data">No asignado</span>'}</div>
                </div>
            </div>
        `).join('');

        return `
            <div>
                <h4>${sectionTitle}</h4>
                <div class="organization-grid">
                    ${rolesHtml}
                </div>
            </div>
        `;
    };

    // Construir las secciones basado en los campos disponibles
    const commandRoles = [];
    if (form203.incident_commander) {
        commandRoles.push({ role: 'Comandante del Incidente', name: form203.incident_commander });
    }
    if (form203.safety_officer) {
        commandRoles.push({ role: 'Oficial de Seguridad', name: form203.safety_officer });
    }
    if (form203.liaison_officer) {
        commandRoles.push({ role: 'Oficial de Enlaces', name: form203.liaison_officer });
    }
    if (form203.public_information_officer) {
        commandRoles.push({ role: 'Oficial de Información Pública', name: form203.public_information_officer });
    }

    const operationsRoles = [];
    if (form203.operations_chief) {
        operationsRoles.push({ role: 'Jefe de Operaciones', name: form203.operations_chief });
    }

    const planningRoles = [];
    if (form203.planning_chief) {
        planningRoles.push({ role: 'Jefe de Planificación', name: form203.planning_chief });
    }

    return `
        <div class="section form-203-section">
            <h3>🏢 Formulario 203 - Organización del Incidente</h3>
            
            <div class="organization-grid">
                ${commandRoles.length > 0 ? renderOrganizationSection('Comando del Incidente', commandRoles) : ''}
                ${operationsRoles.length > 0 ? renderOrganizationSection('Sección de Operaciones', operationsRoles) : ''}
                ${planningRoles.length > 0 ? renderOrganizationSection('Sección de Planificación', planningRoles) : ''}
            </div>

            <div style="margin-top: 20px;">
                <h4>Información Adicional</h4>
                <div class="info-grid">
                    ${renderFormField('Fecha del Incidente', formatDate(form203.incident_date))}
                    ${renderFormField('ID del Formulario', form203.form203_id)}
                </div>
            </div>

            <div class="last-update">
                Formulario actualizado: ${formatDate(form203.updated_at || form203.created_at)}
            </div>
        </div>
    `;
};




        // Renderizar tab de detalles
        const renderDetailsTab = (incident) => {
            return `
                <div class="section">
                    <h3>📊 Información Completa del Incidente</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">ID del Incidente:</span>
                            <span class="info-value">#${incident.id}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Creado por:</span>
                            <span class="info-value">${incident.created_by_username || 'Sistema'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Fecha de Creación:</span>
                            <span class="info-value">${formatDate(incident.created_at)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Última Actualización:</span>
                            <span class="info-value">${formatDate(incident.updated_at || incident.created_at)}</span>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>🛠️ Recursos y Contactos</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Recursos Necesarios:</span>
                            <span class="info-value">${incident.resources_needed || 'No especificados'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Contactos de Emergencia:</span>
                            <span class="info-value">${incident.emergency_contacts || 'No especificados'}</span>
                        </div>
                    </div>
                </div>

                <div class="last-update">
                    Actualizado: ${new Date().toLocaleTimeString('es-ES')}
                </div>
            `;
        };

        const htmlContent = `
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
                        max-width: 1300px; 
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
                    .form-203-section { background: #fff3cd; border-color: #ffc107; }
                    .last-update { color: #888; font-size: 12px; text-align: right; margin-top: 10px; }
                    .severity-high { border-left-color: #e74c3c !important; background: #fdf2f2; }
                    .severity-medium { border-left-color: #f39c12 !important; background: #fef9e7; }
                    .severity-low { border-left-color: #27ae60 !important; background: #f2fdf2; }
                    .tabs { display: flex; margin-bottom: 20px; border-bottom: 2px solid #eee; }
                    .tab { padding: 10px 20px; cursor: pointer; border: none; background: none; font-size: 14px; }
                    .tab.active { border-bottom: 3px solid #3498db; font-weight: bold; color: #3498db; }
                    .no-data { color: #888; font-style: italic; text-align: center; padding: 20px; }
                    .close-btn { background: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; }
                    .refresh-btn { background: #3498db; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 10px; }
                    .organization-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
                    .organization-card { padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #ddd; }
                    .organization-role { font-weight: bold; color: #2c3e50; margin-bottom: 8px; }
                    .organization-details { color: #555; font-size: 0.9em; }
                    .tab-content { display: none; }
                    .tab-content.active { display: block; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 class="incident-title">🚨 ${incident.incident_name}</h1>
                        <div>
                            <button class="close-btn" onclick="window.close()">✖ Cerrar</button>
                        </div>
                    </div>
                    
                    <div class="tabs">
                        <button class="tab active" onclick="showTab('overview')">📋 Resumen</button>
                        <button class="tab" onclick="showTab('form201')">📄 Form 201</button>
                        <button class="tab" onclick="showTab('form203')">🏢 Form 203</button>
                        <button class="tab" onclick="showTab('details')">📊 Detalles</button>
                    </div>
                    
                    <div id="overview" class="tab-content active">
                        ${renderOverviewTab(incident)}
                    </div>
                    
                    <div id="form201" class="tab-content">
                        ${renderForm201Tab()}
                    </div>
                    
                    <div id="form203" class="tab-content">
                        ${renderForm203Tab()}
                    </div>
                    
                    <div id="details" class="tab-content">
                        ${renderDetailsTab(incident)}
                    </div>
                </div>

                <script>
                    function showTab(tabName) {
                        // Ocultar todos los tabs
                        document.querySelectorAll('.tab-content').forEach(tab => {
                            tab.classList.remove('active');
                        });
                        
                        // Mostrar el tab seleccionado
                        document.getElementById(tabName).classList.add('active');
                        
                        // Actualizar tabs activos
                        document.querySelectorAll('.tab').forEach(tab => {
                            tab.classList.remove('active');
                        });
                        event.target.classList.add('active');
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
                </script>
            </body>
            </html>
        `;

        window.document.write(htmlContent);
        window.document.close();
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