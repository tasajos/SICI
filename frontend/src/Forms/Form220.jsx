const Form220 = ({ fields, onChange, incidentId }) => {
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
                <h3>📚 Registro de Lecciones Aprendidas - SCI-220</h3>
                
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
                    <small className="field-note">Fecha en que se documenta la lección aprendida</small>
                </div>
            </div>

            <div className="form-section">
                <h3>🎯 Lección Aprendida</h3>
                
                <div className="form-group">
                    <label>Descripción de la Lección Aprendida:</label>
                    <textarea
                        value={fields.learned_lesson || ''}
                        onChange={(e) => handleFieldChange('learned_lesson', e.target.value)}
                        required
                        rows="5"
                        placeholder="Describa detalladamente la lección aprendida, incluyendo la situación específica, lo que funcionó bien, lo que no funcionó, y el conocimiento adquirido..."
                    />
                    <small className="field-note">Sea específico y descriptivo sobre la experiencia y el aprendizaje obtenido</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📊 Impacto y Consecuencias</h3>
                
                <div className="form-group">
                    <label>Impacto en la Operación:</label>
                    <textarea
                        value={fields.impact || ''}
                        onChange={(e) => handleFieldChange('impact', e.target.value)}
                        required
                        rows="4"
                        placeholder="Describa el impacto que tuvo esta lección en la operación, tanto positivo como negativo, incluyendo efectos en seguridad, eficiencia, costos, tiempos, etc..."
                    />
                    <small className="field-note">Evalúe las consecuencias y efectos de la lección aprendida</small>
                </div>
            </div>

            <div className="form-section">
                <h3>🔄 Implementación y Acciones</h3>
                
                <div className="form-group">
                    <label>Acciones de Implementación:</label>
                    <textarea
                        value={fields.implementation || ''}
                        onChange={(e) => handleFieldChange('implementation', e.target.value)}
                        required
                        rows="4"
                        placeholder="Describa las acciones tomadas o propuestas para implementar esta lección aprendida, incluyendo cambios en procedimientos, capacitación, equipos, etc..."
                    />
                    <small className="field-note">Especifique cómo se implementará o se ha implementado esta lección</small>
                </div>
            </div>

            <div className="form-section">
                <h3>💡 Recomendaciones</h3>
                
                <div className="form-group">
                    <label>Recomendaciones para Futuros Incidentes:</label>
                    <textarea
                        value={fields.recommendations || ''}
                        onChange={(e) => handleFieldChange('recommendations', e.target.value)}
                        required
                        rows="4"
                        placeholder="Proporcione recomendaciones específicas para mejorar procedimientos, capacitación, equipamiento, comunicación, etc., en futuros incidentes..."
                    />
                    <small className="field-note">Recomendaciones concretas y realizables para aplicar en el futuro</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📝 Información Adicional</h3>
                
                <div className="form-group">
                    <label>Notas Adicionales:</label>
                    <textarea
                        value={fields.additional_notes || ''}
                        onChange={(e) => handleFieldChange('additional_notes', e.target.value)}
                        rows="3"
                        placeholder="Información complementaria, contexto adicional, observaciones relevantes, etc..."
                    />
                    <small className="field-note">Cualquier información adicional que considere importante</small>
                </div>

                <div className="form-group">
                    <label>Registrado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre y cargo de quien registra la lección"
                    />
                    <small className="field-note">Persona responsable de documentar la lección aprendida</small>
                </div>
            </div>

            {/* Guía de llenado */}
            <div className="form-guide">
                <h4>💡 Guía para el Registro de Lecciones Aprendidas (ICS-220)</h4>
                <div className="guide-items">
                    <div className="guide-item">
                        <strong>Lección Aprendida:</strong> Describa claramente qué se aprendió, en qué contexto y por qué es importante.
                    </div>
                    <div className="guide-item">
                        <strong>Impacto:</strong> Evalúe cómo esta lección afectó la operación y qué consecuencias tuvo.
                    </div>
                    <div className="guide-item">
                        <strong>Implementación:</strong> Especifique acciones concretas para aplicar el aprendizaje.
                    </div>
                    <div className="guide-item">
                        <strong>Recomendaciones:</strong> Proponga mejoras específicas para incidentes futuros.
                    </div>
                </div>
            </div>

            {/* Ejemplos de lecciones aprendidas */}
            <div className="examples-section">
                <h4>📋 Ejemplos de Lecciones Aprendidas</h4>
                <div className="examples-grid">
                    <div className="example-card">
                        <h5>✅ Ejemplo Positivo</h5>
                        <p><strong>Situación:</strong> Comunicación efectiva durante evacuación</p>
                        <p><strong>Lección:</strong> El uso de radios con canales predefinidos mejoró la coordinación en un 40%</p>
                        <p><strong>Recomendación:</strong> Establecer protocolos de comunicación desde el inicio del incidente</p>
                    </div>
                    <div className="example-card">
                        <h5>❌ Ejemplo de Mejora</h5>
                        <p><strong>Situación:</strong> Falta de equipos de protección específicos</p>
                        <p><strong>Lección:</strong> La ausencia de trajes químicos retrasó la respuesta inicial</p>
                        <p><strong>Recomendación:</strong> Mantener inventario actualizado de equipos especializados</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form220;