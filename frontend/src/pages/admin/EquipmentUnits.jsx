import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './EquipmentUnits.css';

const EquipmentUnits = () => {
    const navigate = useNavigate();
    const [units, setUnits] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('todos');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [error, setError] = useState('');

    // Datos del formulario
    const [formData, setFormData] = useState({
        name: '',
        unitTypeId: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        availableMembers: 0,
        availableVehicles: 0,
        availableEquipment: '',
        status: 'activo',
        latitude: '',
        longitude: '',
        notes: ''
    });

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [unitsResponse, typesResponse] = await Promise.all([
                fetch('http://localhost:3310/api/units', {
                    method: 'GET',
                    credentials: 'include'
                }),
                fetch('http://localhost:3310/api/units/types', {
                    method: 'GET',
                    credentials: 'include'
                })
            ]);

            const unitsResult = await unitsResponse.json();
            const typesResult = await typesResponse.json();

            if (!unitsResponse.ok) {
                throw new Error(unitsResult.message || 'Error al cargar unidades');
            }
            if (!typesResponse.ok) {
                throw new Error(typesResult.message || 'Error al cargar tipos de unidades');
            }

            setUnits(unitsResult.data || []);
            setUnitTypes(typesResult.data || []);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleCreateUnit = () => {
        setEditingUnit(null);
        setFormData({
            name: '',
            unitTypeId: '',
            contactPerson: '',
            phone: '',
            email: '',
            address: '',
            availableMembers: 0,
            availableVehicles: 0,
            availableEquipment: '',
            status: 'activo',
            latitude: '',
            longitude: '',
            notes: ''
        });
        setShowModal(true);
        setError('');
    };

    const handleEditUnit = (unit) => {
        setEditingUnit(unit);
        setFormData({
            name: unit.name,
            unitTypeId: unit.unit_type_id,
            contactPerson: unit.contact_person || '',
            phone: unit.phone || '',
            email: unit.email || '',
            address: unit.address || '',
            availableMembers: unit.available_members,
            availableVehicles: unit.available_vehicles,
            availableEquipment: unit.available_equipment || '',
            status: unit.status,
            latitude: unit.latitude || '',
            longitude: unit.longitude || '',
            notes: unit.notes || ''
        });
        setShowModal(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const url = editingUnit 
                ? `http://localhost:3310/api/units/${editingUnit.id}`
                : 'http://localhost:3310/api/units/create';

            const method = editingUnit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al guardar unidad');
            }

            // Actualizar la lista de unidades
            await fetchData();
            
            setShowModal(false);
            alert(editingUnit ? 'Unidad actualizada exitosamente' : 'Unidad creada exitosamente');
            
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const handleDeleteUnit = async (unitId) => {
        if (window.confirm('¿Estás seguro de que deseas desactivar esta unidad?')) {
            try {
                const response = await fetch(`http://localhost:3310/api/units/${unitId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Error al desactivar unidad');
                }

                // Actualizar la lista de unidades
                await fetchData();
                alert('Unidad desactivada exitosamente');
                
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const handleStatusChange = async (unitId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3310/api/units/${unitId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al cambiar estado');
            }

            // Actualizar la lista de unidades
            await fetchData();
            alert(`Estado actualizado a: ${newStatus}`);
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    // Filtrar unidades
    const filteredUnits = units.filter(unit => {
        const matchesSearch = 
            unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (unit.contact_person && unit.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (unit.phone && unit.phone.includes(searchTerm)) ||
            (unit.unit_type_name && unit.unit_type_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = typeFilter === 'todos' || 
            (typeFilter === 'emergencia' && unit.is_emergency_unit) ||
            (typeFilter === 'no_emergencia' && !unit.is_emergency_unit) ||
            (typeFilter === 'tipo_' + unit.unit_type_id);

        const matchesStatus = statusFilter === 'todos' || unit.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const statusConfig = {
            activo: { label: 'Disponible', color: '#27ae60', bgColor: '#d5f4e6' },
            inactivo: { label: 'Inactivo', color: '#e74c3c', bgColor: '#fadbd8' },
            en_mision: { label: 'En Misión', color: '#f39c12', bgColor: '#fdebd0' }
        };

        const config = statusConfig[status] || statusConfig.activo;

        return (
            <span 
                className="status-badge"
                style={{ 
                    backgroundColor: config.bgColor,
                    color: config.color,
                    border: `1px solid ${config.color}`
                }}
            >
                {config.label}
            </span>
        );
    };

    const getUnitTypeBadge = (isEmergencyUnit) => {
        return isEmergencyUnit ? (
            <span className="unit-type-badge emergency">🚨 Emergencia</span>
        ) : (
            <span className="unit-type-badge support">🤝 Apoyo</span>
        );
    };

    const formatText = (text) => {
        if (!text || text.trim() === '') return 'No especificado';
        return text;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="equipment-units-container">
                    <div className="loading-spinner">Cargando unidades...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="equipment-units-container">
                <div className="eu-header">
                    <button className="back-button" onClick={() => navigate('/admin')}>
                        ← Volver al Dashboard
                    </button>
                    <h1>🛠️ Equipos y Unidades Disponibles</h1>
                    <p>Gestiona equipos de primera respuesta, medios disponibles e instituciones de apoyo</p>
                </div>

                {/* Barra de herramientas */}
                <div className="eu-toolbar">
                    <div className="search-filter-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Buscar unidades..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon">🔍</span>
                        </div>

                        <div className="filter-group">
                            <label>Tipo:</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="todos">Todos los tipos</option>
                                <option value="emergencia">Solo emergencia</option>
                                <option value="no_emergencia">Solo apoyo</option>
                                {unitTypes.map(type => (
                                    <option key={type.id} value={`tipo_${type.id}`}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Estado:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="activo">Disponible</option>
                                <option value="en_mision">En Misión</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            className="refresh-btn"
                            onClick={fetchData}
                        >
                            🔄 Actualizar
                        </button>
                        <button className="create-unit-btn" onClick={handleCreateUnit}>
                            ➕ Nueva Unidad
                        </button>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="eu-stats">
                    <div className="stat-card">
                        <span className="stat-number">{units.length}</span>
                        <span className="stat-label">Total Unidades</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{units.filter(u => u.is_emergency_unit).length}</span>
                        <span className="stat-label">Emergencia</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{units.filter(u => u.status === 'activo').length}</span>
                        <span className="stat-label">Disponibles</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{units.filter(u => u.status === 'en_mision').length}</span>
                        <span className="stat-label">En Misión</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {units.reduce((sum, unit) => sum + unit.available_members, 0)}
                        </span>
                        <span className="stat-label">Personal Total</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">
                            {units.reduce((sum, unit) => sum + unit.available_vehicles, 0)}
                        </span>
                        <span className="stat-label">Vehículos Total</span>
                    </div>
                </div>

                {/* Tabla de unidades */}
                <div className="units-table-container">
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    {filteredUnits.length === 0 ? (
                        <div className="no-units">
                            <p>No se encontraron unidades que coincidan con los filtros.</p>
                            <button 
                                className="create-first-btn"
                                onClick={handleCreateUnit}
                            >
                                Crear Primera Unidad
                            </button>
                        </div>
                    ) : (
                        <table className="units-table">
                            <thead>
                                <tr>
                                    <th>Unidad</th>
                                    <th>Tipo</th>
                                    <th>Contacto</th>
                                    <th>Personal</th>
                                    <th>Vehículos</th>
                                    <th>Estado</th>
                                    <th>Ubicación</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUnits.map(unit => (
                                    <tr key={unit.id} className="unit-row">
                                        <td>
                                            <div className="unit-info">
                                                <div className="unit-avatar">
                                                    {unit.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </div>
                                                <div className="unit-details">
                                                    <strong>{unit.name}</strong>
                                                    <span>{unit.unit_type_name}</span>
                                                    <span className="unit-meta">
                                                        Creado por: {unit.created_by_username || 'Sistema'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {getUnitTypeBadge(unit.is_emergency_unit)}
                                        </td>
                                        <td>
                                            <div className="contact-info">
                                                <strong>{formatText(unit.contact_person)}</strong>
                                                <span>{formatText(unit.phone)}</span>
                                                <span>{formatText(unit.email)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="resource-count">
                                                <span className="resource-number">{unit.available_members}</span>
                                                <span className="resource-label">personal</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="resource-count">
                                                <span className="resource-number">{unit.available_vehicles}</span>
                                                <span className="resource-label">vehículos</span>
                                            </div>
                                        </td>
                                        <td>
                                            {getStatusBadge(unit.status)}
                                        </td>
                                        <td>
                                            <div className="location-info">
                                                {unit.address ? (
                                                    <span title={unit.address}>
                                                        {unit.address.length > 30 
                                                            ? unit.address.substring(0, 30) + '...' 
                                                            : unit.address
                                                        }
                                                    </span>
                                                ) : (
                                                    <span className="no-location">Sin ubicación</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons-cell">
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleEditUnit(unit)}
                                                    title="Editar unidad"
                                                >
                                                    ✏️
                                                </button>
                                                <select
                                                    value={unit.status}
                                                    onChange={(e) => handleStatusChange(unit.id, e.target.value)}
                                                    className="status-select"
                                                    title="Cambiar estado"
                                                >
                                                    <option value="activo">Disponible</option>
                                                    <option value="en_mision">En Misión</option>
                                                    <option value="inactivo">Inactivo</option>
                                                </select>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteUnit(unit.id)}
                                                    title="Desactivar unidad"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Información de resumen */}
                <div className="summary-info">
                    <p>
                        Mostrando <strong>{filteredUnits.length}</strong> de <strong>{units.length}</strong> unidades
                        {typeFilter !== 'todos' && ` • Filtrado por tipo`}
                        {statusFilter !== 'todos' && ` • Filtrado por estado`}
                    </p>
                </div>

                {/* Modal para crear/editar unidad */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content large-modal">
                            <h2>{editingUnit ? 'Editar Unidad' : 'Crear Nueva Unidad'}</h2>
                            
                            {error && (
                                <div className="modal-error">
                                    ❌ {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre de la Unidad *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Ej: Bomberos Central, Cruz Roja Zona Norte"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Tipo de Unidad *</label>
                                        <select
                                            name="unitTypeId"
                                            value={formData.unitTypeId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Seleccione un tipo</option>
                                            {unitTypes.map(type => (
                                                <option key={type.id} value={type.id}>
                                                    {type.name} {type.is_emergency_unit ? '🚨' : '🤝'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Persona de Contacto</label>
                                        <input
                                            type="text"
                                            name="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={handleInputChange}
                                            placeholder="Nombre del contacto principal"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Número de contacto"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="email@ejemplo.com"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Dirección</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Dirección completa de la unidad"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Personal Disponible</label>
                                        <input
                                            type="number"
                                            name="availableMembers"
                                            value={formData.availableMembers}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Vehículos Disponibles</label>
                                        <input
                                            type="number"
                                            name="availableVehicles"
                                            value={formData.availableVehicles}
                                            onChange={handleInputChange}
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Equipamiento Disponible</label>
                                        <textarea
                                            name="availableEquipment"
                                            value={formData.availableEquipment}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Lista de equipamiento especial disponible..."
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                        >
                                            <option value="activo">Disponible</option>
                                            <option value="en_mision">En Misión</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Latitud</label>
                                        <input
                                            type="text"
                                            name="latitude"
                                            value={formData.latitude}
                                            onChange={handleInputChange}
                                            placeholder="Ej: -16.5000"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Longitud</label>
                                        <input
                                            type="text"
                                            name="longitude"
                                            value={formData.longitude}
                                            onChange={handleInputChange}
                                            placeholder="Ej: -68.1500"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Notas Adicionales</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Información adicional sobre la unidad..."
                                        />
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="btn-cancel"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-save">
                                        {editingUnit ? 'Actualizar' : 'Crear'} Unidad
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default EquipmentUnits;