import React, { useState, useEffect } from 'react';

const Form207 = ({ fields, onChange, incidentId }) => {
    const [incidentData, setIncidentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Cargar datos del incidente (solo una vez al montar el componente)
    useEffect(() => {
        const loadIncidentData = async () => {
            if (!incidentId || initialLoadDone) return;
            
            try {
                setLoading(true);
                
                const incidentResponse = await fetch(`http://localhost:3310/api/incidents/${incidentId}`, {
                    credentials: 'include'
                });

                if (!incidentResponse.ok) {
                    throw new Error('Error al cargar incidente');
                }

                const incidentResult = await incidentResponse.json();
                const incidentData = incidentResult.data;
                setIncidentData(incidentData);

                if (incidentData.incident_name && !fields.incident_name) {
                    onChange('incident_name', incidentData.incident_name);
                }

                setInitialLoadDone(true);

            } catch (error) {
                console.error('Error al cargar datos del incidente:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIncidentData();
    }, [incidentId, onChange, initialLoadDone, fields.incident_name]);

    const handleFieldChange = (field, value) => {
        onChange(field, value);
    };

    const resourceTypes = [
        'Personal',
        'Vehículos',
        'Equipos Médicos',
        'Equipos de Rescate',
        'Comunicaciones',
        'Logística',
        'Alimentación',
        'Alojamiento',
        'Combustible',
        'Otros'
    ];

    const resourceStatusOptions = [
        { value: 'disponible', label: 'Disponible' },
        { value: 'en_uso', label: 'En Uso' },
        { value: 'mantenimiento', label: 'En Mantenimiento' },
        { value: 'baja', label: 'De Baja' }
    ];

    if (loading) {
        return (
            <div className="form-loading">
                <div className="loading-spinner">🔄</div>
                <p>Cargando datos del incidente...</p>
            </div>
        );
    }

    return (
        <div className="form-fields">
            <div className="form-section">
                <h3>📋 Información Básica del Incidente</h3>
                
                <div className="form-group">
                    <label>Nombre del Incidente:</label>
                    <input
                        type="text"
                        value={fields.incident_name || ''}
                        onChange={(e) => handleFieldChange('incident_name', e.target.value)}
                        required
                        readOnly={!!incidentData?.incident_name}
                        className={incidentData?.incident_name ? 'read-only-field' : ''}
                    />
                    {incidentData?.incident_name && (
                        <small className="field-note">Cargado automáticamente desde el SCI</small>
                    )}
                </div>
            </div>

            <div className="form-section">
                <h3>🛠️ Detalles del Recurso</h3>
                
                <div className="form-group">
                    <label>Tipo de Recurso:</label>
                    <select
                        value={fields.resource_type || ''}
                        onChange={(e) => handleFieldChange('resource_type', e.target.value)}
                        required
                        className={fields.resource_type ? 'selected-field' : ''}
                    >
                        <option value="" disabled>Seleccionar tipo de recurso</option>
                        {resourceTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <small className="field-note">Selecciona el tipo de recurso que estás registrando</small>
                </div>
                
                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            value={fields.quantity || ''}
                            onChange={(e) => handleFieldChange('quantity', e.target.value)}
                            required
                            min="1"
                            placeholder="Ej: 5"
                        />
                    </div>
                    
                    <div className="form-group half-width">
                        <label>Estado del Recurso:</label>
                        <select
                            value={fields.resource_status || ''}
                            onChange={(e) => handleFieldChange('resource_status', e.target.value)}
                            required
                            className={fields.resource_status ? 'selected-field' : ''}
                        >
                            <option value="" disabled>Seleccionar estado</option>
                            {resourceStatusOptions.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="form-group">
                    <label>Asignación/Ubicación:</label>
                    <input
                        type="text"
                        value={fields.assignment || ''}
                        onChange={(e) => handleFieldChange('assignment', e.target.value)}
                        required
                        placeholder="Ej: Base de operaciones, Unidad móvil, Hospital central..."
                    />
                </div>

                <div className="form-group">
                    <label>Especificaciones del Recurso (Opcional):</label>
                    <textarea
                        value={fields.resource_specifications || ''}
                        onChange={(e) => handleFieldChange('resource_specifications', e.target.value)}
                        rows="2"
                        placeholder="Descripción detallada del recurso, modelo, características..."
                    />
                </div>
                
                <div className="form-group">
                    <label>Observaciones (Opcional):</label>
                    <textarea
                        value={fields.observations || ''}
                        onChange={(e) => handleFieldChange('observations', e.target.value)}
                        rows="2"
                        placeholder="Notas adicionales sobre el recurso..."
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>📝 Información Adicional</h3>
                
                <div className="form-group">
                    <label>Registrado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre de quien registra el recurso"
                    />
                </div>
            </div>

            {/* Información de estado */}
            <div className="status-info">
                <h4>💡 Estados de Recursos</h4>
                <div className="status-legends">
                    <div className="status-legend">
                        <span className="status-color disponible"></span>
                        <span className="status-label">Disponible: Recurso listo para uso inmediato</span>
                    </div>
                    <div className="status-legend">
                        <span className="status-color en_uso"></span>
                        <span className="status-label">En Uso: Recurso actualmente asignado</span>
                    </div>
                    <div className="status-legend">
                        <span className="status-color mantenimiento"></span>
                        <span className="status-label">Mantenimiento: Recurso en reparación/revisión</span>
                    </div>
                    <div className="status-legend">
                        <span className="status-color baja"></span>
                        <span className="status-label">De Baja: Recurso no operativo</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form207;