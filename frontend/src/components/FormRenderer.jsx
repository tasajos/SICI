import React, { useState, useEffect } from 'react';
import './FormRenderer.css';

const FormRenderer = ({ form, incidentId, onClose, onSave }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Cargar datos existentes si es una edición
    useEffect(() => {
        const loadFormData = async () => {
            if (form.existingData) {
                setFormData(form.existingData);
            }
        };
        loadFormData();
    }, [form]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            await onSave(form, formData, incidentId);
            onClose();
        } catch (error) {
            console.error('Error al guardar formulario:', error);
            alert('Error al guardar el formulario');
        } finally {
            setSaving(false);
        }
    };

    const renderFormFields = () => {
       switch (form.id) {
        case 'form201':
            return <Form201 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
        case 'form202':
            return <Form202 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
        case 'form203':
            return <Form203 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
            case 'form204':
                return <Form204 fields={formData} onChange={handleInputChange} />;
            case 'form205':
                return <Form205 fields={formData} onChange={handleInputChange} />;
            case 'form206':
                return <Form206 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
             case 'form207':
            return <Form207 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
            case 'form208':
                return <Form208 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
            case 'form209':
                return <Form209 fields={formData} onChange={handleInputChange} />;
            case 'form211':
                return <Form211 fields={formData} onChange={handleInputChange} />;
            case 'form212':
                return <Form212 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
            case 'form213':
                return <Form213 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
            case 'form214':
                return <Form214 fields={formData} onChange={handleInputChange} />;
            case 'form215':
                return <Form215 fields={formData} onChange={handleInputChange} />;
            case 'form216':
                return <Form216 fields={formData} onChange={handleInputChange} />;
            case 'form217':
                return <Form217 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
            case 'form218':
                return <Form218 fields={formData} onChange={handleInputChange} />;
            case 'form219':
                return <Form219 fields={formData} onChange={handleInputChange} />;
            case 'form220':
                return <Form220 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
            case 'form221':
                return <Form221 fields={formData} onChange={handleInputChange} />;
            default:
                return <div>Formulario no disponible</div>;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="ics-form">
            {renderFormFields()}
            
            <div className="form-actions">
                <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={onClose}
                    disabled={saving}
                >
                    Cancelar
                </button>
                <button 
                    type="submit" 
                    className="btn-save"
                    disabled={saving}
                >
                    {saving ? '💾 Guardando...' : '💾 Guardar Formulario'}
                </button>
            </div>
        </form>
    );
};

// Componente para el Form 201
const Form201 = ({ fields, onChange }) => {
    return (
        <div className="form-fields">
            <div className="form-group">
                <label>Nombre del Incidente:</label>
                <input
                    type="text"
                    value={fields.incident_name || ''}
                    onChange={(e) => onChange('incident_name', e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Fecha y Hora:</label>
                <input
                    type="datetime-local"
                    value={fields.incident_date || ''}
                    onChange={(e) => onChange('incident_date', e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Ubicación:</label>
                <textarea
                    value={fields.location || ''}
                    onChange={(e) => onChange('location', e.target.value)}
                    required
                    rows="3"
                />
            </div>
            
            <div className="form-group">
                <label>Mando del Incidente:</label>
                <input
                    type="text"
                    value={fields.incident_commander || ''}
                    onChange={(e) => onChange('incident_commander', e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Descripción del Incidente:</label>
                <textarea
                    value={fields.incident_description || ''}
                    onChange={(e) => onChange('incident_description', e.target.value)}
                    required
                    rows="4"
                />
            </div>
            
            <div className="form-group">
                <label>Acciones Tomadas:</label>
                <textarea
                    value={fields.actions_taken || ''}
                    onChange={(e) => onChange('actions_taken', e.target.value)}
                    required
                    rows="4"
                />
            </div>
            
            <div className="form-group">
                <label>Objetivos del Incidente:</label>
                <textarea
                    value={fields.incident_objectives || ''}
                    onChange={(e) => onChange('incident_objectives', e.target.value)}
                    required
                    rows="4"
                />
            </div>
            
            <div className="form-group">
                <label>Recursos Asignados:</label>
                <textarea
                    value={fields.assigned_resources || ''}
                    onChange={(e) => onChange('assigned_resources', e.target.value)}
                    required
                    rows="4"
                />
            </div>
            
            <div className="form-group">
                <label>Notas Adicionales:</label>
                <textarea
                    value={fields.additional_notes || ''}
                    onChange={(e) => onChange('additional_notes', e.target.value)}
                    rows="3"
                />
            </div>
        </div>
    );
};

// Componente para el Form 202
const Form202 = ({ fields, onChange }) => {
    return (
        <div className="form-fields">
            <div className="form-group">
                <label>Nombre del Incidente:</label>
                <input
                    type="text"
                    value={fields.incident_name || ''}
                    onChange={(e) => onChange('incident_name', e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Fecha y Hora:</label>
                <input
                    type="datetime-local"
                    value={fields.incident_date || ''}
                    onChange={(e) => onChange('incident_date', e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <label>Objetivos del Incidente:</label>
                <textarea
                    value={fields.incident_objectives || ''}
                    onChange={(e) => onChange('incident_objectives', e.target.value)}
                    required
                    rows="4"
                />
            </div>
            
            <div className="form-group">
                <label>Prioridades:</label>
                <textarea
                    value={fields.priorities || ''}
                    onChange={(e) => onChange('priorities', e.target.value)}
                    required
                    rows="4"
                />
            </div>
            
            <div className="form-group">
                <label>Directrices:</label>
                <textarea
                    value={fields.guidelines || ''}
                    onChange={(e) => onChange('guidelines', e.target.value)}
                    required
                    rows="4"
                />
            </div>
        </div>
    );
};

// Componente para el Form 203 - Organización del Incidente
const Form203 = ({ fields, onChange, incidentId }) => {
    const [incidentData, setIncidentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [officers, setOfficers] = useState({
        incident_commander: '',
        safety_officer: '',
        liaison_officer: '',
        public_information_officer: '',
        operations_chief: '',
        planning_chief: '',
        logistics_chief: '',
        finance_chief: ''
    });
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Cargar datos del incidente y nombres de oficiales (solo una vez al montar el componente)
    useEffect(() => {
        const loadIncidentData = async () => {
            if (!incidentId || initialLoadDone) return;
            
            try {
                setLoading(true);
                
                // 1. Cargar información básica del incidente
                const incidentResponse = await fetch(`http://localhost:3310/api/incidents/${incidentId}`, {
                    credentials: 'include'
                });

                if (!incidentResponse.ok) {
                    throw new Error('Error al cargar incidente');
                }

                const incidentResult = await incidentResponse.json();
                const incidentData = incidentResult.data;
                setIncidentData(incidentData);

                // Actualizar el campo incident_name automáticamente SOLO si está vacío
                if (incidentData.incident_name) {
                    onChange('incident_name', incidentData.incident_name);
                }
                
                if (incidentData.start_date) {
                    // Convertir datetime a date
                    const dateOnly = incidentData.start_date.split('T')[0];
                    onChange('incident_date', dateOnly);
                }

                // 2. Cargar asignaciones del incidente para obtener nombres
                const assignmentsResponse = await fetch(`http://localhost:3310/api/incidents/${incidentId}/assignments`, {
                    credentials: 'include'
                });

                let officerData = {
                    incident_commander: '',
                    safety_officer: '',
                    liaison_officer: '',
                    public_information_officer: '',
                    operations_chief: '',
                    planning_chief: '',
                    logistics_chief: '',
                    finance_chief: ''
                };

                if (assignmentsResponse.ok) {
                    const assignmentsResult = await assignmentsResponse.json();
                    const assignments = assignmentsResult.data || [];

                    // Procesar asignaciones para obtener nombres
                    for (const assignment of assignments) {
                        const userName = assignment.user_full_name || `Usuario ${assignment.user_id}`;
                        
                        switch (assignment.assignment_type) {
                            case 'commander':
                                officerData.incident_commander = userName;
                                break;
                            case 'safety_officer':
                                officerData.safety_officer = userName;
                                break;
                            case 'liaison_officer':
                                officerData.liaison_officer = userName;
                                break;
                            case 'public_information_officer':
                                officerData.public_information_officer = userName;
                                break;
                            case 'operations_chief':
                                officerData.operations_chief = userName;
                                break;
                            case 'planning_chief':
                                officerData.planning_chief = userName;
                                break;
                            case 'logistics_chief':
                                officerData.logistics_chief = userName;
                                break;
                            case 'finance_chief':
                                officerData.finance_chief = userName;
                                break;
                        }
                    }
                } else {
                    // Fallback: intentar cargar usuarios individualmente desde la tabla incidents
                    officerData = await loadOfficersFromIncidentTable(incidentData);
                }

                setOfficers(officerData);

                // Actualizar automáticamente los campos SOLO si están vacíos
                Object.keys(officerData).forEach(field => {
                    if (officerData[field]) {
                        onChange(field, officerData[field]);
                    }
                });

                setInitialLoadDone(true);

            } catch (error) {
                console.error('Error al cargar datos del incidente:', error);
            } finally {
                setLoading(false);
            }
        };

        // Función para cargar oficiales desde la tabla incidents (usando IDs)
        const loadOfficersFromIncidentTable = async (incidentData) => {
            const officerData = {
                incident_commander: '',
                safety_officer: '',
                liaison_officer: '',
                public_information_officer: '',
                operations_chief: '',
                planning_chief: '',
                logistics_chief: '',
                finance_chief: ''
            };

            try {
                // Cargar nombres para cada ID de oficial
                const loadUser = async (userId) => {
                    if (!userId) return '';
                    try {
                        const userResponse = await fetch(`http://localhost:3310/api/users/${userId}`, {
                            credentials: 'include'
                        });
                        if (userResponse.ok) {
                            const userResult = await userResponse.json();
                            return userResult.data.full_name || `Usuario ${userId}`;
                        }
                    } catch (error) {
                        console.error(`Error al cargar usuario ${userId}:`, error);
                    }
                    return `Usuario ${userId}`;
                };

                // Cargar nombres para cada oficial
                officerData.incident_commander = await loadUser(incidentData.commander);
                officerData.safety_officer = await loadUser(incidentData.safety_officer);
                officerData.liaison_officer = await loadUser(incidentData.liaison_officer);
                officerData.public_information_officer = await loadUser(incidentData.public_information_officer);

            } catch (error) {
                console.error('Error al cargar oficiales desde tabla incidents:', error);
            }

            return officerData;
        };

        loadIncidentData();
    }, [incidentId, onChange]); // Removido 'fields' de las dependencias

    // Función para manejar cambios manuales
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
                <h3>Información Básica del Incidente</h3>
                
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
                
                <div className="form-group">
                    <label>Fecha del Incidente:</label>
                    <input
                        type="date"
                        value={fields.incident_date || ''}
                        onChange={(e) => handleFieldChange('incident_date', e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Personal de Mando</h3>
                
                <div className="form-group">
                    <label>Comandante del Incidente:</label>
                    <input
                        type="text"
                        value={fields.incident_commander || ''}
                        onChange={(e) => handleFieldChange('incident_commander', e.target.value)}
                        required
                        placeholder={officers.incident_commander || "Nombre del comandante"}
                        className={officers.incident_commander && !fields.incident_commander ? 'auto-filled-field' : ''}
                    />
                    {officers.incident_commander && !fields.incident_commander && (
                        <small className="field-note info">Cargado automáticamente desde las asignaciones</small>
                    )}
                </div>
                
                <div className="form-group">
                    <label>Oficial de Seguridad:</label>
                    <input
                        type="text"
                        value={fields.safety_officer || ''}
                        onChange={(e) => handleFieldChange('safety_officer', e.target.value)}
                        placeholder={officers.safety_officer || "Nombre del oficial de seguridad"}
                        className={officers.safety_officer && !fields.safety_officer ? 'auto-filled-field' : ''}
                    />
                    {officers.safety_officer && !fields.safety_officer && (
                        <small className="field-note info">Cargado automáticamente desde las asignaciones</small>
                    )}
                </div>
                
                <div className="form-group">
                    <label>Oficial de Enlace:</label>
                    <input
                        type="text"
                        value={fields.liaison_officer || ''}
                        onChange={(e) => handleFieldChange('liaison_officer', e.target.value)}
                        placeholder={officers.liaison_officer || "Nombre del oficial de enlace"}
                        className={officers.liaison_officer && !fields.liaison_officer ? 'auto-filled-field' : ''}
                    />
                    {officers.liaison_officer && !fields.liaison_officer && (
                        <small className="field-note info">Cargado automáticamente desde las asignaciones</small>
                    )}
                </div>
                
                <div className="form-group">
                    <label>Oficial de Información Pública:</label>
                    <input
                        type="text"
                        value={fields.public_information_officer || ''}
                        onChange={(e) => handleFieldChange('public_information_officer', e.target.value)}
                        placeholder={officers.public_information_officer || "Nombre del oficial de información pública"}
                        className={officers.public_information_officer && !fields.public_information_officer ? 'auto-filled-field' : ''}
                    />
                    {officers.public_information_officer && !fields.public_information_officer && (
                        <small className="field-note info">Cargado automáticamente desde las asignaciones</small>
                    )}
                </div>
            </div>

            <div className="form-section">
                <h3>Jefes de Sección</h3>
                
                <div className="form-group">
                    <label>Jefe de Operaciones:</label>
                    <input
                        type="text"
                        value={fields.operations_chief || ''}
                        onChange={(e) => handleFieldChange('operations_chief', e.target.value)}
                        placeholder={officers.operations_chief || "Nombre del jefe de operaciones"}
                        className={officers.operations_chief && !fields.operations_chief ? 'auto-filled-field' : ''}
                    />
                </div>
                
                <div className="form-group">
                    <label>Jefe de Planificación:</label>
                    <input
                        type="text"
                        value={fields.planning_chief || ''}
                        onChange={(e) => handleFieldChange('planning_chief', e.target.value)}
                        placeholder={officers.planning_chief || "Nombre del jefe de planificación"}
                        className={officers.planning_chief && !fields.planning_chief ? 'auto-filled-field' : ''}
                    />
                </div>
                
                <div className="form-group">
                    <label>Jefe de Logística:</label>
                    <input
                        type="text"
                        value={fields.logistics_chief || ''}
                        onChange={(e) => handleFieldChange('logistics_chief', e.target.value)}
                        placeholder={officers.logistics_chief || "Nombre del jefe de logística"}
                        className={officers.logistics_chief && !fields.logistics_chief ? 'auto-filled-field' : ''}
                    />
                </div>
                
                <div className="form-group">
                    <label>Jefe de Finanzas/Administración:</label>
                    <input
                        type="text"
                        value={fields.finance_chief || ''}
                        onChange={(e) => handleFieldChange('finance_chief', e.target.value)}
                        placeholder={officers.finance_chief || "Nombre del jefe de finanzas"}
                        className={officers.finance_chief && !fields.finance_chief ? 'auto-filled-field' : ''}
                    />
                </div>
            </div>

            <div className="form-section">
                <h3>Información Adicional</h3>
                
                <div className="form-group">
                    <label>Creado por:</label>
                    <input
                        type="text"
                        value={fields.created_by || ''}
                        onChange={(e) => handleFieldChange('created_by', e.target.value)}
                        placeholder="Nombre de quien completa el formulario"
                    />
                </div>
                
                <div className="form-group">
                    <label>Notas de Organización:</label>
                    <textarea
                        value={fields.organization_notes || ''}
                        onChange={(e) => handleFieldChange('organization_notes', e.target.value)}
                        rows="4"
                        placeholder="Notas adicionales sobre la organización del incidente"
                    />
                </div>
            </div>

            {/* Información de carga automática */}
            <div className="auto-load-info">
                <h4>💡 Información sobre carga automática</h4>
                <p>Los campos marcados con <span className="info-note">azul</span> se han cargado automáticamente desde las asignaciones del SCI.</p>
                <p>Puedes modificar estos campos manualmente si es necesario.</p>
            </div>
        </div>
    );
};
// Componentes placeholder para los demás formularios
const Form204 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-204 - En desarrollo</div>;
};

const Form205 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-205 - En desarrollo</div>;
};

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

const Form209 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-209 - En desarrollo</div>;
};

const Form211 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-211 - En desarrollo</div>;
};

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

const Form214 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-214 - En desarrollo</div>;
};

const Form215 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-215 - En desarrollo</div>;
};

const Form216 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-216 - En desarrollo</div>;
};

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

const Form218 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-218 - En desarrollo</div>;
};

const Form219 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-219 - En desarrollo</div>;
};

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

const Form221 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario SCI-221 - En desarrollo</div>;
};

export default FormRenderer;