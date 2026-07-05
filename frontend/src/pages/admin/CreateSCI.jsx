import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';
import { ADMIN_NAV } from '../../config/nav';
import './CreateSCI.css';
import { notify, confirmDialog } from '../../utils/dialog';

const CreateSCI = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        incidentName: '',
        incidentType: '',
        severityLevel: 'medio',
        location: '',
        description: '',
        commander: '',
        publicInformationOfficer: '',
        liaisonOfficer: '',
        safetyOfficer: '',
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

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3310/api/users', {
                method: 'GET',
                credentials: 'include'
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al cargar usuarios');
            }

            setUsers(result.data || []);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            notify('Error al cargar la lista de usuarios', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCancel = async () => {
        if (await confirmDialog('¿Estás seguro de que deseas cancelar? Los datos no guardados se perderán.', { confirmText: 'Sí, cancelar', cancelText: 'Seguir editando' })) {
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
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al crear el SCI');
            }

            // Éxito
            notify(`SCI creado exitosamente! ID: ${result.incidentId}`, { variant: 'success' });
            navigate('/admin');
            
        } catch (error) {
            console.error('Error al crear SCI:', error);
            notify(`Error: ${error.message}`, { variant: 'error' });
        }
    };

    // Función para obtener la información completa del usuario por ID
    const getUserInfo = (userId) => {
        if (!userId) return null;
        const user = users.find(u => u.id === parseInt(userId));
        return user ? {
            fullName: user.full_name,
            role: user.role_name,
            unit: user.unit_name || 'Sin unidad asignada'
        } : null;
    };

    if (loading) {
        return (
            <AppLayout navItems={ADMIN_NAV} subtitle="Panel de Administración" title="Crear SCI">
                <div className="create-sci-container">
                    <div className="loading-spinner">Cargando usuarios...</div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout navItems={ADMIN_NAV} subtitle="Panel de Administración" title="Crear SCI">
            <div className="create-sci-container">
                <div className="sci-header">
                    <button className="back-button" onClick={() => navigate('/admin')}>
                        ← Volver al Dashboard
                    </button>
                    <h1>🆕 Crear Nuevo Sistema de Comando de Incidentes</h1>
                    <p>Complete toda la información requerida para iniciar un nuevo SCI</p>
                    <div className="admin-notice">
                        <strong>Modo Administrador:</strong> Tienes acceso completo para crear y gestionar incidentes.
                    </div>
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
                                <select
                                    id="commander"
                                    name="commander"
                                    value={formData.commander}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un comandante</option>
                                    {users.filter(user => user.is_active).map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.full_name} - {user.role_name} {user.unit_name ? `- ${user.unit_name}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {formData.commander && (
                                    <div className="selected-user-info">
                                        <strong>Comandante seleccionado:</strong>
                                        <div className="user-details">
                                            <span>👤 {getUserInfo(formData.commander)?.fullName}</span>
                                            <span>🎯 {getUserInfo(formData.commander)?.role}</span>
                                            <span>🏢 {getUserInfo(formData.commander)?.unit}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="publicInformationOfficer">Oficial de Información Pública</label>
                                <select
                                    id="publicInformationOfficer"
                                    name="publicInformationOfficer"
                                    value={formData.publicInformationOfficer}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un oficial</option>
                                    {users.filter(user => user.is_active).map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.full_name} - {user.role_name} {user.unit_name ? `- ${user.unit_name}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {formData.publicInformationOfficer && (
                                    <div className="selected-user-info">
                                        <strong>Oficial seleccionado:</strong>
                                        <div className="user-details">
                                            <span>👤 {getUserInfo(formData.publicInformationOfficer)?.fullName}</span>
                                            <span>🎯 {getUserInfo(formData.publicInformationOfficer)?.role}</span>
                                            <span>🏢 {getUserInfo(formData.publicInformationOfficer)?.unit}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="liaisonOfficer">Oficial de Enlaces</label>
                                <select
                                    id="liaisonOfficer"
                                    name="liaisonOfficer"
                                    value={formData.liaisonOfficer}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un oficial</option>
                                    {users.filter(user => user.is_active).map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.full_name} - {user.role_name} {user.unit_name ? `- ${user.unit_name}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {formData.liaisonOfficer && (
                                    <div className="selected-user-info">
                                        <strong>Oficial seleccionado:</strong>
                                        <div className="user-details">
                                            <span>👤 {getUserInfo(formData.liaisonOfficer)?.fullName}</span>
                                            <span>🎯 {getUserInfo(formData.liaisonOfficer)?.role}</span>
                                            <span>🏢 {getUserInfo(formData.liaisonOfficer)?.unit}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="safetyOfficer">Oficial de Seguridad</label>
                                <select
                                    id="safetyOfficer"
                                    name="safetyOfficer"
                                    value={formData.safetyOfficer}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un oficial</option>
                                    {users.filter(user => user.is_active).map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.full_name} - {user.role_name} {user.unit_name ? `- ${user.unit_name}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {formData.safetyOfficer && (
                                    <div className="selected-user-info">
                                        <strong>Oficial seleccionado:</strong>
                                        <div className="user-details">
                                            <span>👤 {getUserInfo(formData.safetyOfficer)?.fullName}</span>
                                            <span>🎯 {getUserInfo(formData.safetyOfficer)?.role}</span>
                                            <span>🏢 {getUserInfo(formData.safetyOfficer)?.unit}</span>
                                        </div>
                                    </div>
                                )}
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
        </AppLayout>
    );
};

export default CreateSCI;