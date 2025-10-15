
import React, { useState, useEffect } from 'react';
const Form217 = ({ fields, onChange, incidentId }) => {
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

                // CORREGIDO: Usar el nombre correcto del campo
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
                <h3>📋 Informe de Evaluación - SCI-217</h3>
                
                <div className="form-group">
                    <label>Nombre del Incidente:</label>
                    <input
                        type="text"
                        value={fields.incident_name || ''} // CORREGIDO: mantener incident_name
                        onChange={(e) => handleFieldChange('incident_name', e.target.value)} // CORREGIDO
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
                <h3>📅 Información de la Evaluación</h3>
                
                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Fecha y Hora de la Evaluación:</label>
                        <input
                            type="datetime-local"
                            value={fields.record_date || ''}
                            onChange={(e) => handleFieldChange('record_date', e.target.value)}
                            required
                        />
                        <small className="field-note">Fecha y hora en que se realiza la evaluación</small>
                    </div>
                    
                    <div className="form-group half-width">
                        <label>Evaluador/Inspector:</label>
                        <input
                            type="text"
                            value={fields.evaluator || ''}
                            onChange={(e) => handleFieldChange('evaluator', e.target.value)}
                            required
                            placeholder="Nombre y cargo del evaluador"
                        />
                        <small className="field-note">Persona responsable de la evaluación</small>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>🔍 Observaciones y Hallazgos</h3>
                
                <div className="form-group">
                    <label>Observaciones Detalladas:</label>
                    <textarea
                        value={fields.observations || ''}
                        onChange={(e) => handleFieldChange('observations', e.target.value)}
                        required
                        rows="6"
                        placeholder="Describa detalladamente las observaciones realizadas durante la evaluación, incluyendo hallazgos, condiciones observadas, comportamientos, procedimientos seguidos, etc..."
                    />
                    <small className="field-note">Incluya todos los hallazgos relevantes de la evaluación, tanto positivos como áreas de mejora</small>
                </div>
            </div>

            <div className="form-section">
                <h3>💡 Recomendaciones</h3>
                
                <div className="form-group">
                    <label>Recomendaciones y Acciones Propuestas:</label>
                    <textarea
                        value={fields.recommendations || ''}
                        onChange={(e) => handleFieldChange('recommendations', e.target.value)}
                        required
                        rows="6"
                        placeholder="Liste las recomendaciones específicas, acciones correctivas, mejoras propuestas, cambios en procedimientos, necesidades de capacitación, etc..."
                    />
                    <small className="field-note">Proporcione recomendaciones concretas y acciones específicas para mejorar el desempeño</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📝 Información Adicional</h3>
                
                <div className="form-group">
                    <label>Notas Adicionales:</label>
                    <textarea
                        value={fields.additional_notes || ''}
                        onChange={(e) => handleFieldChange('additional_notes', e.target.value)}
                        rows="4"
                        placeholder="Información complementaria, contexto adicional, limitaciones de la evaluación, aspectos no cubiertos, etc..."
                    />
                    <small className="field-note">Información adicional que considere relevante para la evaluación</small>
                </div>

                <div className="form-group">
                    <label>Preparado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre de quien completa el formulario"
                    />
                    <small className="field-note">Persona que completa el informe de evaluación</small>
                </div>
            </div>

            {/* Guía de llenado */}
            <div className="form-guide">
                <h4>💡 Guía para el Informe de Evaluación (SCI-217)</h4>
                <div className="guide-items">
                    <div className="guide-item">
                        <strong>Observaciones:</strong> Sea específico y objetivo en la descripción de hallazgos. Incluya tanto aspectos positivos como áreas de mejora.
                    </div>
                    <div className="guide-item">
                        <strong>Recomendaciones:</strong> Proponga acciones concretas, realizables y con plazos definidos cuando sea posible.
                    </div>
                    <div className="guide-item">
                        <strong>Evaluador:</strong> Asegúrese de incluir nombre y cargo para identificar claramente al responsable de la evaluación.
                    </div>
                    <div className="guide-item">
                        <strong>Fecha:</strong> Registre la fecha y hora exactas en que se realizó la evaluación.
                    </div>
                </div>
            </div>

            {/* Plantilla de evaluación sugerida */}
            <div className="evaluation-template">
                <h4>📋 Áreas Sugeridas para Evaluación</h4>
                <div className="template-sections">
                    <div className="template-section">
                        <h5>Procedimientos Operativos</h5>
                        <ul>
                            <li>Cumplimiento de protocolos establecidos</li>
                            <li>Eficiencia en la ejecución de tareas</li>
                            <li>Coordinación entre equipos</li>
                        </ul>
                    </div>
                    <div className="template-section">
                        <h5>Recursos y Equipos</h5>
                        <ul>
                            <li>Estado y mantenimiento de equipos</li>
                            <li>Disponibilidad de recursos</li>
                            <li>Uso adecuado de equipos de protección</li>
                        </ul>
                    </div>
                    <div className="template-section">
                        <h5>Comunicaciones</h5>
                        <ul>
                            <li>Claridad en las comunicaciones</li>
                            <li>Uso de terminología estándar</li>
                            <li>Efectividad en la transmisión de información</li>
                        </ul>
                    </div>
                    <div className="template-section">
                        <h5>Seguridad</h5>
                        <ul>
                            <li>Cumplimiento de medidas de seguridad</li>
                            <li>Identificación de riesgos</li>
                            <li>Procedimientos de emergencia</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form217;