import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './SystemConfiguration.css';

const SystemConfiguration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Estado para los formularios ICS
    const [forms, setForms] = useState({
        form201: false,
        form202: false,
        form203: false,
        form204: false,
        form205: false,
        form206: false,
        form207: false,
        form208: false,
        form209: false,
        form211: false,
        form212: false,
        form213: false,
        form214: false,
        form215: false,
        form216: false,
        form217: false,
        form218: false,
        form219: false,
        form220: false,
        form221: false
    });

    // Definición de los formularios ICS
    const icsForms = [
        {
            id: 'form201',
            number: 'ICS-201',
            name: 'Resumen de la Situación del Incidente',
            description: 'Proporciona una visión general del incidente y la organización actual',
            category: 'Planificación'
        },
        {
            id: 'form202',
            number: 'ICS-202',
            name: 'Objetivos del Incidente',
            description: 'Define los objetivos generales y específicos del incidente',
            category: 'Planificación'
        },
        {
            id: 'form203',
            number: 'ICS-203',
            name: 'Organización del Incidente',
            description: 'Detalla la estructura organizacional del SCI',
            category: 'Organización'
        },
        {
            id: 'form204',
            number: 'ICS-204',
            name: 'Asignaciones Tácticas',
            description: 'Asigna recursos y tareas específicas a las divisiones/grupos',
            category: 'Operaciones'
        },
        {
            id: 'form205',
            number: 'ICS-205',
            name: 'Plan de Comunicaciones',
            description: 'Especifica frecuencias, canales y procedimientos de comunicación',
            category: 'Logística'
        },
        {
            id: 'form206',
            number: 'ICS-206',
            name: 'Plan Médico',
            description: 'Detalla los procedimientos y recursos médicos',
            category: 'Logística'
        },
        {
            id: 'form207',
            number: 'ICS-207',
            name: 'Lista de Recursos',
            description: 'Inventario de todos los recursos asignados al incidente',
            category: 'Logística'
        },
        {
            id: 'form208',
            number: 'ICS-208',
            name: 'Resumen de la Situación del Incidente',
            description: 'Actualización del estado actual del incidente',
            category: 'Planificación'
        },
        {
            id: 'form209',
            number: 'ICS-209',
            name: 'Registro de Progreso',
            description: 'Seguimiento del progreso hacia los objetivos',
            category: 'Planificación'
        },
        {
            id: 'form211',
            number: 'ICS-211',
            name: 'Registro de Entrada y Salida del Personal',
            description: 'Control de ingreso y egreso del personal',
            category: 'Finanzas'
        },
        {
            id: 'form212',
            number: 'ICS-212',
            name: 'Registro de Seguridad',
            description: 'Registro de incidentes de seguridad y medidas preventivas',
            category: 'Seguridad'
        },
        {
            id: 'form213',
            number: 'ICS-213',
            name: 'Registro de Comunicaciones',
            description: 'Registro de todas las comunicaciones del incidente',
            category: 'Logística'
        },
        {
            id: 'form214',
            number: 'ICS-214',
            name: 'Registro de Actividades',
            description: 'Registro detallado de actividades por unidad',
            category: 'Operaciones'
        },
        {
            id: 'form215',
            number: 'ICS-215',
            name: 'Registro de Logística',
            description: 'Seguimiento de recursos logísticos y suministros',
            category: 'Logística'
        },
        {
            id: 'form216',
            number: 'ICS-216',
            name: 'Registro de Finanzas',
            description: 'Control de costos y gastos del incidente',
            category: 'Finanzas'
        },
        {
            id: 'form217',
            number: 'ICS-217',
            name: 'Informe de Evaluación',
            description: 'Evaluación post-incidente y análisis',
            category: 'Planificación'
        },
        {
            id: 'form218',
            number: 'ICS-218',
            name: 'Registro de Desmovilización de Recursos',
            description: 'Control de liberación de recursos',
            category: 'Logística'
        },
        {
            id: 'form219',
            number: 'ICS-219',
            name: 'Informe de Desmovilización',
            description: 'Plan de desmovilización del incidente',
            category: 'Planificación'
        },
        {
            id: 'form220',
            number: 'ICS-220',
            name: 'Registro de Lecciones Aprendidas',
            description: 'Documentación de lecciones y mejoras',
            category: 'Planificación'
        },
        {
            id: 'form221',
            number: 'ICS-221',
            name: 'Verificación de Desmovilización',
            description: 'Checklist final de desmovilización',
            category: 'Logística'
        }
    ];

    // Cargar configuración al montar el componente
    useEffect(() => {
        fetchConfiguration();
    }, []);

    const fetchConfiguration = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3310/api/system/configuration', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                if (result.data && result.data.forms) {
                    setForms(result.data.forms);
                }
            } else {
                // Si no existe la configuración, usar valores por defecto
                console.log('Usando configuración por defecto');
            }
        } catch (error) {
            console.error('Error al cargar configuración:', error);
            setError('Error al cargar la configuración del sistema');
        } finally {
            setLoading(false);
        }
    };

    const handleFormToggle = (formId) => {
        setForms(prev => ({
            ...prev,
            [formId]: !prev[formId]
        }));
    };

    const handleSaveConfiguration = async () => {
        try {
            setSaving(true);
            setMessage('');
            setError('');

            const response = await fetch('http://localhost:3310/api/system/configuration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ forms })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al guardar configuración');
            }

            setMessage('Configuración guardada exitosamente');
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => setMessage(''), 3000);

        } catch (error) {
            console.error('Error al guardar configuración:', error);
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSelectAll = (category = null) => {
        if (category) {
            // Seleccionar todos los formularios de una categoría específica
            const categoryForms = icsForms.filter(form => form.category === category);
            const updatedForms = { ...forms };
            
            categoryForms.forEach(form => {
                updatedForms[form.id] = true;
            });
            
            setForms(updatedForms);
        } else {
            // Seleccionar todos los formularios
            const allForms = {};
            icsForms.forEach(form => {
                allForms[form.id] = true;
            });
            setForms(allForms);
        }
    };

    const handleDeselectAll = (category = null) => {
        if (category) {
            // Deseleccionar todos los formularios de una categoría específica
            const categoryForms = icsForms.filter(form => form.category === category);
            const updatedForms = { ...forms };
            
            categoryForms.forEach(form => {
                updatedForms[form.id] = false;
            });
            
            setForms(updatedForms);
        } else {
            // Deseleccionar todos los formularios
            const allForms = {};
            icsForms.forEach(form => {
                allForms[form.id] = false;
            });
            setForms(allForms);
        }
    };

    // Agrupar formularios por categoría
    const formsByCategory = icsForms.reduce((acc, form) => {
        if (!acc[form.category]) {
            acc[form.category] = [];
        }
        acc[form.category].push(form);
        return acc;
    }, {});

    const categories = Object.keys(formsByCategory);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="system-configuration-container">
                    <div className="loading-spinner">Cargando configuración...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="system-configuration-container">
                <div className="config-header">
                    <button className="back-button" onClick={() => navigate('/admin')}>
                        ← Volver al Dashboard
                    </button>
                    <h1>⚙️ Configuración del Sistema</h1>
                    <p>Gestiona los formularios ICS disponibles para comandantes y oficiales</p>
                </div>

                {/* Mensajes */}
                {message && (
                    <div className="success-message">
                        ✅ {message}
                    </div>
                )}
                {error && (
                    <div className="error-message">
                        ❌ {error}
                    </div>
                )}

                {/* Resumen de configuración */}
                <div className="config-summary">
                    <div className="summary-card">
                        <h3>📊 Resumen de Formularios</h3>
                        <div className="summary-stats">
                            <div className="stat">
                                <span className="stat-number">{Object.values(forms).filter(Boolean).length}</span>
                                <span className="stat-label">Habilitados</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{Object.values(forms).filter(v => !v).length}</span>
                                <span className="stat-label">Deshabilitados</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">{icsForms.length}</span>
                                <span className="stat-label">Total</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controles globales */}
                <div className="global-controls">
                    <h3>Controles Globales</h3>
                    <div className="control-buttons">
                        <button 
                            className="btn-select-all"
                            onClick={() => handleSelectAll()}
                        >
                            ✅ Seleccionar Todos
                        </button>
                        <button 
                            className="btn-deselect-all"
                            onClick={() => handleDeselectAll()}
                        >
                            ❌ Deseleccionar Todos
                        </button>
                        <button 
                            className="btn-save"
                            onClick={handleSaveConfiguration}
                            disabled={saving}
                        >
                            {saving ? '💾 Guardando...' : '💾 Guardar Configuración'}
                        </button>
                    </div>
                </div>

                {/* Formularios por categoría */}
                <div className="forms-configuration">
                    {categories.map(category => (
                        <div key={category} className="category-section">
                            <div className="category-header">
                                <h3>{category}</h3>
                                <div className="category-controls">
                                    <button 
                                        className="btn-category-select"
                                        onClick={() => handleSelectAll(category)}
                                    >
                                        ✅ Todos
                                    </button>
                                    <button 
                                        className="btn-category-deselect"
                                        onClick={() => handleDeselectAll(category)}
                                    >
                                        ❌ Ninguno
                                    </button>
                                </div>
                            </div>
                            
                            <div className="forms-grid">
                                {formsByCategory[category].map(form => (
                                    <div key={form.id} className="form-card">
                                        <div className="form-header">
                                            <div className="form-number">{form.number}</div>
                                            <label className="toggle-switch">
                                                <input
                                                    type="checkbox"
                                                    checked={forms[form.id]}
                                                    onChange={() => handleFormToggle(form.id)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                        <div className="form-content">
                                            <h4 className="form-name">{form.name}</h4>
                                            <p className="form-description">{form.description}</p>
                                        </div>
                                        <div className="form-status">
                                            <span className={`status ${forms[form.id] ? 'enabled' : 'disabled'}`}>
                                                {forms[form.id] ? '🟢 Habilitado' : '🔴 Deshabilitado'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botón de guardar fijo */}
                <div className="fixed-save-button">
                    <button 
                        className="btn-save-large"
                        onClick={handleSaveConfiguration}
                        disabled={saving}
                    >
                        {saving ? '💾 Guardando Configuración...' : '💾 Guardar Configuración del Sistema'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default SystemConfiguration;