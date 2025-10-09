import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './UserManagement.css';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    // Datos del formulario
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        role: 'Voluntario',
        isActive: true,
        notes: ''
    });

    // Cargar usuarios desde la API
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
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
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const roles = ['Administrador', 'Voluntario', 'Estado'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateUser = () => {
        setEditingUser(null);
        setFormData({
            fullName: '',
            username: '',
            email: '',
            phone: '',
            password: '',
            role: 'Voluntario',
            isActive: true,
            notes: ''
        });
        setShowModal(true);
        setError('');
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            fullName: user.full_name,
            username: user.username,
            email: user.email || '',
            phone: user.phone || '',
            password: '', // No mostramos la contraseña por seguridad
            role: user.role_name,
            isActive: user.is_active,
            notes: user.notes || ''
        });
        setShowModal(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const url = editingUser 
                ? `http://localhost:3310/api/users/${editingUser.id}`
                : 'http://localhost:3310/api/users/create';

            const method = editingUser ? 'PUT' : 'POST';

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
                throw new Error(result.message || 'Error al guardar usuario');
            }

            // Actualizar la lista de usuarios
            await fetchUsers();
            
            setShowModal(false);
            alert(editingUser ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
            
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
            try {
                const response = await fetch(`http://localhost:3310/api/users/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Error al desactivar usuario');
                }

                // Actualizar la lista de usuarios
                await fetchUsers();
                alert('Usuario desactivado exitosamente');
                
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:3310/api/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ isActive: !currentStatus })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al cambiar estado');
            }

            // Actualizar la lista de usuarios
            await fetchUsers();
            alert(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    // Filtrar usuarios basado en la búsqueda
    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.role_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'Nunca';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES');
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="user-management-container">
                    <div className="loading-spinner">Cargando usuarios...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="user-management-container">
                <div className="um-header">
                    <button className="back-button" onClick={() => navigate('/admin')}>
                        ← Volver al Dashboard
                    </button>
                    <h1>👤 Gestión de Usuarios</h1>
                    <p>Administra usuarios, roles y permisos del sistema</p>
                </div>

                {/* Barra de herramientas */}
                <div className="um-toolbar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    <button className="create-user-btn" onClick={handleCreateUser}>
                        ➕ Nuevo Usuario
                    </button>
                </div>

                {/* Estadísticas rápidas */}
                <div className="um-stats">
                    <div className="stat-card">
                        <span className="stat-number">{users.length}</span>
                        <span className="stat-label">Total Usuarios</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{users.filter(u => u.is_active).length}</span>
                        <span className="stat-label">Usuarios Activos</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{users.filter(u => u.role_name === 'Administrador').length}</span>
                        <span className="stat-label">Administradores</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{users.filter(u => u.role_name === 'Voluntario').length}</span>
                        <span className="stat-label">Voluntarios</span>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="users-table-container">
                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Teléfono</th>
                                <th>Último Acceso</th>
                                <th>Fecha Creación</th>
                                <th>Creado por</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {user.full_name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="user-details">
                                                <strong>{user.full_name}</strong>
                                                <span>@{user.username}</span>
                                                <span>{user.email || 'Sin email'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge role-${user.role_name.toLowerCase()}`}>
                                            {user.role_name}
                                        </span>
                                    </td>
                                    <td>
                                        <span 
                                            className="status-badge"
                                            style={{ 
                                                backgroundColor: user.is_active ? '#27ae60' : '#e74c3c'
                                            }}
                                        >
                                            {user.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>{user.phone || 'N/A'}</td>
                                    <td>{formatDate(user.last_login)}</td>
                                    <td>{formatDate(user.created_at)}</td>
                                    <td>{user.created_by_username || 'Sistema'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEditUser(user)}
                                                title="Editar usuario"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="btn-toggle"
                                                onClick={() => handleToggleStatus(user.id, user.is_active)}
                                                title={user.is_active ? 'Desactivar' : 'Activar'}
                                            >
                                                {user.is_active ? '⏸️' : '▶️'}
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleDeleteUser(user.id)}
                                                title="Desactivar usuario"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="no-users">
                            <p>No se encontraron usuarios que coincidan con la búsqueda.</p>
                        </div>
                    )}
                </div>

                {/* Modal para crear/editar usuario */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
                            
                            {error && (
                                <div className="modal-error">
                                    ❌ {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nombre Completo *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Nombre de Usuario *</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Contraseña {!editingUser && '*'}</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required={!editingUser}
                                            placeholder={editingUser ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Rol *</label>
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {roles.map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                            />
                                            Usuario Activo
                                        </label>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Notas</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="Notas adicionales sobre el usuario..."
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
                                        {editingUser ? 'Actualizar' : 'Crear'} Usuario
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

export default UserManagement;