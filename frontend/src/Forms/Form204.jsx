import React, { useState, useEffect } from 'react';

const Form204 = ({ fields, onChange, incidentId }) => {
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

    // Opciones predefinidas para divisiones/grupos tácticos
    const divisionGroups = [
        'División A',
        'División B', 
        'División C',
        'División D',
        'Grupo de Búsqueda y Rescate',
        'Grupo Médico',
        'Grupo de Logística',
        'Grupo de Comunicaciones',
        'Grupo de Seguridad',
        'Grupo de Operaciones Especiales',
        'Brigada 1',
        'Brigada 2',
        'Brigada 3',
        'Equipo de Respuesta Inmediata',
        'Unidad de Soporte Técnico',
        'Otro'
    ];

    // Ejemplos de recursos comunes
    const commonResources = [
        'Personal de respuesta',
        'Vehículos de emergencia',
        'Equipos de rescate',
        'Equipos médicos',
        'Comunicaciones',
        'Generadores',
        'Equipos de iluminación',
        'Herramientas especializadas',
        'Unidades de soporte',
        'Equipos de protección'
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
                <h3>🎯 Asignaciones Tácticas - SCI-204</h3>
                
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
                <h3>👥 División o Grupo Táctico</h3>
                
                <div className="form-group">
                    <label>División/Grupo Asignado:</label>
                    <select
                        value={fields.division_group || ''}
                        onChange={(e) => handleFieldChange('division_group', e.target.value)}
                        required
                        className={fields.division_group ? 'selected-field' : ''}
                    >
                        <option value="" disabled>Seleccionar división o grupo</option>
                        {divisionGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                    <small className="field-note">Seleccione la división o grupo táctico para esta asignación</small>
                </div>
            </div>

            <div className="form-section">
                <h3>🛠️ Recursos Asignados</h3>
                
                <div className="form-group">
                    <label>Recursos Asignados a la División/Grupo:</label>
                    <textarea
                        value={fields.assigned_resources || ''}
                        onChange={(e) => handleFieldChange('assigned_resources', e.target.value)}
                        required
                        rows="5"
                        placeholder="Describa detalladamente los recursos asignados: personal, equipos, vehículos, herramientas, equipos especializados, cantidades, características..."
                    />
                    <small className="field-note">Especifique todos los recursos humanos y materiales asignados</small>
                </div>
            </div>

            <div className="form-section">
                <h3>✅ Tareas y Objetivos</h3>
                
                <div className="form-group">
                    <label>Tareas Asignadas:</label>
                    <textarea
                        value={fields.tasks || ''}
                        onChange={(e) => handleFieldChange('tasks', e.target.value)}
                        required
                        rows="6"
                        placeholder="Describa las tareas específicas, objetivos operacionales, responsabilidades, áreas de operación, resultados esperados, plazos..."
                    />
                    <small className="field-note">Defina claramente las tareas, objetivos y responsabilidades</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📋 Instrucciones Especiales</h3>
                
                <div className="form-group">
                    <label>Instrucciones Especiales y Consideraciones:</label>
                    <textarea
                        value={fields.special_instructions || ''}
                        onChange={(e) => handleFieldChange('special_instructions', e.target.value)}
                        rows="4"
                        placeholder="Proporcione instrucciones especiales: procedimientos de seguridad, coordinación con otros grupos, restricciones, comunicaciones, puntos de encuentro, protocolos de emergencia..."
                    />
                    <small className="field-note">Instrucciones adicionales para la ejecución de las tareas</small>
                </div>
            </div>

            <div className="form-section">
                <h3>👤 Información del Responsable</h3>
                
                <div className="form-group">
                    <label>Asignado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre y cargo de quien realiza la asignación"
                    />
                    <small className="field-note">Persona responsable de realizar esta asignación táctica</small>
                </div>
            </div>

            {/* Guía de llenado */}
            <div className="form-guide">
                <h4>💡 Guía para Asignaciones Tácticas (SCI-204)</h4>
                <div className="guide-items">
                    <div className="guide-item">
                        <strong>División/Grupo:</strong> Identifique claramente la unidad táctical responsable.
                    </div>
                    <div className="guide-item">
                        <strong>Recursos:</strong> Especifique cantidades, tipos y características de todos los recursos.
                    </div>
                    <div className="guide-item">
                        <strong>Tareas:</strong> Defina objetivos claros, medibles y con plazos específicos.
                    </div>
                    <div className="guide-item">
                        <strong>Instrucciones:</strong> Incluya procedimientos de seguridad y coordinación.
                    </div>
                </div>
            </div>

            {/* Ejemplos de asignaciones tácticas */}
            <div className="tactical-examples">
                <h4>🎯 Ejemplos de Asignaciones Tácticas</h4>
                <div className="example-grid">
                    <div className="tactical-example">
                        <h5>🚒 Asignación de Combate de Incendios</h5>
                        <p><strong>División:</strong> División A</p>
                        <p><strong>Recursos:</strong> 2 unidades de bomberos, 8 bomberos, equipo de respiración</p>
                        <p><strong>Tareas:</strong> Controlar fuego en sector norte, proteger estructuras adyacentes</p>
                        <p><strong>Instrucciones:</strong> Coordinar con División B, usar puntos de agua designados</p>
                    </div>
                    <div className="tactical-example">
                        <h5>🩺 Asignación de Búsqueda y Rescate</h5>
                        <p><strong>División:</strong> Grupo de Búsqueda y Rescate</p>
                        <p><strong>Recursos:</strong> 6 rescatistas, 2 perros, equipo de búsqueda, unidad médica</p>
                        <p><strong>Tareas:</strong> Buscar sobrevivientes en edificio colapsado, estabilizar víctimas</p>
                        <p><strong>Instrucciones:</strong> Evaluar estabilidad estructural antes del ingreso</p>
                    </div>
                    <div className="tactical-example">
                        <h5>🚧 Asignación de Control de Accesos</h5>
                        <p><strong>División:</strong> Grupo de Seguridad</p>
                        <p><strong>Recursos:</strong> 4 oficiales, vehículo de patrulla, equipo de señalización</p>
                        <p><strong>Tareas:</strong> Controlar acceso a zona de operaciones, desviar tráfico</p>
                        <p><strong>Instrucciones:</strong> Mantener registro de ingresos, coordinar con policía</p>
                    </div>
                </div>
            </div>

            {/* Plantilla de recursos tácticos */}
            <div className="resources-template">
                <h4>🛠️ Recursos Tácticos Comunes</h4>
                <div className="resources-sections">
                    <div className="resource-section">
                        <h5>👥 Recursos Humanos</h5>
                        <ul>
                            <li>Personal de respuesta (bomberos, rescatistas)</li>
                            <li>Personal médico (paramédicos, enfermeros)</li>
                            <li>Especialistas técnicos</li>
                            <li>Personal de apoyo</li>
                            <li>Voluntarios capacitados</li>
                        </ul>
                    </div>
                    <div className="resource-section">
                        <h5>🚗 Equipos Móviles</h5>
                        <ul>
                            <li>Vehículos de emergencia</li>
                            <li>Ambulancias</li>
                            <li>Unidades de comando</li>
                            <li>Vehículos de apoyo</li>
                            <li>Equipos de comunicaciones móviles</li>
                        </ul>
                    </div>
                    <div className="resource-section">
                        <h5>🔧 Equipos Especializados</h5>
                        <ul>
                            <li>Equipos de rescate técnico</li>
                            <li>Equipos médicos avanzados</li>
                            <li>Herramientas de corte y penetración</li>
                            <li>Equipos de detección</li>
                            <li>Sistemas de iluminación</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Form204;