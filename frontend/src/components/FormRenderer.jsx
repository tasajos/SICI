import React, { useState, useEffect } from 'react';
import './FormRenderer.css';
import { notify } from '../utils/dialog';

// Importar componentes de formularios individuales
import Form201 from '../Forms/Form201';
import  Form202  from '../Forms/Form202';
import  Form203  from '../Forms/Form203';
import  Form204  from '../Forms/Form204';
import  Form205  from '../Forms/Form205';
import  Form206  from '../Forms/Form206';
import  Form207  from '../Forms/Form207';
import  Form208  from '../Forms/Form208';
import  Form209  from '../Forms/Form209';
import  Form211  from '../Forms/Form211';
import  Form212  from '../Forms/Form212';
import  Form213  from '../Forms/Form213';
import  Form214  from '../Forms/Form214';
import  Form215  from '../Forms/Form215';
import  Form216  from '../Forms/Form216';
import  Form217  from '../Forms/Form217';
import  Form218  from '../Forms/Form218';
import  Form219  from '../Forms/Form219';
import  Form220  from '../Forms/Form220';
import  Form221  from '../Forms/Form221';

// Importar la función auxiliar
import { registerAssignments } from '../utils/assignments';

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
        console.log('📋 Datos del formulario a guardar:', formData); // ← Agrega este log
        
        // Guardar el formulario principal
        await onSave(form, formData, incidentId);
        
        // Si es el formulario 203, registrar también las asignaciones
        if (form.id === 'form203') {
            console.log('🔄 Procesando asignaciones del Form203...');
            // Cargar usuarios para las asignaciones
            const usersResponse = await fetch('http://localhost:3310/api/users', {
                credentials: 'include'
            });
            
            if (usersResponse.ok) {
                const usersResult = await usersResponse.json();
                const activeUsers = usersResult.data.filter(user => user.is_active);
                console.log('👥 Usuarios activos cargados:', activeUsers);
                await registerAssignments(formData, incidentId, activeUsers);
            }
        }
        
        onClose();
    } catch (error) {
        console.error('Error al guardar formulario:', error);
        notify('Error al guardar el formulario', { variant: 'error' });
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
            return <Form207 fields={formData} onChange={handleInputChange} incidentId={incidentId} />;
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

export default FormRenderer;