import React, { useState, useEffect } from 'react';

const Form213 = ({ fields, onChange, incidentId }) => {
    
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

    // Opciones predefinidas para canales de comunicación
    const communicationChannels = [
        'Radio VHF/UHF',
        'Radio HF',
        'Teléfono Satelital',
        'Teléfono Móvil',
        'Teléfono Fijo',
        'Email',
        'Sistema de Mensajería',
        'Fax',
        'Comunicación Cara a Cara',
        'Sistema de Altavoces',
        'Sirena/Alarma',
        'Señales Manuales',
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
                <h3>📞 Registro de Comunicaciones - SCI-213</h3>
                
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
                <h3>📅 Información de la Comunicación</h3>
                
                <div className="form-group">
                    <label>Fecha y Hora de la Comunicación:</label>
                    <input
                        type="datetime-local"
                        value={fields.record_date || ''}
                        onChange={(e) => handleFieldChange('record_date', e.target.value)}
                        required
                    />
                    <small className="field-note">Fecha y hora exacta en que se realizó la comunicación</small>
                </div>
            </div>

            <div className="form-section">
                <h3>📡 Canal de Comunicación</h3>
                
                <div className="form-group">
                    <label>Canal de Comunicación Utilizado:</label>
                    <select
                        value={fields.communication_channel || ''}
                        onChange={(e) => handleFieldChange('communication_channel', e.target.value)}
                        required
                        className={fields.communication_channel ? 'selected-field' : ''}
                    >
                        <option value="" disabled>Seleccionar canal de comunicación</option>
                        {communicationChannels.map(channel => (
                            <option key={channel} value={channel}>{channel}</option>
                        ))}
                    </select>
                    <small className="field-note">Seleccione el medio utilizado para la comunicación</small>
                </div>
            </div>

            <div className="form-section">
                <h3>👥 Participantes</h3>
                
                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Remitente:</label>
                        <input
                            type="text"
                            value={fields.sender || ''}
                            onChange={(e) => handleFieldChange('sender', e.target.value)}
                            required
                            placeholder="Nombre, cargo y unidad del remitente"
                        />
                        <small className="field-note">Persona o entidad que envía el mensaje</small>
                    </div>
                    
                    <div className="form-group half-width">
                        <label>Destinatario:</label>
                        <input
                            type="text"
                            value={fields.receiver || ''}
                            onChange={(e) => handleFieldChange('receiver', e.target.value)}
                            required
                            placeholder="Nombre, cargo y unidad del destinatario"
                        />
                        <small className="field-note">Persona o entidad que recibe el mensaje</small>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3>💬 Contenido del Mensaje</h3>
                
                <div className="form-group">
                    <label>Mensaje Transmitido:</label>
                    <textarea
                        value={fields.message || ''}
                        onChange={(e) => handleFieldChange('message', e.target.value)}
                        required
                        rows="6"
                        placeholder="Transcriba el mensaje completo y exacto que fue transmitido. Incluya toda la información relevante, instrucciones, reportes, solicitudes, etc..."
                    />
                    <small className="field-note">Transcriba el mensaje de manera completa y precisa</small>
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
                        placeholder="Información complementaria sobre la comunicación: calidad de la señal, dificultades técnicas, confirmación de recepción, acciones derivadas, contexto adicional, etc..."
                    />
                    <small className="field-note">Observaciones relevantes sobre la comunicación</small>
                </div>

                <div className="form-group">
                    <label>Registrado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre de quien registra la comunicación"
                    />
                    <small className="field-note">Persona responsable de documentar esta comunicación</small>
                </div>
            </div>

            {/* Guía de llenado */}
            <div className="form-guide">
                <h4>💡 Guía para el Registro de Comunicaciones (ICS-213)</h4>
                <div className="guide-items">
                    <div className="guide-item">
                        <strong>Mensaje:</strong> Transcriba el contenido exacto del mensaje, incluyendo instrucciones específicas y información crítica.
                    </div>
                    <div className="guide-item">
                        <strong>Participantes:</strong> Identifique claramente remitente y destinatario con nombres, cargos y unidades.
                    </div>
                    <div className="guide-item">
                        <strong>Canal:</strong> Especifique el medio de comunicación utilizado para rastreabilidad.
                    </div>
                    <div className="guide-item">
                        <strong>Hora:</strong> Registre la fecha y hora exactas para mantener una línea de tiempo precisa.
                    </div>
                </div>
            </div>

            {/* Plantilla de formato de mensaje */}
            <div className="message-template">
                <h4>📋 Formato Sugerido para Mensajes</h4>
                <div className="template-examples">
                    <div className="template-example">
                        <h5>🗣️ Mensaje de Reporte</h5>
                        <div className="message-format">
                            <p><strong>De:</strong> [Remitente]</p>
                            <p><strong>Para:</strong> [Destinatario]</p>
                            <p><strong>Mensaje:</strong> "Reportando situación actual en [ubicación]. Condiciones: [descripción]. Recursos necesarios: [lista]. Próximas acciones: [plan]"</p>
                        </div>
                    </div>
                    <div className="template-example">
                        <h5>🔄 Mensaje de Solicitud</h5>
                        <div className="message-format">
                            <p><strong>De:</strong> [Remitente]</p>
                            <p><strong>Para:</strong> [Destinatario]</p>
                            <p><strong>Mensaje:</strong> "Solicito [recurso/acción] para [propósito]. Urgencia: [alta/media/baja]. Tiempo requerido: [fecha/hora]"</p>
                        </div>
                    </div>
                    <div className="template-example">
                        <h5>✅ Mensaje de Confirmación</h5>
                        <div className="message-format">
                            <p><strong>De:</strong> [Remitente]</p>
                            <p><strong>Para:</strong> [Destinatario]</p>
                            <p><strong>Mensaje:</strong> "Confirmo recepción de [instrucción/recurso]. Ejecutaré [acción] para [fecha/hora]. Requiero confirmación"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form213;