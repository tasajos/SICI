import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './CreateSCI.css';

const CreateSCI = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        incidentName: '',
        incidentType: '',
        severityLevel: 'medio',
        location: '',
        description: '',
        commander: '',
        publicInformationOfficer: '',  // Cambiado de operationsChief
        liaisonOfficer: '',            // Cambiado de logisticsChief
        safetyOfficer: '',             // Cambiado de planningChief
        // financeChief removido temporalmente
        startDate: '',
        estimatedDuration: '',
        resourcesNeeded: '',
        emergencyContacts: ''
    });

    const incidentTypes = [
        'Incendio Forestal',
        'Incendio Estructural',
        'Inundación',     
        'Rescate Animal',
        'Terremoto',
        'Accidente de Tránsito',
        'Derrame Químico',
        'Emergencia Médica',
        'Evacuación Masiva',
        'Otro'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCancel = () => {
        if (window.confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
            navigate('/admin');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Enviar datos al backend
            const response = await fetch('http://localhost:3310/api/incidents/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Importante para enviar la cookie de sesión
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al crear el SCI');
            }

            // Éxito
            alert(`SCI creado exitosamente! ID: ${result.incidentId}`);
            navigate('/admin');
            
        } catch (error) {
            console.error('Error al crear SCI:', error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <>
            <Navbar />
            <div className="create-sci-container">
                <div className="sci-header">
                    <button className="back-button" onClick={() => navigate('/admin')}>
                        ← Volver al Dashboard
                    </button>
                    <h1>🆕 Crear Nuevo Sistema de Comando de Incidentes</h1>
                    <p>Complete toda la información requerida para iniciar un nuevo SCI</p>
                </div>

                <form onSubmit={handleSubmit} className="sci-form">
                    {/* Información Básica del Incidente */}
                    <div className="form-section">
                        <h2>📋 Información Básica del Incidente</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="incidentName">Nombre del Incidente *</label>
                                <input
                                    type="text"
                                    id="incidentName"
                                    name="incidentName"
                                    value={formData.incidentName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Incendio Forestal - Zona Norte"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="incidentType">Tipo de Incidente *</label>
                                <select
                                    id="incidentType"
                                    name="incidentType"
                                    value={formData.incidentType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un tipo</option>
                                    {incidentTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="severityLevel">Nivel de Severidad *</label>
                                <select
                                    id="severityLevel"
                                    name="severityLevel"
                                    value={formData.severityLevel}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="bajo">Bajo</option>
                                    <option value="medio">Medio</option>
                                    <option value="alto">Alto</option>
                                    <option value="critico">Crítico</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="location">Ubicación *</label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej: Coordenadas o dirección específica"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">Descripción del Incidente *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Describa en detalle la naturaleza del incidente..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Estructura de Comando */}
                    <div className="form-section">
                        <h2>👥 Estructura de Comando del SCI</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="commander">Comandante del Incidente *</label>
                                <input
                                    type="text"
                                    id="commander"
                                    name="commander"
                                    value={formData.commander}
                                    onChange={handleChange}
                                    required
                                    placeholder="Nombre del comandante"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="publicInformationOfficer">Oficial de Información Pública</label>
                                <input
                                    type="text"
                                    id="publicInformationOfficer"
                                    name="publicInformationOfficer"
                                    value={formData.publicInformationOfficer}
                                    onChange={handleChange}
                                    placeholder="Nombre del oficial de información pública"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="liaisonOfficer">Oficial de Enlaces</label>
                                <input
                                    type="text"
                                    id="liaisonOfficer"
                                    name="liaisonOfficer"
                                    value={formData.liaisonOfficer}
                                    onChange={handleChange}
                                    placeholder="Nombre del oficial de enlaces"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="safetyOfficer">Oficial de Seguridad</label>
                                <input
                                    type="text"
                                    id="safetyOfficer"
                                    name="safetyOfficer"
                                    value={formData.safetyOfficer}
                                    onChange={handleChange}
                                    placeholder="Nombre del oficial de seguridad"
                                />
                            </div>

                            {/* Jefe de Finanzas removido temporalmente */}
                        </div>
                    </div>

                    {/* Información Adicional */}
                    <div className="form-section">
                        <h2>📅 Información Adicional</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="startDate">Fecha y Hora de Inicio *</label>
                                <input
                                    type="datetime-local"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="estimatedDuration">Duración Estimada</label>
                                <input
                                    type="text"
                                    id="estimatedDuration"
                                    name="estimatedDuration"
                                    value={formData.estimatedDuration}
                                    onChange={handleChange}
                                    placeholder="Ej: 48 horas, 1 semana, etc."
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="resourcesNeeded">Recursos Necesarios</label>
                                <textarea
                                    id="resourcesNeeded"
                                    name="resourcesNeeded"
                                    value={formData.resourcesNeeded}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Liste los recursos, equipos y personal requerido..."
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="emergencyContacts">Contactos de Emergencia</label>
                                <textarea
                                    id="emergencyContacts"
                                    name="emergencyContacts"
                                    value={formData.emergencyContacts}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Liste contactos clave y números de emergencia..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-button">
                            🚀 Crear Sistema de Comando
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default CreateSCI;