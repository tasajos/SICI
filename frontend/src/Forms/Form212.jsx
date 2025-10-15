import React, { useState, useEffect } from 'react';
const Form212 = ({ fields, onChange, incidentId }) => {
    const [incidentData, setIncidentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Cargar datos del incidente
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

    // Tipos de riesgos predefinidos
    const riskCategories = [
        'Riesgo Eléctrico',
        'Riesgo Químico',
        'Riesgo Biológico',
        'Riesgo de Incendio',
        'Riesgo Estructural',
        'Riesgo Atmosférico',
        'Riesgo de Tráfico',
        'Riesgo de Maquinaria',
        'Riesgo de Altura',
        'Riesgo de Espacios Confinados',
        'Riesgo Ergonómico',
        'Riesgo Psicosocial',
        'Riesgo Ambiental',
        'Otro'
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
                <h3>🛡️ Registro de Seguridad - SCI-212</h3>
                
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
                <h3>📅 Información del Registro</h3>
                
                <div className="form-group">
                    <label>Fecha y Hora del Registro:</label>
                    <input
                        type="datetime-local"
                        value={fields.record_date || ''}
                        onChange={(e) => handleFieldChange('record_date', e.target.value)}
                        required
                    />
                    <small className="field-note">Fecha y hora en que se identifica el riesgo o se emite el mensaje de seguridad</small>
                </div>
            </div>

            <div className="form-section">
                <h3>⚠️ Riesgos Identificados</h3>
                
                <div className="form-group">
                    <label>Categoría de Riesgo:</label>
                    <select
                        value={fields.risk_category || ''}
                        onChange={(e) => handleFieldChange('risk_category', e.target.value)}
                        className={fields.risk_category ? 'selected-field' : ''}
                    >
                        <option value="" disabled>Seleccionar categoría de riesgo</option>
                        {riskCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <small className="field-note">Seleccione la categoría principal del riesgo identificado</small>
                </div>

                <div className="form-group">
                    <label>Riesgos Identificados y Evaluación:</label>
                    <textarea
                        value={fields.identified_risk || ''}
                        onChange={(e) => handleFieldChange('identified_risk', e.target.value)}
                        required
                        rows="5"
                        placeholder="Describa detalladamente los riesgos identificados, ubicación exacta, nivel de peligro, condiciones observadas, factores contribuyentes, evaluación del riesgo (probabilidad/impacto)..."
                    />
                    <small className="field-note">Sea específico en la descripción del riesgo, ubicación y nivel de peligrosidad</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📢 Mensajes de Seguridad</h3>
                
                <div className="form-group">
                    <label>Mensajes y Recomendaciones de Seguridad:</label>
                    <textarea
                        value={fields.safety_messages || ''}
                        onChange={(e) => handleFieldChange('safety_messages', e.target.value)}
                        required
                        rows="5"
                        placeholder="Proporcione mensajes claros de seguridad, medidas preventivas, equipos de protección requeridos, procedimientos seguros, restricciones, zonas de peligro, acciones inmediatas requeridas..."
                    />
                    <small className="field-note">Incluya instrucciones claras y específicas para garantizar la seguridad</small>
                </div>
            </div>

            <div className="form-section">
                <h3>👤 Responsable</h3>
                
                <div className="form-group">
                    <label>Responsable de Seguridad:</label>
                    <input
                        type="text"
                        value={fields.responsible || ''}
                        onChange={(e) => handleFieldChange('responsible', e.target.value)}
                        required
                        placeholder="Nombre y cargo del oficial de seguridad o responsable"
                    />
                    <small className="field-note">Persona responsable de identificar el riesgo y emitir las recomendaciones</small>
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
                        placeholder="Información complementaria: seguimiento requerido, coordinación con otros departamentos, recursos necesarios, limitaciones, observaciones del personal..."
                    />
                    <small className="field-note">Cualquier información adicional relevante para la gestión de seguridad</small>
                </div>

                <div className="form-group">
                    <label>Registrado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre de quien completa el registro"
                    />
                    <small className="field-note">Persona que documenta el registro de seguridad</small>
                </div>
            </div>

            {/* Guía de llenado */}
            <div className="form-guide">
                <h4>💡 Guía para el Registro de Seguridad (SCI-212)</h4>
                <div className="guide-items">
                    <div className="guide-item">
                        <strong>Riesgos Identificados:</strong> Describa específicamente el peligro, ubicación, condiciones y nivel de riesgo.
                    </div>
                    <div className="guide-item">
                        <strong>Mensajes de Seguridad:</strong> Proporcione instrucciones claras, concretas y realizables.
                    </div>
                    <div className="guide-item">
                        <strong>Responsable:</strong> Identifique claramente al oficial de seguridad o persona responsable.
                    </div>
                    <div className="guide-item">
                        <strong>Acciones:</strong> Especifique medidas inmediatas y preventivas requeridas.
                    </div>
                </div>
            </div>

            {/* Ejemplos de riesgos comunes */}
            <div className="safety-examples">
                <h4>⚠️ Ejemplos de Riesgos Comunes</h4>
                <div className="example-grid">
                    <div className="example-card high-risk">
                        <h5>🔴 Riesgo Alto</h5>
                        <ul>
                            <li>Estructuras colapsadas o inestables</li>
                            <li>Fugas de gas o sustancias tóxicas</li>
                            <li>Líneas eléctricas caídas</li>
                            <li>Incendios activos sin control</li>
                            <li>Materiales explosivos</li>
                        </ul>
                    </div>
                    <div className="example-card medium-risk">
                        <h5>🟡 Riesgo Medio</h5>
                        <ul>
                            <li>Superficies resbaladizas</li>
                            <li>Vehículos en movimiento</li>
                            <li>Ruido excesivo</li>
                            <li>Herramientas eléctricas</li>
                            <li>Espacios con poca ventilación</li>
                        </ul>
                    </div>
                    <div className="example-card low-risk">
                        <h5>🟢 Riesgo Bajo</h5>
                        <ul>
                            <li>Iluminación insuficiente</li>
                            <li>Desorden en áreas de trabajo</li>
                            <li>Condiciones climáticas leves</li>
                            <li>Uso prolongado de computadoras</li>
                            <li>Posturas incómodas</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Equipos de protección personal */}
            <div className="ppe-template">
                <h4>🧰 Equipos de Protección Personal Recomendados</h4>
                <div className="ppe-sections">
                    <div className="ppe-section">
                        <h5>👷 Protección Básica</h5>
                        <ul>
                            <li>Casco de seguridad</li>
                            <li>Chaleco reflectante</li>
                            <li>Botas de seguridad</li>
                            <li>Guantes de protección</li>
                            <li>Gafas de seguridad</li>
                        </ul>
                    </div>
                    <div className="ppe-section">
                        <h5>🦺 Protección Específica</h5>
                        <ul>
                            <li>Arnés de seguridad (altura)</li>
                            <li>Protección auditiva</li>
                            <li>Mascarillas/respiradores</li>
                            <li>Trajes de materiales peligrosos</li>
                            <li>Protección térmica</li>
                        </ul>
                    </div>
                    <div className="ppe-section">
                        <h5>🚨 Emergencias</h5>
                        <ul>
                            <li>Kit de primeros auxilios</li>
                            <li>Extintor portátil</li>
                            <li>Radio de comunicación</li>
                            <li>Linterna</li>
                            <li>Silbato de emergencia</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form212;