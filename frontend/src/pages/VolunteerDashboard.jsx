import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './VolunteerDashboard.css';
import FormRenderer from '../components/FormRenderer';

const VolunteerDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeIncidents: 0,
        myInvolvedIncidents: 0,
        availableUnits: 0,
        todayIncidents: 0,
        loading: true
    });
    const [assignments, setAssignments] = useState([]);
    const [assignmentsLoading, setAssignmentsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showAssignmentsModal, setShowAssignmentsModal] = useState(false);
  

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
    // Cargar estadísticas y asignaciones al montar el componente
    useEffect(() => {
        fetchDashboardStats();
        fetchUserData();
        fetchAssignments();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:3310/api/users/me', {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            if (response.ok) {
                setUser(result.data);
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            // Hacer múltiples requests en paralelo
            const [incidentsResponse, unitsResponse] = await Promise.all([
                fetch('http://localhost:3310/api/incidents', { credentials: 'include' }),
                fetch('http://localhost:3310/api/units', { credentials: 'include' })
            ]);

            const incidentsData = await incidentsResponse.json();
            const unitsData = await unitsResponse.json();

            if (!incidentsResponse.ok || !unitsResponse.ok) {
                throw new Error('Error al cargar estadísticas');
            }

            // Calcular estadísticas
            const activeIncidents = (incidentsData.data || []).filter(incident => 
                incident.status === 'activo'
            ).length;

            const availableUnits = (unitsData.data || []).filter(unit => 
                unit.status === 'activo'
            ).length;

            // Calcular incidentes de hoy
            const today = new Date().toISOString().split('T')[0];
            const todayIncidents = (incidentsData.data || []).filter(incident => {
                const incidentDate = new Date(incident.created_at).toISOString().split('T')[0];
                return incidentDate === today;
            }).length;

            setStats({
                activeIncidents,
                myInvolvedIncidents: assignments.length,
                availableUnits,
                todayIncidents,
                loading: false
            });

        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await fetch('http://localhost:3310/api/users/my-assignments', {
                method: 'GET',
                credentials: 'include'
            });
            const result = await response.json();
            
            if (response.ok) {
                setAssignments(result.data || []);
                // Actualizar el contador de asignaciones en las stats
                setStats(prev => ({
                    ...prev,
                    myInvolvedIncidents: result.data.length
                }));
            }
        } catch (error) {
            console.error('Error al cargar asignaciones:', error);
        } finally {
            setAssignmentsLoading(false);
        }
    };

    const handleFormSave = async (form, formData, incidentId) => {
    try {
        const response = await fetch(`http://localhost:3310/api/forms/${form.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                ...formData,
                incident_id: incidentId
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Error al guardar formulario');
        }

        alert(`Formulario ${form.number} guardado exitosamente`);
        return result.data;
    } catch (error) {
        console.error('Error al guardar formulario:', error);
        throw error;
    }
};

    const getAssignmentTypeLabel = (type) => {
        const types = {
            'commander': 'Comandante del Incidente',
            'public_information_officer': 'Oficial de Información Pública',
            'liaison_officer': 'Oficial de Enlaces',
            'safety_officer': 'Oficial de Seguridad'
        };
        return types[type] || type;
    };

    const getSeverityColor = (severity) => {
        const colors = {
            'bajo': '#27ae60',
            'medio': '#f39c12',
            'alto': '#e67e22',
            'critico': '#e74c3c'
        };
        return colors[severity] || '#7f8c8d';
    };

    const getStatusColor = (status) => {
        const colors = {
            'activo': '#27ae60',
            'cerrado': '#e74c3c',
            'suspendido': '#f39c12'
        };
        return colors[status] || '#7f8c8d';
    };

    const handleRefreshAll = () => {
        setStats(prev => ({ ...prev, loading: true }));
        setAssignmentsLoading(true);
        fetchDashboardStats();
        fetchAssignments();
    };

    const handleAssignmentsCardClick = () => {
        if (assignments.length > 0) {
            setShowAssignmentsModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowAssignmentsModal(false);
    };

    const cards = [
        {
            id: 1,
            title: '🆕 Crear Nuevo SCI',
            description: 'Inicia un nuevo Sistema de Comando de Incidentes',
            buttonText: 'Crear SCI',
            path: '/volunteer/create-sci',
            color: '#27ae60',
            icon: '➕'
        },
        {
            id: 2,
            title: '📋 Incidentes Activos',
            description: 'Consulta y monitorea todos los incidentes en curso',
            buttonText: 'Ver Incidentes',
            path: '/volunteer/incidents',
            color: '#e74c3c',
            icon: '🚨'
        },
        {
            id: 3,
            title: '🛠️ Recursos Disponibles',
            description: 'Consulta equipos y unidades de respuesta disponibles',
            buttonText: 'Ver Recursos',
            path: '/volunteer/resources',
            color: '#2980b9',
            icon: '👥'
        },
        {
            id: 4,
            title: '📝 Mis Reportes',
            description: 'Gestiona los reportes e incidentes en los que participas',
            buttonText: 'Mis Reportes',
            path: '/volunteer/my-reports',
            color: '#8e44ad',
            icon: '📋'
        },
        {
            id: 5,
            title: '🗺️ Mapa Operativo',
            description: 'Visualiza incidentes y recursos en tiempo real',
            buttonText: 'Ver Mapa',
            path: '/volunteer/map',
            color: '#f39c12',
            icon: '🗺️'
        },
        {
            id: 6,
            title: '📚 Guías Rápidas',
            description: 'Protocolos y procedimientos de respuesta',
            buttonText: 'Consultar',
            path: '/volunteer/guides',
            color: '#16a085',
            icon: '📚'
        }
    ];

    const handleCardClick = (path) => {
        navigate(path);
    };
// Función para obtener formularios disponibles según el rol
const getAvailableFormsForRole = (role) => {
    const roleForms = {
        'commander': ['201', '202', '203', '207', '208', '217', '220'],
        'safety_officer': ['206', '212'],
        'public_information_officer': ['201', '208', '213', '217'],
        'liaison_officer': ['203', '213'],
        'planning_chief': ['201', '202', '203', '204', '207', '208', '209', '214', '217', '220'],
        'operations_chief': ['204', '205', '206', '214', '215', '218'],
        'logistics_chief': ['205', '211', '213', '215', '216'],
        'finance_chief': ['216', '218', '219', '221']
    };

    const formsForRole = roleForms[role] || [];
    return icsForms.filter(form => {
        const formNumber = form.number.replace('ICS-', '');
        return formsForRole.includes(formNumber);
    });
};

// Estado para controlar el formulario abierto
const [selectedForm, setSelectedForm] = useState(null);
const [selectedIncidentId, setSelectedIncidentId] = useState(null);

// Función para abrir un formulario
const handleOpenForm = (incidentId, form) => {
    setSelectedIncidentId(incidentId);
    setSelectedForm(form);
    setShowAssignmentsModal(false);
};

// Función para cerrar el formulario
const handleCloseForm = () => {
    setSelectedForm(null);
    setSelectedIncidentId(null);
};



    return (
        <>
            <Navbar />
            <div className="volunteer-dashboard">
                <div className="dashboard-header">
                    <h1>🚑 Panel de Voluntario</h1>
                    <p>Bienvenido al Sistema de Comando de Incidentes - Módulo de Respuesta</p>
                    {user && (
                        <div className="user-welcome">
                            <strong>{user.full_name}</strong> - {user.role_name}
                            {user.unit_name && <span> - {user.unit_name}</span>}
                        </div>
                    )}
                    <button 
                        className="refresh-stats-btn"
                        onClick={handleRefreshAll}
                        disabled={stats.loading || assignmentsLoading}
                    >
                        {stats.loading ? '🔄 Cargando...' : '🔄 Actualizar'}
                    </button>
                </div>

                {/* Estadísticas rápidas */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-icon">🚨</div>
                        <div className="stat-content">
                            <h4>Incidentes Activos</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.activeIncidents}</span>
                            )}
                            <p className="stat-description">Requieren atención inmediata</p>
                        </div>
                    </div>
                    
                    <div 
                        className={`stat-card assignments-card ${assignments.length > 0 ? 'has-assignments' : ''}`}
                        onClick={handleAssignmentsCardClick}
                        style={{ cursor: assignments.length > 0 ? 'pointer' : 'default' }}
                    >
                        <div className="stat-icon">👤</div>
                        <div className="stat-content">
                            <h4>Mis Asignaciones</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.myInvolvedIncidents}</span>
                            )}
                            <p className="stat-description">
                                {assignments.length > 0 ? 'Click para ver detalles' : 'Incidentes asignados'}
                            </p>
                        </div>
                        {assignments.length > 0 && (
                            <div className="assignment-indicator">📋</div>
                        )}
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">🛠️</div>
                        <div className="stat-content">
                            <h4>Recursos Disponibles</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.availableUnits}</span>
                            )}
                            <p className="stat-description">Unidades operativas</p>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-content">
                            <h4>Nuevos Hoy</h4>
                            {stats.loading ? (
                                <div className="stat-loading">...</div>
                            ) : (
                                <span className="stat-number">{stats.todayIncidents}</span>
                            )}
                            <p className="stat-description">Incidentes reportados hoy</p>
                        </div>
                    </div>
                </div>

                {/* Tarjetas de funcionalidades */}
                <div className="dashboard-cards">
                    {cards.map(card => (
                        <div 
                            key={card.id} 
                            className="dashboard-card"
                            style={{ '--card-color': card.color }}
                        >
                            <div className="card-icon">
                                {card.icon}
                            </div>
                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-description">{card.description}</p>
                            <button 
                                className="card-button"
                                onClick={() => handleCardClick(card.path)}
                            >
                                {card.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Alertas y notificaciones */}
                <div className="alerts-section">
                    <h3>⚠️ Alertas Importantes</h3>
                    <div className="alerts-container">
                        <div className="alert-item critical">
                            <div className="alert-icon">🚨</div>
                            <div className="alert-content">
                                <h4>Incidentes Críticos Activos</h4>
                                <p>
                                    {stats.activeIncidents > 0 
                                        ? `Existen ${stats.activeIncidents} incidente(s) requiriendo respuesta inmediata.`
                                        : 'No hay incidentes críticos activos en este momento.'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="alert-item info">
                            <div className="alert-icon">📋</div>
                            <div className="alert-content">
                                <h4>Recordatorio de Protocolos</h4>
                                <p>Sigue los procedimientos establecidos y reporta cualquier situación anómala inmediatamente.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="quick-actions">
                    <h3>🚀 Acciones Inmediatas</h3>
                    <div className="action-buttons">
                        <button 
                            className="action-btn emergency"
                            onClick={() => navigate('/volunteer/create-sci')}
                        >
                            🚨 Reportar Emergencia
                        </button>
                        <button 
                            className="action-btn primary"
                            onClick={() => navigate('/volunteer/incidents')}
                        >
                            📋 Ver Todos los Incidentes
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => navigate('/volunteer/resources')}
                        >
                            🛠️ Consultar Recursos
                        </button>
                    </div>
                </div>

                {/* Modal de Asignaciones */}
                {showAssignmentsModal && (
                    <div className="modal-overlay" onClick={handleCloseModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>📋 Mis Asignaciones Activas</h2>
                                <button className="modal-close" onClick={handleCloseModal}>×</button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="assignments-list">
                                    {assignments.map(assignment => (
                                    <div key={assignment.id} className="assignment-modal-card">
                                        <div className="assignment-modal-header">
                                            <h3>{assignment.incident_name}</h3>
                                            <div className="assignment-badges">
                                                <span 
                                                    className="severity-badge"
                                                    style={{ backgroundColor: getSeverityColor(assignment.severity_level) }}
                                                >
                                                    {assignment.severity_level.toUpperCase()}
                                                </span>
                                                <span 
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(assignment.incident_status) }}
                                                >
                                                    {assignment.incident_status}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="assignment-modal-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Mi Rol:</span>
                                                <span className="detail-value role">{getAssignmentTypeLabel(assignment.assignment_type)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Ubicación:</span>
                                                <span className="detail-value">{assignment.location}</span>
                                            </div>
                                            
                                            {/* SECCIÓN NUEVA: Formularios disponibles */}
                                            <div className="detail-row full-width">
                                                <span className="detail-label">Formularios Disponibles:</span>
                                                <div className="available-forms">
                                                    {getAvailableFormsForRole(assignment.assignment_type).map(form => (
                                                        <button
                                                            key={form.id}
                                                            className="form-button"
                                                            onClick={() => handleOpenForm(assignment.incident_id, form)}
                                                        >
                                                            <span className="form-number">{form.number}</span>
                                                            <span className="form-name">{form.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="assignment-modal-footer">
                                            <span className="assignment-date">
                                                Asignado el: {new Date(assignment.assignment_date).toLocaleDateString('es-ES')}
                                            </span>
                                            <button 
                                                className="view-incident-btn"
                                                onClick={() => {
                                                    handleCloseModal();
                                                    navigate('/volunteer/incidents');
                                                }}
                                            >
                                                Ver en Lista de Incidentes
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                                                </div>
                            </div>

                            <div className="modal-footer">
                                <button 
                                    className="btn-close-modal"
                                    onClick={handleCloseModal}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Formulario */}
{selectedForm && (
    <div className="modal-overlay form-modal-overlay">
        <div className="modal-content form-modal-content">
            <div className="modal-header">
                <h2>{selectedForm.number} - {selectedForm.name}</h2>
                <button className="modal-close" onClick={handleCloseForm}>×</button>
            </div>
            
            <div className="modal-body form-modal-body">
                <FormRenderer 
                    form={selectedForm}
                    incidentId={selectedIncidentId}
                    onClose={handleCloseForm}
                    onSave={handleFormSave}
                />
            </div>
        </div>
    </div>
)}
            </div>
        </>
    );
};

export default VolunteerDashboard;