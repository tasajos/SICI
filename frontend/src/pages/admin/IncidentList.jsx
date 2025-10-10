import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './IncidentList.css';

const IncidentList = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

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

    const fetchIncidentDetails = async (incidentId) => {
        try {
            setModalLoading(true);
            const response = await fetch(`http://localhost:3310/api/incidents/${incidentId}`, {
                method: 'GET',
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al cargar detalles del incidente');
            }

            return result.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        } finally {
            setModalLoading(false);
        }
    };

    const handleStatusChange = async (incidentId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3310/api/incidents/${incidentId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al actualizar estado');
            }

            // Actualizar el estado local
            setIncidents(prev => prev.map(incident => 
                incident.id === incidentId 
                    ? { ...incident, status: newStatus }
                    : incident
            ));

            // Si el incidente seleccionado está abierto, actualizarlo también
            if (selectedIncident && selectedIncident.id === incidentId) {
                setSelectedIncident(prev => ({ ...prev, status: newStatus }));
            }

            alert(`Estado actualizado a: ${newStatus}`);
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleViewDetails = async (incidentId) => {
        try {
            const incidentDetails = await fetchIncidentDetails(incidentId);
            setSelectedIncident(incidentDetails);
            setShowModal(true);
        } catch (error) {
            alert(`Error al cargar detalles: ${error.message}`);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedIncident(null);
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

    const formatText = (text) => {
        if (!text || text.trim() === '') return 'No especificado';
        return text;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="incident-list-container">
                    <div className="loading-spinner">Cargando incidentes...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="incident-list-container">
                <div className="il-header">
                    <button className="back-button" onClick={() => navigate('/admin')}>
                        ← Volver al Dashboard
                    </button>
                    <h1>📋 Listado de Comandos de Incidentes</h1>
                    <p>Gestiona y monitorea todos los incidentes activos en el sistema</p>
                </div>

                {/* Barra de herramientas */}
                <div className="il-toolbar">
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
                        <button 
                            className="create-btn"
                            onClick={() => navigate('/admin/create-sci')}
                        >
                            ➕ Nuevo Incidente
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="il-stats">
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
                            <button 
                                className="create-first-btn"
                                onClick={() => navigate('/admin/create-sci')}
                            >
                                Crear Primer Incidente
                            </button>
                        </div>
                    ) : (
                        <table className="incidents-table">
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
                                    <th>Acciones</th>
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
                {incident.commander_display || 'No asignado'}
            </td>
            <td className="location-cell">{incident.location}</td>
            <td>{formatDate(incident.start_date)}</td>
            <td>{getStatusBadge(incident.status)}</td>
            <td>
                <div className="action-buttons-cell">
                    <button 
                        className="btn-view"
                        onClick={() => handleViewDetails(incident.id)}
                        title="Ver detalles completos"
                    >
                        👁️ Ver
                    </button>
                    
                    {/* Selector de estado */}
                    <select
                        value={incident.status}
                        onChange={(e) => handleStatusChange(incident.id, e.target.value)}
                        className="status-select"
                        title="Cambiar estado"
                    >
                        <option value="activo">Activo</option>
                        <option value="suspendido">Suspendido</option>
                        <option value="cerrado">Cerrado</option>
                    </select>
                </div>
            </td>
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
                </div>

                {/* Modal de detalles del incidente */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {modalLoading ? (
                                <div className="modal-loading">Cargando detalles...</div>
                            ) : selectedIncident ? (
                                <>
                                    <div className="modal-header">
                                        <h2>🚨 Detalles del Incidente</h2>
                                        <button className="modal-close" onClick={closeModal}>×</button>
                                    </div>

                                    <div className="modal-body">
                                        {/* Información General */}
                                        <div className="detail-section">
                                            <h3>📋 Información General</h3>
                                            <div className="detail-grid">
                                                <div className="detail-item">
                                                    <label>ID del Incidente:</label>
                                                    <span>#{selectedIncident.id}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Nombre:</label>
                                                    <span className="detail-value-large">{selectedIncident.incident_name}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Tipo:</label>
                                                    <span>{selectedIncident.incident_type}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Severidad:</label>
                                                    <span>{getSeverityBadge(selectedIncident.severity_level)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Estado:</label>
                                                    <span>{getStatusBadge(selectedIncident.status)}</span>
                                                </div>
                                                <div className="detail-item full-width">
                                                    <label>Ubicación:</label>
                                                    <span className="detail-value-large">{selectedIncident.location}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Fecha de Inicio:</label>
                                                    <span>{formatDate(selectedIncident.start_date)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Duración Estimada:</label>
                                                    <span>{formatText(selectedIncident.estimated_duration)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Estructura de Comando */}
                                        <div className="detail-section">
    <h3>👥 Estructura de Comando</h3>
    <div className="command-structure">
        <div className="command-item">
            <div className="command-role">Comandante del Incidente</div>
            <div className="command-name">
                {selectedIncident.commander_info ? (
                    <div className="user-detail-info">
                        <strong>{selectedIncident.commander_info.name}</strong>
                        <span>Rol: {selectedIncident.commander_info.role}</span>
                        <span>Unidad: {selectedIncident.commander_info.unit || 'Sin unidad'}</span>
                    </div>
                ) : (
                    'No asignado'
                )}
            </div>
        </div>
        <div className="command-item">
            <div className="command-role">Oficial de Información Pública</div>
            <div className="command-name">
                {selectedIncident.pio_info ? (
                    <div className="user-detail-info">
                        <strong>{selectedIncident.pio_info.name}</strong>
                        <span>Rol: {selectedIncident.pio_info.role}</span>
                        <span>Unidad: {selectedIncident.pio_info.unit || 'Sin unidad'}</span>
                    </div>
                ) : (
                    'No asignado'
                )}
            </div>
        </div>
        <div className="command-item">
            <div className="command-role">Oficial de Enlaces</div>
            <div className="command-name">
                {selectedIncident.lio_info ? (
                    <div className="user-detail-info">
                        <strong>{selectedIncident.lio_info.name}</strong>
                        <span>Rol: {selectedIncident.lio_info.role}</span>
                        <span>Unidad: {selectedIncident.lio_info.unit || 'Sin unidad'}</span>
                    </div>
                ) : (
                    'No asignado'
                )}
            </div>
        </div>
        <div className="command-item">
            <div className="command-role">Oficial de Seguridad</div>
            <div className="command-name">
                {selectedIncident.so_info ? (
                    <div className="user-detail-info">
                        <strong>{selectedIncident.so_info.name}</strong>
                        <span>Rol: {selectedIncident.so_info.role}</span>
                        <span>Unidad: {selectedIncident.so_info.unit || 'Sin unidad'}</span>
                    </div>
                ) : (
                    'No asignado'
                )}
            </div>
        </div>
    </div>
</div>

                                        {/* Descripción y Recursos */}
                                        <div className="detail-section">
                                            <h3>📝 Descripción del Incidente</h3>
                                            <div className="description-box">
                                                {selectedIncident.description}
                                            </div>
                                        </div>

                                        {selectedIncident.resources_needed && (
                                            <div className="detail-section">
                                                <h3>🛠️ Recursos Necesarios</h3>
                                                <div className="resources-box">
                                                    {selectedIncident.resources_needed}
                                                </div>
                                            </div>
                                        )}

                                        {selectedIncident.emergency_contacts && (
                                            <div className="detail-section">
                                                <h3>📞 Contactos de Emergencia</h3>
                                                <div className="contacts-box">
                                                    {selectedIncident.emergency_contacts}
                                                </div>
                                            </div>
                                        )}

                                        {/* Información del Sistema */}
                                        <div className="detail-section">
                                            <h3>⚙️ Información del Sistema</h3>
                                            <div className="detail-grid">
                                                <div className="detail-item">
                                                    <label>Creado por:</label>
                                                    <span>{selectedIncident.created_by_username || 'Sistema'}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Fecha de creación:</label>
                                                    <span>{formatDate(selectedIncident.created_at)}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <label>Última actualización:</label>
                                                    <span>{formatDate(selectedIncident.updated_at)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button 
                                            className="btn-close-modal"
                                            onClick={closeModal}
                                        >
                                            Cerrar
                                        </button>
                                        <select
                                            value={selectedIncident.status}
                                            onChange={(e) => handleStatusChange(selectedIncident.id, e.target.value)}
                                            className="status-select-modal"
                                        >
                                            <option value="activo">Activo</option>
                                            <option value="suspendido">Suspendido</option>
                                            <option value="cerrado">Cerrado</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <div className="modal-error">Error al cargar los detalles del incidente</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default IncidentList;