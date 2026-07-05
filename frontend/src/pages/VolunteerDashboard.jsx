import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { VOLUNTEER_NAV } from '../config/nav';
import '../styles/dashboard.css';
import './VolunteerDashboard.css';
import { notify } from '../utils/dialog';
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
    const [selectedForm, setSelectedForm] = useState(null);
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);

    // Definición de los formularios SCI
    const icsForms = [
        { id: 'form201', number: 'SCI-201', name: 'Resumen de la Situación del Incidente', description: 'Proporciona una visión general del incidente y la organización actual', category: 'Planificación' },
        { id: 'form202', number: 'SCI-202', name: 'Objetivos del Incidente', description: 'Define los objetivos generales y específicos del incidente', category: 'Planificación' },
        { id: 'form203', number: 'SCI-203', name: 'Organización del Incidente', description: 'Detalla la estructura organizacional del SCI', category: 'Organización' },
        { id: 'form204', number: 'SCI-204', name: 'Asignaciones Tácticas', description: 'Asigna recursos y tareas específicas a las divisiones/grupos', category: 'Operaciones' },
        { id: 'form205', number: 'SCI-205', name: 'Plan de Comunicaciones', description: 'Especifica frecuencias, canales y procedimientos de comunicación', category: 'Logística' },
        { id: 'form206', number: 'SCI-206', name: 'Plan Médico', description: 'Detalla los procedimientos y recursos médicos', category: 'Logística' },
        { id: 'form207', number: 'SCI-207', name: 'Lista de Recursos', description: 'Inventario de todos los recursos asignados al incidente', category: 'Logística' },
        { id: 'form208', number: 'SCI-208', name: 'Resumen de la Situación del Incidente', description: 'Actualización del estado actual del incidente', category: 'Planificación' },
        { id: 'form209', number: 'SCI-209', name: 'Registro de Progreso', description: 'Seguimiento del progreso hacia los objetivos', category: 'Planificación' },
        { id: 'form211', number: 'SCI-211', name: 'Registro de Entrada y Salida del Personal', description: 'Control de ingreso y egreso del personal', category: 'Finanzas' },
        { id: 'form212', number: 'SCI-212', name: 'Registro de Seguridad', description: 'Registro de incidentes de seguridad y medidas preventivas', category: 'Seguridad' },
        { id: 'form213', number: 'SCI-213', name: 'Registro de Comunicaciones', description: 'Registro de todas las comunicaciones del incidente', category: 'Logística' },
        { id: 'form214', number: 'SCI-214', name: 'Registro de Actividades', description: 'Registro detallado de actividades por unidad', category: 'Operaciones' },
        { id: 'form215', number: 'SCI-215', name: 'Registro de Logística', description: 'Seguimiento de recursos logísticos y suministros', category: 'Logística' },
        { id: 'form216', number: 'SCI-216', name: 'Registro de Finanzas', description: 'Control de costos y gastos del incidente', category: 'Finanzas' },
        { id: 'form217', number: 'SCI-217', name: 'Informe de Evaluación', description: 'Evaluación post-incidente y análisis', category: 'Planificación' },
        { id: 'form218', number: 'SCI-218', name: 'Registro de Desmovilización de Recursos', description: 'Control de liberación de recursos', category: 'Logística' },
        { id: 'form219', number: 'SCI-219', name: 'Informe de Desmovilización', description: 'Plan de desmovilización del incidente', category: 'Planificación' },
        { id: 'form220', number: 'SCI-220', name: 'Registro de Lecciones Aprendidas', description: 'Documentación de lecciones y mejoras', category: 'Planificación' },
        { id: 'form221', number: 'SCI-221', name: 'Verificación de Desmovilización', description: 'Checklist final de desmovilización', category: 'Logística' }
    ];

    useEffect(() => {
        fetchDashboardStats();
        fetchUserData();
        fetchAssignments();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:3310/api/users/me', { method: 'GET', credentials: 'include' });
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
            const [incidentsResponse, unitsResponse] = await Promise.all([
                fetch('http://localhost:3310/api/incidents', { credentials: 'include' }),
                fetch('http://localhost:3310/api/units', { credentials: 'include' })
            ]);

            const incidentsData = await incidentsResponse.json();
            const unitsData = await unitsResponse.json();

            if (!incidentsResponse.ok || !unitsResponse.ok) {
                throw new Error('Error al cargar estadísticas');
            }

            const activeIncidents = (incidentsData.data || []).filter(incident => incident.status === 'activo').length;
            const availableUnits = (unitsData.data || []).filter(unit => unit.status === 'activo').length;

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
            const response = await fetch('http://localhost:3310/api/users/my-assignments', { method: 'GET', credentials: 'include' });
            const result = await response.json();
            if (response.ok) {
                setAssignments(result.data || []);
                setStats(prev => ({ ...prev, myInvolvedIncidents: result.data.length }));
            }
        } catch (error) {
            console.error('Error al cargar asignaciones:', error);
        } finally {
            setAssignmentsLoading(false);
        }
    };

    const handleFormSave = async (form, formData, incidentId) => {
        try {
            const dataToSend = { ...formData, incident_id: incidentId };

            const response = await fetch(`http://localhost:3310/api/forms/${form.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dataToSend)
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Respuesta no JSON:', text);
                throw new Error('El servidor devolvió una respuesta no válida');
            }

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
            }

            notify(`Formulario ${form.number} guardado exitosamente`, { variant: 'success' });
            return result.data;
        } catch (error) {
            console.error('Error al guardar formulario:', error);
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Error de conexión con el servidor. Verifique que el servidor esté ejecutándose.');
            }
            throw error;
        }
    };

    const getAssignmentTypeLabel = (type) => {
        const types = {
            'commander': 'Comandante del Incidente',
            'public_information_officer': 'Oficial de Información Pública',
            'liaison_officer': 'Oficial de Enlaces',
            'safety_officer': 'Oficial de Seguridad',
            'operations_chief': 'Jefe de Operaciones',
            'planning_chief': 'Jefe de Planificación',
            'logistics_chief': 'Jefe de Logística',
            'finance_chief': 'Jefe de Administración y Finanzas'
        };
        return types[type] || type;
    };

    const getSeverityColor = (severity) => {
        const colors = { 'bajo': '#27ae60', 'medio': '#f39c12', 'alto': '#e67e22', 'critico': '#e74c3c' };
        return colors[severity] || '#7f8c8d';
    };

    const getStatusColor = (status) => {
        const colors = { 'activo': '#27ae60', 'cerrado': '#e74c3c', 'suspendido': '#f39c12' };
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

    const handleCloseModal = () => setShowAssignmentsModal(false);

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
        return icsForms.filter(form => formsForRole.includes(form.number.replace('SCI-', '')));
    };

    const handleOpenForm = (incidentId, form) => {
        setSelectedIncidentId(incidentId);
        setSelectedForm(form);
        setShowAssignmentsModal(false);
    };

    const handleCloseForm = () => {
        setSelectedForm(null);
        setSelectedIncidentId(null);
    };

    const cards = [
        { id: 1, title: 'Crear Nuevo SCI', description: 'Inicia un nuevo Sistema de Comando de Incidentes', buttonText: 'Crear SCI', path: '/volunteer/create-sci', color: '#27ae60', icon: '➕' },
        { id: 2, title: 'Incidentes Activos', description: 'Consulta y monitorea todos los incidentes en curso', buttonText: 'Ver Incidentes', path: '/volunteer/incidents', color: '#e74c3c', icon: '🚨' },
        { id: 3, title: 'Recursos Disponibles', description: 'Consulta equipos y unidades de respuesta disponibles', buttonText: 'Ver Recursos', path: '/volunteer/resources', color: '#2980b9', icon: '🛠️' },
        { id: 4, title: 'Mis Reportes', description: 'Gestiona los reportes e incidentes en los que participas', buttonText: 'Mis Reportes', path: '/volunteer/my-reports', color: '#8e44ad', icon: '📝' },
        { id: 5, title: 'Mapa Operativo', description: 'Visualiza incidentes y recursos en tiempo real', buttonText: 'Ver Mapa', path: '/volunteer/map', color: '#f39c12', icon: '🗺️' },
        { id: 6, title: 'Guías Rápidas', description: 'Protocolos y procedimientos de respuesta', buttonText: 'Consultar', path: '/volunteer/guides', color: '#16a085', icon: '📚' }
    ];

    const refreshBtn = (
        <button className="app-btn" onClick={handleRefreshAll} disabled={stats.loading || assignmentsLoading}>
            <span className={stats.loading ? 'app-spin' : ''}>🔄</span>
            {stats.loading ? 'Cargando...' : 'Actualizar'}
        </button>
    );

    const pageSubtitle = user
        ? `${user.full_name} · ${user.role_name}${user.unit_name ? ` · ${user.unit_name}` : ''}`
        : 'Módulo de Respuesta ante Incidentes';

    return (
        <AppLayout
            navItems={VOLUNTEER_NAV}
            subtitle="Panel de Voluntario"
            title="Panel de Voluntario 🚑"
            pageSubtitle={pageSubtitle}
            actions={refreshBtn}
        >
            {/* KPIs */}
            <section className="kpi-grid">
                <div className="kpi-card" style={{ '--accent': '#e74c3c' }}>
                    <div className="kpi-card__icon">🚨</div>
                    <div className="kpi-card__body">
                        <span className="kpi-card__label">Incidentes Activos</span>
                        {stats.loading
                            ? <span className="kpi-card__value is-loading">···</span>
                            : <span className="kpi-card__value">{stats.activeIncidents}</span>}
                        <span className="kpi-card__hint">Requieren atención inmediata</span>
                    </div>
                </div>

                <div
                    className={`kpi-card ${assignments.length > 0 ? 'is-clickable' : ''}`}
                    style={{ '--accent': '#2980b9' }}
                    onClick={handleAssignmentsCardClick}
                >
                    <div className="kpi-card__icon">👤</div>
                    <div className="kpi-card__body">
                        <span className="kpi-card__label">Mis Asignaciones</span>
                        {stats.loading
                            ? <span className="kpi-card__value is-loading">···</span>
                            : <span className="kpi-card__value">{stats.myInvolvedIncidents}</span>}
                        <span className="kpi-card__hint">
                            {assignments.length > 0 ? 'Click para ver detalles' : 'Incidentes asignados'}
                        </span>
                    </div>
                </div>

                <div className="kpi-card" style={{ '--accent': '#27ae60' }}>
                    <div className="kpi-card__icon">🛠️</div>
                    <div className="kpi-card__body">
                        <span className="kpi-card__label">Recursos Disponibles</span>
                        {stats.loading
                            ? <span className="kpi-card__value is-loading">···</span>
                            : <span className="kpi-card__value">{stats.availableUnits}</span>}
                        <span className="kpi-card__hint">Unidades operativas</span>
                    </div>
                </div>

                <div className="kpi-card" style={{ '--accent': '#f39c12' }}>
                    <div className="kpi-card__icon">📅</div>
                    <div className="kpi-card__body">
                        <span className="kpi-card__label">Nuevos Hoy</span>
                        {stats.loading
                            ? <span className="kpi-card__value is-loading">···</span>
                            : <span className="kpi-card__value">{stats.todayIncidents}</span>}
                        <span className="kpi-card__hint">Reportados hoy</span>
                    </div>
                </div>
            </section>

            {/* Accesos rápidos */}
            <h2 className="section-title">Accesos rápidos</h2>
            <section className="module-grid">
                {cards.map(card => (
                    <button
                        key={card.id}
                        className="module-card"
                        style={{ '--card-color': card.color }}
                        onClick={() => navigate(card.path)}
                    >
                        <div className="module-card__icon">{card.icon}</div>
                        <div className="module-card__text">
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                        </div>
                        <span className="module-card__cta">{card.buttonText} →</span>
                    </button>
                ))}
            </section>

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
                                    : 'No hay incidentes críticos activos en este momento.'}
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
                    <button className="action-btn emergency" onClick={() => navigate('/volunteer/create-sci')}>
                        🚨 Reportar Emergencia
                    </button>
                    <button className="action-btn primary" onClick={() => navigate('/volunteer/incidents')}>
                        📋 Ver Todos los Incidentes
                    </button>
                    <button className="action-btn secondary" onClick={() => navigate('/volunteer/resources')}>
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
                                                <span className="severity-badge" style={{ backgroundColor: getSeverityColor(assignment.severity_level) }}>
                                                    {assignment.severity_level.toUpperCase()}
                                                </span>
                                                <span className="status-badge" style={{ backgroundColor: getStatusColor(assignment.incident_status) }}>
                                                    {assignment.incident_status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="assignment-modal-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Mi Rol:</span>
                                                <span className="detail-value role">{assignment.assignment_type_name || getAssignmentTypeLabel(assignment.assignment_type)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Ubicación:</span>
                                                <span className="detail-value">{assignment.location}</span>
                                            </div>

                                            <div className="detail-row full-width">
                                                <span className="detail-label">Formularios Disponibles:</span>
                                                <div className="available-forms">
                                                    {getAvailableFormsForRole(assignment.assignment_type).map(form => (
                                                        <button key={form.id} className="form-button" onClick={() => handleOpenForm(assignment.incident_id, form)}>
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
                                                onClick={() => { handleCloseModal(); navigate('/volunteer/incidents'); }}
                                            >
                                                Ver en Lista de Incidentes
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-close-modal" onClick={handleCloseModal}>Cerrar</button>
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
        </AppLayout>
    );
};

export default VolunteerDashboard;
