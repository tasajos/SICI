import React, { useState, useEffect } from 'react';
const Form206 = ({ fields, onChange, incidentId }) => {
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

    // Opciones predefinidas para puntos de atención médica
    const medicalAttentionPoints = [
        'Puesto de Primeros Auxilios',
        'Ambulancia en Sitio',
        'Hospital de Campaña',
        'Centro de Salud Local',
        'Hospital Regional',
        'Clínica Móvil',
        'Unidad de Atención Médica Avanzada',
        'Punto de Triage',
        'Área de Estabilización',
        'Hospital Especializado',
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
                <h3>🏥 Plan Médico - SCI-206</h3>
                
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
                <h3>💊 Recursos Médicos Disponibles</h3>
                
                <div className="form-group">
                    <label>Recursos y Equipos Médicos:</label>
                    <textarea
                        value={fields.medical_resources_available || ''}
                        onChange={(e) => handleFieldChange('medical_resources_available', e.target.value)}
                        required
                        rows="5"
                        placeholder="Describa todos los recursos médicos disponibles: equipos, suministros, medicamentos, personal médico, ambulancias, etc. Incluya cantidades y estado..."
                    />
                    <small className="field-note">Liste todo el equipamiento médico, suministros y recursos humanos disponibles</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📍 Puntos de Atención Médica</h3>
                
                <div className="form-group">
                    <label>Punto de Atención Médica Principal:</label>
                    <select
                        value={fields.medical_attention_point || ''}
                        onChange={(e) => handleFieldChange('medical_attention_point', e.target.value)}
                        required
                        className={fields.medical_attention_point ? 'selected-field' : ''}
                    >
                        <option value="" disabled>Seleccionar punto de atención</option>
                        {medicalAttentionPoints.map(point => (
                            <option key={point} value={point}>{point}</option>
                        ))}
                    </select>
                    <small className="field-note">Seleccione el tipo de instalación médica principal</small>
                </div>
</div>
                

            <div className="form-section">
                <h3>🩺 Procedimientos Médicos</h3>
                
                <div className="form-group">
                    <label>Protocolos y Procedimientos Médicos:</label>
                    <textarea
                        value={fields.medical_procedures || ''}
                        onChange={(e) => handleFieldChange('medical_procedures', e.target.value)}
                        required
                        rows="6"
                        placeholder="Describa los protocolos médicos establecidos: triage, primeros auxilios, evacuación médica, tratamiento de emergencias, cadena de custodia médica, etc..."
                    />
                    <small className="field-note">Incluya procedimientos de triage, tratamiento, evacuación y protocolos específicos</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📞 Contactos Médicos</h3>
                
                <div className="form-group">
                    <label>Contactos y Referencias Médicas:</label>
                    <textarea
                        value={fields.medical_contacts || ''}
                        onChange={(e) => handleFieldChange('medical_contacts', e.target.value)}
                        required
                        rows="5"
                        placeholder="Liste todos los contactos médicos relevantes: hospitales, clínicas, especialistas, servicios de ambulancia, centros de toxicología, bancos de sangre, etc. Incluya nombres, teléfonos y especialidades..."
                    />
                    <small className="field-note">Proporcione información de contacto de recursos médicos externos y especialistas</small>
                </div>
            </div>

            <div className="form-section">
                <h3>👤 Información Adicional</h3>
                
                <div className="form-group">
                    <label>Elaborado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre y cargo del responsable del plan médico"
                    />
                    <small className="field-note">Persona responsable de elaborar el plan médico</small>
                </div>
            </div>

            {/* Guía de llenado */}
            <div className="form-guide">
                <h4>💡 Guía para el Plan Médico (ICS-206)</h4>
                <div className="guide-items">
                    <div className="guide-item">
                        <strong>Recursos Médicos:</strong> Incluya inventario completo de equipos, medicamentos y personal médico disponible.
                    </div>
                    <div className="guide-item">
                        <strong>Puntos de Atención:</strong> Especifique ubicaciones, capacidades y equipamiento de cada punto médico.
                    </div>
                    <div className="guide-item">
                        <strong>Procedimientos:</strong> Describa protocolos de triage, tratamiento y evacuación médica.
                    </div>
                    <div className="guide-item">
                        <strong>Contactos:</strong> Mantenga lista actualizada de hospitales, especialistas y servicios de apoyo.
                    </div>
                </div>
            </div>

            {/* Plantilla de recursos médicos */}
            <div className="medical-template">
                <h4>🏨 Recursos Médicos Sugeridos</h4>
                <div className="medical-sections">
                    <div className="medical-section">
                        <h5>🩹 Equipamiento Básico</h5>
                        <ul>
                            <li>Botiquines de primeros auxilios</li>
                            <li>Camillas y equipo de inmovilización</li>
                            <li>Equipo de reanimación (DEA, ambú)</li>
                            <li>Oxígeno y equipo de administración</li>
                            <li>Material de curación y vendajes</li>
                        </ul>
                    </div>
                    <div className="medical-section">
                        <h5>💊 Suministros Médicos</h5>
                        <ul>
                            <li>Analgésicos y antiinflamatorios</li>
                            <li>Antibióticos y antisépticos</li>
                            <li>Soluciones intravenosas</li>
                            <li>Medicamentos de emergencia</li>
                            <li>Material desechable</li>
                        </ul>
                    </div>
                    <div className="medical-section">
                        <h5>👨‍⚕️ Personal Médico</h5>
                        <ul>
                            <li>Médicos y enfermeros</li>
                            <li>Paramédicos y técnicos</li>
                            <li>Especialistas en trauma</li>
                            <li>Personal de triage</li>
                            <li>Conductores de ambulancia</li>
                        </ul>
                    </div>
                    <div className="medical-section">
                        <h5>🚑 Equipo de Transporte</h5>
                        <ul>
                            <li>Ambulancias terrestres</li>
                            <li>Unidades de soporte vital avanzado</li>
                            <li>Vehículos de evacuación</li>
                            <li>Helicóptero médico (si disponible)</li>
                            <li>Equipo de comunicación médica</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Procedimientos médicos estándar */}
            <div className="procedures-template">
                <h4>📋 Procedimientos Médicos Estándar</h4>
                <div className="procedures-list">
                    <div className="procedure-item">
                        <h5>🚨 Triage (Clasificación)</h5>
                        <p><strong>Rojo:</strong> Crítico - atención inmediata</p>
                        <p><strong>Amarillo:</strong> Urgente - atención dentro de 1 hora</p>
                        <p><strong>Verde:</strong> Leve - atención diferida</p>
                        <p><strong>Negro:</strong> Fallecido o sin esperanza</p>
                    </div>
                    <div className="procedure-item">
                        <h5>🆘 Primeros Auxilios</h5>
                        <p>Control de hemorragias</p>
                        <p>Manejo de vía aérea</p>
                        <p>Reanimación cardiopulmonar</p>
                        <p>Inmovilización de fracturas</p>
                    </div>
                    <div className="procedure-item">
                        <h5>🚑 Evacuación Médica</h5>
                        <p>Coordinación con hospitales receptores</p>
                        <p>Documentación del paciente</p>
                        <p>Comunicación durante el traslado</p>
                        <p>Entrega en centro médico</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form206;