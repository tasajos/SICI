import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const cards = [
        {
            id: 1,
            title: '📋 Listado de Comandos de Incidentes Actuales',
            description: 'Gestiona y monitorea todos los incidentes activos en el sistema',
            buttonText: 'Ver Incidentes',
            path: '/admin/incidents',
            color: '#e74c3c',
            icon: '🚨'
        },
        {
            id: 2,
            title: '🆕 Crear un SCI Nuevo',
            description: 'Inicia un nuevo Sistema de Comando de Incidentes',
            buttonText: 'Crear SCI',
            path: '/admin/create-sci',
            color: '#27ae60',
            icon: '➕'
        },
        {
            id: 3,
            title: '👥 Equipos y Unidades Disponibles',
            description: 'Administra recursos, equipos y personal disponible',
            buttonText: 'Gestionar Recursos',
            path: '/admin/resources',
            color: '#2980b9',
            icon: '🛠️'
        },
        {
            id: 4,
            title: '📊 Reportes y Estadísticas',
            description: 'Genera reportes y visualiza métricas del sistema',
            buttonText: 'Ver Reportes',
            path: '/admin/reports',
            color: '#8e44ad',
            icon: '📈'
        },
        {
            id: 5,
            title: '⚙️ Configuración del Sistema',
            description: 'Configura parámetros y preferencias del SICI',
            buttonText: 'Configurar',
            path: '/admin/settings',
            color: '#f39c12',
            icon: '⚙️'
        },
        {
            id: 6,
            title: '👤 Gestión de Usuarios',
            description: 'Administra usuarios, roles y permisos del sistema',
            buttonText: 'Gestionar Usuarios',
            path: '/admin/users',
            color: '#16a085',
            icon: '👥'
        }
    ];

    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <>
            <Navbar />
            <div className="admin-dashboard">
                <div className="dashboard-header">
                    <h1>Panel de Control - Administrador</h1>
                    <p>Gestiona todos los aspectos del Sistema de Comando de Incidentes</p>
                </div>
                
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

                {/* Estadísticas rápidas */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h4>Incidentes Activos</h4>
                        <span className="stat-number">3</span>
                    </div>
                    <div className="stat-card">
                        <h4>Equipos Disponibles</h4>
                        <span className="stat-number">12</span>
                    </div>
                    <div className="stat-card">
                        <h4>Usuarios Conectados</h4>
                        <span className="stat-number">8</span>
                    </div>
                    <div className="stat-card">
                        <h4>SCI Creados Hoy</h4>
                        <span className="stat-number">2</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;