import React, { useState, useEffect } from 'react';

// Componente para el Form 201
const Form201 = ({ fields, onChange, incidentId }) => {
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

                if (incidentData.start_date && !fields.incident_date) {
                    // Convertir datetime a formato compatible con datetime-local
                    const dateTimeLocal = incidentData.start_date.replace(' ', 'T');
                    onChange('incident_date', dateTimeLocal);
                }

                if (incidentData.location && !fields.location) {
                    onChange('location', incidentData.location);
                }

                // Cargar información del comandante desde las asignaciones
                await loadIncidentCommander(incidentId);

                setInitialLoadDone(true);

            } catch (error) {
                console.error('Error al cargar datos del incidente:', error);
            } finally {
                setLoading(false);
            }
        };

        // Función para cargar el comandante del incidente
        const loadIncidentCommander = async (incidentId) => {
            try {
                const assignmentsResponse = await fetch(`http://localhost:3310/api/incidents/${incidentId}/assignments`, {
                    credentials: 'include'
                });

                if (assignmentsResponse.ok) {
                    const assignmentsResult = await assignmentsResponse.json();
                    const assignments = assignmentsResult.data || [];

                    // Buscar el comandante en las asignaciones
                    const commanderAssignment = assignments.find(assignment => 
                        assignment.assignment_type === 'commander'
                    );

                    if (commanderAssignment && !fields.incident_commander) {
                        const commanderName = commanderAssignment.user_full_name || `Usuario ${commanderAssignment.user_id}`;
                        onChange('incident_commander', commanderName);
                    }
                }

                // Fallback: intentar cargar desde la tabla incidents si hay commander_id
                if (incidentData?.commander && !fields.incident_commander) {
                    try {
                        const commanderResponse = await fetch(`http://localhost:3310/api/users/${incidentData.commander}`, {
                            credentials: 'include'
                        });
                        if (commanderResponse.ok) {
                            const commanderResult = await commanderResponse.json();
                            onChange('incident_commander', commanderResult.data.full_name);
                        }
                    } catch (error) {
                        console.error('Error al cargar información del comandante:', error);
                    }
                }

            } catch (error) {
                console.error('Error al cargar asignaciones del incidente:', error);
            }
        };

        loadIncidentData();
    }, [incidentId, onChange, initialLoadDone, fields.incident_name, fields.incident_date, fields.location, fields.incident_commander, incidentData]);

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
                <h3>📋 Resumen de la Situación - SCI-201</h3>
                
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
                <h3>📅 Información del Incidente</h3>
                
                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Fecha y Hora del Incidente:</label>
                        <input
                            type="datetime-local"
                            value={fields.incident_date || ''}
                            onChange={(e) => handleFieldChange('incident_date', e.target.value)}
                            required
                        />
                        <small className="field-note">Fecha y hora en que inició el incidente</small>
                    </div>
                    
                    <div className="form-group half-width">
                        <label>Comandante del Incidente:</label>
                        <input
                            type="text"
                            value={fields.incident_commander || ''}
                            onChange={(e) => handleFieldChange('incident_commander', e.target.value)}
                            required
                            placeholder="Nombre del comandante del incidente"
                            className={fields.incident_commander ? 'auto-filled-field' : ''}
                        />
                        {fields.incident_commander && (
                            <small className="field-note info">Cargado automáticamente desde las asignaciones del SCI</small>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Ubicación del Incidente:</label>
                    <textarea
                        value={fields.location || ''}
                        onChange={(e) => handleFieldChange('location', e.target.value)}
                        required
                        rows="3"
                        placeholder="Describa la ubicación exacta del incidente, incluyendo dirección, coordenadas, puntos de referencia, municipio, departamento..."
                    />
                    <small className="field-note">Proporcione ubicación específica y detalles geográficos</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📝 Descripción del Incidente</h3>
                
                <div className="form-group">
                    <label>Descripción Detallada:</label>
                    <textarea
                        value={fields.incident_description || ''}
                        onChange={(e) => handleFieldChange('incident_description', e.target.value)}
                        required
                        rows="5"
                        placeholder="Describa detalladamente el incidente: tipo de emergencia, causas conocidas, magnitud, áreas afectadas, población impactada, condiciones actuales, evolución..."
                    />
                    <small className="field-note">Proporcione una descripción completa y objetiva de la situación</small>
                </div>
            </div>

            <div className="form-section">
                <h3>🎯 Objetivos del Incidente</h3>
                
                <div className="form-group">
                    <label>Objetivos Operacionales:</label>
                    <textarea
                        value={fields.incident_objectives || ''}
                        onChange={(e) => handleFieldChange('incident_objectives', e.target.value)}
                        required
                        rows="4"
                        placeholder="Establezca los objetivos principales del incidente: proteger vidas, estabilizar la situación, proteger propiedad, proteger ambiente, restaurar servicios..."
                    />
                    <small className="field-note">Defina metas claras y alcanzables para la respuesta</small>
                </div>
            </div>

            <div className="form-section">
                <h3>⚡ Acciones Inmediatas</h3>
                
                <div className="form-group">
                    <label>Acciones Tomadas:</label>
                    <textarea
                        value={fields.actions_taken || ''}
                        onChange={(e) => handleFieldChange('actions_taken', e.target.value)}
                        required
                        rows="4"
                        placeholder="Describa las acciones inmediatas tomadas: evacuaciones, activación de protocolos, movilización de recursos, coordinación con instituciones, medidas de contención..."
                    />
                    <small className="field-note">Liste las acciones realizadas desde el inicio del incidente</small>
                </div>
            </div>

            <div className="form-section">
                <h3>🛠️ Recursos Asignados</h3>
                
                <div className="form-group">
                    <label>Recursos Desplegados:</label>
                    <textarea
                        value={fields.assigned_resources || ''}
                        onChange={(e) => handleFieldChange('assigned_resources', e.target.value)}
                        required
                        rows="4"
                        placeholder="Liste todos los recursos asignados: personal, equipos, vehículos, equipos especializados, instituciones participantes, voluntarios..."
                    />
                    <small className="field-note">Inventario de recursos humanos y materiales desplegados</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📋 Información Adicional</h3>
                
                <div className="form-group">
                    <label>Notas Adicionales:</label>
                    <textarea
                        value={fields.additional_notes || ''}
                        onChange={(e) => handleFieldChange('additional_notes', e.target.value)}
                        rows="3"
                        placeholder="Información complementaria: observaciones relevantes, limitaciones, necesidades específicas, coordinaciones pendientes, pronósticos..."
                    />
                    <small className="field-note">Cualquier información adicional relevante para el resumen</small>
                </div>

                <div className="form-group">
                    <label>Preparado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre y cargo de quien prepara el resumen"
                    />
                    <small className="field-note">Persona responsable de completar el formulario</small>
                </div>
            </div>

            {/* Información de carga automática */}
            <div className="auto-load-info">
                <h4>💡 Información sobre carga automática</h4>
                <p>Los campos marcados con <span className="info-note">azul</span> se han cargado automáticamente desde el SCI.</p>
                <p>Puedes modificar estos campos manualmente si es necesario.</p>
            </div>






            {/* Guía de llenado */}
            <div className="form-guide">
                <h4>💡 Guía para el Resumen de Situación (SCI-201)</h4>
                <div className="guide-items">
                    <div className="guide-item">
                        <strong>Descripción del Incidente:</strong> Sea claro y conciso. Incluya tipo, magnitud y condiciones actuales.
                    </div>
                    <div className="guide-item">
                        <strong>Objetivos:</strong> Establezca metas SMART (Específicas, Medibles, Alcanzables, Relevantes, con Tiempo).
                    </div>
                    <div className="guide-item">
                        <strong>Acciones:</strong> Documente todas las acciones tomadas desde el inicio.
                    </div>
                    <div className="guide-item">
                        <strong>Recursos:</strong> Mantenga un inventario actualizado de recursos desplegados.
                    </div>
                </div>
            </div>

            {/* Plantilla de objetivos SMART */}
            <div className="objectives-template">
                <h4>🎯 Ejemplos de Objetivos SMART</h4>
                <div className="objectives-examples">
                    <div className="objective-example">
                        <h5>🚨 Objetivo de Respuesta Inmediata</h5>
                        <p><strong>Específico:</strong> Evacuar 150 personas de la zona de riesgo</p>
                        <p><strong>Medible:</strong> 100% de personas evacuadas</p>
                        <p><strong>Alcanzable:</strong> Con recursos disponibles</p>
                        <p><strong>Relevante:</strong> Proteger vidas humanas</p>
                        <p><strong>Tiempo:</strong> En las próximas 2 horas</p>
                    </div>
                    <div className="objective-example">
                        <h5>🛡️ Objetivo de Contención</h5>
                        <p><strong>Específico:</strong> Controlar el avance del incendio</p>
                        <p><strong>Medible:</strong> Línea de contención establecida</p>
                        <p><strong>Alcanzable:</strong> Con brigadas y equipos</p>
                        <p><strong>Relevante:</strong> Proteger área residencial</p>
                        <p><strong>Tiempo:</strong> En 4 horas</p>
                    </div>
                    <div className="objective-example">
                        <h5>🏥 Objetivo de Asistencia</h5>
                        <p><strong>Específico:</strong> Brindar atención médica a afectados</p>
                        <p><strong>Medible:</strong> 50 personas atendidas</p>
                        <p><strong>Alcanzable:</strong> Con personal médico disponible</p>
                        <p><strong>Relevante:</strong> Garantizar salud de afectados</p>
                        <p><strong>Tiempo:</strong> Continuo durante la emergencia</p>
                    </div>
                </div>
            </div>

            {/* Tipos comunes de incidentes */}
            <div className="incident-types">
                <h4>🚨 Tipos Comunes de Incidentes</h4>
                <div className="types-grid">
                    <div className="type-category">
                        <h5>🌋 Naturales</h5>
                        <ul>
                            <li>Inundaciones</li>
                            <li>Deslizamientos</li>
                            <li>Sismos</li>
                            <li>Incendios forestales</li>
                            <li>Tormentas severas</li>
                        </ul>
                    </div>
                    <div className="type-category">
                        <h5>🏭 Tecnológicos</h5>
                        <ul>
                            <li>Incendios industriales</li>
                            <li>Fugas químicas</li>
                            <li>Derrames</li>
                            <li>Colapsos estructurales</li>
                            <li>Accidentes de transporte</li>
                        </ul>
                    </div>
                    <div className="type-category">
                        <h5>👥 Sociales</h5>
                        <ul>
                            <li>Emergencias médicas</li>
                            <li>Incidentes de seguridad</li>
                            <li>Eventos masivos</li>
                            <li>Desastres humanitarios</li>
                            <li>Crisis sanitarias</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Form201;