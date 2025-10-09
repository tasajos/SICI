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

    // Datos del formulario
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        role: 'Voluntario',
        status: 'active'
    });

    // Simular carga de usuarios
    useEffect(() => {
        // En una aplicación real, esto sería una llamada a la API
        const mockUsers = [
            {
                id: 1,
                fullName: 'Juan Pérez',
                username: 'juan.perez',
                email: 'juan@email.com',
                role: 'Administrador',
                status: 'active',
                lastLogin: '2024-01-15 10:30:00',
                createdAt: '2024-01-01'
            },
            {
                id: 2,
                fullName: 'María García',
                username: 'maria.garcia',
                email: 'maria@email.com',
                role: 'Voluntario',
                status: 'active',
                lastLogin: '2024-01-14 15:45:00',
                createdAt: '2024-01-02'
            },
            {
                id: 3,
                fullName: 'Carlos López',
                username: 'carlos.lopez',
                email: 'carlos@email.com',
                role: 'Estado',
                status: 'inactive',
                lastLogin: '2024-01-10 09:20:00',
                createdAt: '2024-01-03'
            }
        ];
        
        setTimeout(() => {
            setUsers(mockUsers);
            setLoading(false);
        }, 1000);
    }, []);

    const roles = ['Administrador', 'Voluntario', 'Estado'];
    const statusOptions = [
        { value: 'active', label: 'Activo', color: '#27ae60' },
        { value: 'inactive', label: 'Inactivo', color: '#e74c3c' },
        { value: 'suspended', label: 'Suspendido', color: '#f39c12' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateUser = () => {
        setEditingUser(null);
        setFormData({
            fullName: '',
            username: '',
            email: '',
            password: '',
            role: 'Voluntario',
            status: 'active'
        });
        setShowModal(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setFormData({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            password: '', // No mostramos la contraseña por seguridad
            role: user.role,
            status: user.status
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingUser) {
            // Actualizar usuario existente
            setUsers(prev => prev.map(user => 
                user.id === editingUser.id 
                    ? { ...user, ...formData }
                    : user
            ));
        } else {
            // Crear nuevo usuario
            const newUser = {
                id: users.length + 1,
                ...formData,
                lastLogin: 'Nunca',
                createdAt: new Date().toISOString().split('T')[0]
            };
            setUsers(prev => [...prev, newUser]);
        }
        
        setShowModal(false);
        // Aquí iría la llamada a la API en una aplicación real
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            setUsers(prev => prev.filter(user => user.id !== userId));
        }
    };

    const handleToggleStatus = (userId) => {
        setUsers(prev => prev.map(user => 
            user.id === userId 
                ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
                : user
        ));
    };

    // Filtrar usuarios basado en la búsqueda
    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusInfo = (status) => {
        return statusOptions.find(opt => opt.value === status) || statusOptions[0];
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
                        <span className="stat-number">{users.filter(u => u.status === 'active').length}</span>
                        <span className="stat-label">Usuarios Activos</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{users.filter(u => u.role === 'Administrador').length}</span>
                        <span className="stat-label">Administradores</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-number">{users.filter(u => u.role === 'Voluntario').length}</span>
                        <span className="stat-label">Voluntarios</span>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Último Acceso</th>
                                <th>Fecha Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => {
                                const statusInfo = getStatusInfo(user.status);
                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    {user.fullName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="user-details">
                                                    <strong>{user.fullName}</strong>
                                                    <span>@{user.username}</span>
                                                    <span>{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span 
                                                className="status-badge"
                                                style={{ backgroundColor: statusInfo.color }}
                                            >
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td>{user.lastLogin}</td>
                                        <td>{user.createdAt}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn-toggle"
                                                    onClick={() => handleToggleStatus(user.id)}
                                                >
                                                    {user.status === 'active' ? '⏸️' : '▶️'}
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
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
                                            placeholder={editingUser ? "Dejar en blanco para no cambiar" : ""}
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
                                        <label>Estado *</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
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