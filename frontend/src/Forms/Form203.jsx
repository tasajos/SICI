import React, { useState, useEffect } from 'react';

const Form203 = ({ fields, onChange, incidentId }) => {
    const [incidentData, setIncidentData] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    // Cargar datos del incidente y usuarios
    useEffect(() => {
        const loadData = async () => {
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

                // 2. Cargar lista de usuarios
                const usersResponse = await fetch('http://localhost:3310/api/users', {
                    credentials: 'include'
                });

                if (usersResponse.ok) {
                    const usersResult = await usersResponse.json();
                    // Filtrar solo usuarios activos
                    const activeUsers = usersResult.data.filter(user => user.is_active);
                    setUsers(activeUsers);
                }

                // 3. Cargar asignaciones del incidente para obtener IDs
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

                    // Procesar asignaciones para obtener IDs
                    for (const assignment of assignments) {
                        switch (assignment.assignment_type) {
                            case 'commander':
                                officerData.incident_commander = assignment.user_id;
                                break;
                            case 'safety_officer':
                                officerData.safety_officer = assignment.user_id;
                                break;
                            case 'liaison_officer':
                                officerData.liaison_officer = assignment.user_id;
                                break;
                            case 'public_information_officer':
                                officerData.public_information_officer = assignment.user_id;
                                break;
                            case 'operations_chief':
                                officerData.operations_chief = assignment.user_id;
                                break;
                            case 'planning_chief':
                                officerData.planning_chief = assignment.user_id;
                                break;
                            case 'logistics_chief':
                                officerData.logistics_chief = assignment.user_id;
                                break;
                            case 'finance_chief':
                                officerData.finance_chief = assignment.user_id;
                                break;
                        }
                    }
                } else {
                    // Fallback: usar IDs directamente desde la tabla incidents
                    officerData = await loadOfficersFromIncidentTable(incidentData);
                }

                // Actualizar automáticamente los campos SOLO si están vacíos
                Object.keys(officerData).forEach(field => {
                    if (officerData[field] && !fields[field]) {
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
                incident_commander: incidentData.commander || '',
                safety_officer: incidentData.safety_officer || '',
                liaison_officer: incidentData.liaison_officer || '',
                public_information_officer: incidentData.public_information_officer || '',
                operations_chief: '',
                planning_chief: '',
                logistics_chief: '',
                finance_chief: ''
            };

            return officerData;
        };

        loadData();
    }, [incidentId, onChange, initialLoadDone, fields]);

    // Función para manejar cambios manuales
    const handleFieldChange = (field, value) => {
        onChange(field, value);
    };

    // Función para obtener el nombre del usuario seleccionado
    const getSelectedUserName = (userId) => {
        if (!userId) return '';
        const user = users.find(u => u.id == userId);
        return user ? `${user.full_name} - ${user.role_name}${user.unit_name ? ` (${user.unit_name})` : ''}` : 'Usuario no encontrado';
    };

    // Función para renderizar selects de usuarios
    const renderUserSelect = (field, label, placeholder, required = false) => (
        <div className="form-group">
            <label>{label}:</label>
            <select
                value={fields[field] || ''}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className={fields[field] ? 'selected-field' : ''}
                required={required}
            >
                <option value="">{required ? 'Seleccionar...' : 'No asignado'}</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.full_name} - {user.role_name} {user.unit_name ? `(${user.unit_name})` : ''}
                    </option>
                ))}
            </select>
            {fields[field] && (
                <small className="field-note info">
                    Seleccionado: {getSelectedUserName(fields[field])}
                </small>
            )}
            <small className="field-note">Seleccione un usuario de la lista</small>
        </div>
    );

    if (loading) {
        return (
            <div className="form-loading">
                <div className="loading-spinner">🔄</div>
                <p>Cargando datos del incidente y usuarios...</p>
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
                
                {renderUserSelect('incident_commander', 'Comandante del Incidente', 'Comandante', true)}
                {renderUserSelect('safety_officer', 'Oficial de Seguridad', 'Oficial de Seguridad')}
                {renderUserSelect('liaison_officer', 'Oficial de Enlace', 'Oficial de Enlace')}
                {renderUserSelect('public_information_officer', 'Oficial de Información Pública', 'Oficial de Información Pública')}
            </div>

            <div className="form-section">
                <h3>Jefes de Sección</h3>
                
                {renderUserSelect('operations_chief', 'Jefe de Operaciones', 'Jefe de Operaciones')}
                {renderUserSelect('planning_chief', 'Jefe de Planificación', 'Jefe de Planificación')}
                {renderUserSelect('logistics_chief', 'Jefe de Logística', 'Jefe de Logística')}
                {renderUserSelect('finance_chief', 'Jefe de Finanzas/Administración', 'Jefe de Finanzas')}
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
                <h4>💡 Información sobre selección de personal</h4>
                <p>Seleccione los usuarios de la lista desplegable. Se muestran nombre, rol y unidad.</p>
                <p>Los <strong>IDs de usuario</strong> se registrarán automáticamente en las asignaciones del incidente.</p>
            </div>

            {/* Resumen de selecciones */}
            <div className="selection-summary">
                <h4>📋 Resumen de Selecciones</h4>
                <div className="summary-grid">
                    <div className="summary-item">
                        <strong>Comandante:</strong> {getSelectedUserName(fields.incident_commander) || 'No asignado'}
                    </div>
                    <div className="summary-item">
                        <strong>Oficial de Seguridad:</strong> {getSelectedUserName(fields.safety_officer) || 'No asignado'}
                    </div>
                    <div className="summary-item">
                        <strong>Oficial de Enlace:</strong> {getSelectedUserName(fields.liaison_officer) || 'No asignado'}
                    </div>
                    <div className="summary-item">
                        <strong>Oficial de Información:</strong> {getSelectedUserName(fields.public_information_officer) || 'No asignado'}
                    </div>
                    <div className="summary-item">
                        <strong>Jefe de Operaciones:</strong> {getSelectedUserName(fields.operations_chief) || 'No asignado'}
                    </div>
                    <div className="summary-item">
                        <strong>Jefe de Planificación:</strong> {getSelectedUserName(fields.planning_chief) || 'No asignado'}
                    </div>
                    <div className="summary-item">
                        <strong>Jefe de Logística:</strong> {getSelectedUserName(fields.logistics_chief) || 'No asignado'}
                    </div>
                    <div className="summary-item">
                        <strong>Jefe de Finanzas:</strong> {getSelectedUserName(fields.finance_chief) || 'No asignado'}
                    </div>
                </div>
            </div>

            {/* Estadísticas de usuarios disponibles */}
            <div className="users-stats">
                <h4>👥 Usuarios Disponibles</h4>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">{users.length}</span>
                        <span className="stat-label">Usuarios Activos</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {users.filter(u => u.role_name?.toLowerCase().includes('comandante')).length}
                        </span>
                        <span className="stat-label">Comandantes</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {users.filter(u => u.role_name?.toLowerCase().includes('jefe')).length}
                        </span>
                        <span className="stat-label">Jefes</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {users.filter(u => u.role_name?.toLowerCase().includes('oficial')).length}
                        </span>
                        <span className="stat-label">Oficiales</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form203;