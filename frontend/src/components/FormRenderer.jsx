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
                return <Form206 fields={formData} onChange={handleInputChange} />;
            case 'form207':
                return <Form207 fields={formData} onChange={handleInputChange} />;
            case 'form208':
                return <Form208 fields={formData} onChange={handleInputChange} />;
            case 'form209':
                return <Form209 fields={formData} onChange={handleInputChange} />;
            case 'form211':
                return <Form211 fields={formData} onChange={handleInputChange} />;
            case 'form212':
                return <Form212 fields={formData} onChange={handleInputChange} />;
            case 'form213':
                return <Form213 fields={formData} onChange={handleInputChange} />;
            case 'form214':
                return <Form214 fields={formData} onChange={handleInputChange} />;
            case 'form215':
                return <Form215 fields={formData} onChange={handleInputChange} />;
            case 'form216':
                return <Form216 fields={formData} onChange={handleInputChange} />;
            case 'form217':
                return <Form217 fields={formData} onChange={handleInputChange} />;
            case 'form218':
                return <Form218 fields={formData} onChange={handleInputChange} />;
            case 'form219':
                return <Form219 fields={formData} onChange={handleInputChange} />;
            case 'form220':
                return <Form220 fields={formData} onChange={handleInputChange} />;
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
    return <div className="form-fields">Formulario ICS-204 - En desarrollo</div>;
};

const Form205 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-205 - En desarrollo</div>;
};

const Form206 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-206 - En desarrollo</div>;
};

const Form207 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-207 - En desarrollo</div>;
};

const Form208 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-208 - En desarrollo</div>;
};

const Form209 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-209 - En desarrollo</div>;
};

const Form211 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-211 - En desarrollo</div>;
};

const Form212 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-212 - En desarrollo</div>;
};

const Form213 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-213 - En desarrollo</div>;
};

const Form214 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-214 - En desarrollo</div>;
};

const Form215 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-215 - En desarrollo</div>;
};

const Form216 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-216 - En desarrollo</div>;
};

const Form217 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-217 - En desarrollo</div>;
};

const Form218 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-218 - En desarrollo</div>;
};

const Form219 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-219 - En desarrollo</div>;
};

const Form220 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-220 - En desarrollo</div>;
};

const Form221 = ({ fields, onChange }) => {
    return <div className="form-fields">Formulario ICS-221 - En desarrollo</div>;
};

export default FormRenderer;