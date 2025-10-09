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
        operationsChief: '',
        logisticsChief: '',
        planningChief: '',
        financeChief: '',
        startDate: '',
        estimatedDuration: '',
        resourcesNeeded: '',
        emergencyContacts: ''
    });

    const incidentTypes = [
        'Incendio Forestal',
        'Inundación',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar los datos al backend
        console.log('Datos del SCI:', formData);
        
        // Simulación de éxito
        alert('SCI creado exitosamente!');
        navigate('/admin');
    };

    const handleCancel = () => {
        if (window.confirm('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.')) {
            navigate('/admin');
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
                                <label htmlFor="operationsChief">Jefe de Operaciones</label>
                                <input
                                    type="text"
                                    id="operationsChief"
                                    name="operationsChief"
                                    value={formData.operationsChief}
                                    onChange={handleChange}
                                    placeholder="Nombre del jefe de operaciones"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="logisticsChief">Jefe de Logística</label>
                                <input
                                    type="text"
                                    id="logisticsChief"
                                    name="logisticsChief"
                                    value={formData.logisticsChief}
                                    onChange={handleChange}
                                    placeholder="Nombre del jefe de logística"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="planningChief">Jefe de Planificación</label>
                                <input
                                    type="text"
                                    id="planningChief"
                                    name="planningChief"
                                    value={formData.planningChief}
                                    onChange={handleChange}
                                    placeholder="Nombre del jefe de planificación"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="financeChief">Jefe de Finanzas/Administración</label>
                                <input
                                    type="text"
                                    id="financeChief"
                                    name="financeChief"
                                    value={formData.financeChief}
                                    onChange={handleChange}
                                    placeholder="Nombre del jefe de finanzas"
                                />
                            </div>
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