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
                return <Form201 fields={formData} onChange={handleInputChange} />;
            case 'form202':
                return <Form202 fields={formData} onChange={handleInputChange} />;
            case 'form203':
                return <Form203 fields={formData} onChange={handleInputChange} />;
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

// Componente para el Form 202 (similar estructura para los demás formularios)
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

// ... Continúa con los demás componentes para cada formulario (Form203, Form204, etc.)

export default FormRenderer;