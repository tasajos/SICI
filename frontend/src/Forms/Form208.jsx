import React, { useState, useEffect } from 'react';

const Form208 = ({ fields, onChange, incidentId }) => {
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

                // Actualizar campos automáticamente SOLO si están vacíos
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
                <h3>📊 Resumen de la Situación - SCI-208</h3>
                
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
                <h3>📝 Descripción del Incidente</h3>
                
                <div className="form-group">
                    <label>Descripción Detallada del Incidente:</label>
                    <textarea
                        value={fields.incident_description || ''}
                        onChange={(e) => handleFieldChange('incident_description', e.target.value)}
                        required
                        rows="5"
                        placeholder="Describa detalladamente la situación actual del incidente, incluyendo causas, desarrollo y condiciones actuales..."
                    />
                    <small className="field-note">Incluya información sobre el origen, evolución y estado actual del incidente</small>
                </div>
            </div>

            <div className="form-section">
                <h3>🔄 Estado Actual</h3>
                
                <div className="form-group">
                    <label>Situación Actual y Estado:</label>
                    <textarea
                        value={fields.current_status || ''}
                        onChange={(e) => handleFieldChange('current_status', e.target.value)}
                        required
                        rows="4"
                        placeholder="Describa la situación actual, progresos realizados, desafíos encontrados y estado general del incidente..."
                    />
                    <small className="field-note">Estado actual de las operaciones, progresos y principales desafíos</small>
                </div>
            </div>

            <div className="form-section">
                <h3>👥 Recursos Involucrados</h3>
                
                <div className="form-group">
                    <label>Recursos Desplegados y Personal:</label>
                    <textarea
                        value={fields.involved_resources || ''}
                        onChange={(e) => handleFieldChange('involved_resources', e.target.value)}
                        required
                        rows="4"
                        placeholder="Liste todos los recursos humanos y materiales involucrados, incluyendo personal, equipos, vehículos y especialidades..."
                    />
                    <small className="field-note">Incluya cantidad de personal, equipos especializados, vehículos y otros recursos desplegados</small>
                </div>
            </div>

            <div className="form-section">
                <h3>🎯 Progreso de Objetivos</h3>
                
                <div className="form-group">
                    <label>Progreso hacia Objetivos y Metas:</label>
                    <textarea
                        value={fields.objectives_progress || ''}
                        onChange={(e) => handleFieldChange('objectives_progress', e.target.value)}
                        required
                        rows="4"
                        placeholder="Describa el progreso alcanzado en los objetivos del incidente, metas cumplidas y próximos pasos..."
                    />
                    <small className="field-note">Evalúe el progreso en relación con los objetivos establecidos y las metas operacionales</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📋 Información Adicional</h3>
                
                <div className="form-group">
                    <label>Notas Adicionales y Observaciones:</label>
                    <textarea
                        value={fields.additional_notes || ''}
                        onChange={(e) => handleFieldChange('additional_notes', e.target.value)}
                        rows="3"
                        placeholder="Información adicional relevante, observaciones importantes, recomendaciones o aspectos destacables..."
                    />
                    <small className="field-note">Información complementaria que considere relevante para el resumen de situación</small>
                </div>
            </div>

            <div className="form-section">
                <h3>👤 Responsable del Informe</h3>
                
                <div className="form-group">
                    <label>Preparado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre y cargo de quien prepara el resumen"
                    />
                </div>
            </div>

            {/* Guía de llenado */}
            <div className="form-guide">
                <h4>💡 Guía para el Resumen de Situación (SCI-208)</h4>
                <div className="guide-items">
                    <div className="guide-item">
                        <strong>Descripción del Incidente:</strong> Proporcione una visión general completa del incidente.
                    </div>
                    <div className="guide-item">
                        <strong>Estado Actual:</strong> Incluya situación operacional, progresos y desafíos.
                    </div>
                    <div className="guide-item">
                        <strong>Recursos:</strong> Detalle todos los recursos humanos y materiales desplegados.
                    </div>
                    <div className="guide-item">
                        <strong>Progreso:</strong> Evalúe el avance hacia los objetivos establecidos.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form208;