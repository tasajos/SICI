import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { VOLUNTEER_NAV } from '../../config/nav';
import './VolunteerIncidentList.css';

const VolunteerIncidentList = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');

    // Cargar incidentes al montar el componente
    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3310/api/incidents', {
                method: 'GET',
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al cargar incidentes');
            }

            setIncidents(result.data || []);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar incidentes
    const filteredIncidents = incidents.filter(incident => {
        const matchesSearch = 
            incident.incident_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.incident_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (incident.commander_display && incident.commander_display.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'todos' || incident.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            activo: { label: 'Activo', color: '#27ae60', bgColor: '#d5f4e6' },
            cerrado: { label: 'Cerrado', color: '#e74c3c', bgColor: '#fadbd8' },
            suspendido: { label: 'Suspendido', color: '#f39c12', bgColor: '#fdebd0' }
        };

        const config = statusConfig[status] || statusConfig.activo;

        return (
            <span 
                className="status-badge"
                style={{ 
                    backgroundColor: config.bgColor,
                    color: config.color,
                    border: `1px solid ${config.color}`
                }}
            >
                {config.label}
            </span>
        );
    };

    const getSeverityBadge = (severity) => {
        const severityConfig = {
            bajo: { label: 'Bajo', color: '#27ae60' },
            medio: { label: 'Medio', color: '#f39c12' },
            alto: { label: 'Alto', color: '#e67e22' },
            critico: { label: 'Crítico', color: '#e74c3c' }
        };

        const config = severityConfig[severity] || severityConfig.bajo;

        return (
            <span 
                className="severity-badge"
                style={{ backgroundColor: config.color }}
            >
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES');
    };

    // Función para formatear la información del comandante
    const formatCommanderDisplay = (incident) => {
        if (incident.commander_display) {
            return incident.commander_display;
        }
        
        if (incident.commander_info) {
            return `${incident.commander_info.name} - ${incident.commander_info.role}${incident.commander_info.unit ? ` - ${incident.commander_info.unit}` : ''}`;
        }
        
        return incident.commander ? `Usuario #${incident.commander}` : 'No asignado';
    };

    if (loading) {
        return (
            <AppLayout navItems={VOLUNTEER_NAV} subtitle="Panel de Voluntario" title="Incidentes Activos">
                <div className="volunteer-incident-list-container">
                    <div className="loading-spinner">Cargando incidentes...</div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout navItems={VOLUNTEER_NAV} subtitle="Panel de Voluntario" title="Incidentes Activos">
            <div className="volunteer-incident-list-container">
                <div className="vil-header">
                    <button className="back-button" onClick={() => navigate('/volunteer')}>
                        ← Volver al Dashboard
                    </button>
                    <h1>📋 Listado de Comandos de Incidentes</h1>
                    <p>Vista de solo lectura - Monitorea todos los incidentes activos en el sistema</p>
                    <div className="volunteer-notice">
                        <strong>🔒 Modo Voluntario:</strong> Vista de solo lectura. Para realizar cambios contacta a un administrador.
                    </div>
                </div>

                {/* Barra de herramientas */}
                <div className="vil-toolbar">
                    <div className="search-filter-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Buscar incidentes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon">🔍</span>
                        </div>

                        <div className="filter-group">
                            <label>Filtrar por estado:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="activo">Activos</option>
                                <option value="cerrado">Cerrados</option>
                                <option value="suspendido">Suspendidos</option>
                            </select>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            className="refresh-btn"
                            onClick={fetchIncidents}
                        >
                            🔄 Actualizar
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="vil-stats">
                    <div className="stat-card">
                        <span className="stat-number">{incidents.length}</span>
                        <span className="stat-label">Total Incidentes</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{incidents.filter(i => i.status === 'activo').length}</span>
                        <span className="stat-label">Activos</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{incidents.filter(i => i.status === 'cerrado').length}</span>
                        <span className="stat-label">Cerrados</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{incidents.filter(i => i.status === 'suspendido').length}</span>
                        <span className="stat-label">Suspendidos</span>
                    </div>
                </div>

                {/* Tabla de incidentes */}
                <div className="incidents-table-container">
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    {filteredIncidents.length === 0 ? (
                        <div className="no-incidents">
                            <p>No se encontraron incidentes que coincidan con los filtros.</p>
                        </div>
                    ) : (
                        <table className="incidents-table volunteer-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre del Incidente</th>
                                    <th>Tipo</th>
                                    <th>Severidad</th>
                                    <th>Comandante</th>
                                    <th>Ubicación</th>
                                    <th>Fecha Inicio</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIncidents.map(incident => (
                                    <tr key={incident.id} className="incident-row">
                                        <td className="incident-id">#{incident.id}</td>
                                        <td className="incident-name">
                                            <strong>{incident.incident_name}</strong>
                                            <div className="incident-meta">
                                                Creado por: {incident.created_by_username || 'Sistema'}
                                            </div>
                                        </td>
                                        <td>{incident.incident_type}</td>
                                        <td>{getSeverityBadge(incident.severity_level)}</td>
                                        <td className="commander-cell">
                                            {formatCommanderDisplay(incident)}
                                        </td>
                                        <td className="location-cell">{incident.location}</td>
                                        <td>{formatDate(incident.start_date)}</td>
                                        <td>{getStatusBadge(incident.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Información de resumen */}
                <div className="summary-info">
                    <p>
                        Mostrando <strong>{filteredIncidents.length}</strong> de <strong>{incidents.length}</strong> incidentes
                    </p>
                    <div className="read-only-notice">
                        <span>👁️ Vista de solo lectura</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default VolunteerIncidentList;