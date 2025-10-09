import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Crear el Contexto
export const AuthContext = createContext();

// **IMPORTANTE: El puerto 3310 debe coincidir con el puerto de tu servidor Node.js**
axios.defaults.withCredentials = true; 
const API_URL = 'http://localhost:3310/api/auth';

// 2. Crear el Proveedor del Contexto (Wrapper)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Función para verificar la sesión al cargar la app (causa el 401 inicial)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Llama a la ruta /session del backend
                const response = await axios.get(`${API_URL}/session`); 
                setUser(response.data.user);
            } catch (error) {
                // Si el backend devuelve 401 (no hay sesión), user es null. Esto es correcto.
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Función de LOGIN para usar en LoginPage
    const login = async (username, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            const loggedInUser = response.data.user;
            
            setUser(loggedInUser);
            setIsLoading(false);
            return loggedInUser; // Devuelve el usuario para que LoginPage pueda redirigir
        } catch (error) {
            setUser(null);
            setIsLoading(false);
            throw error; // Propagar el error para mostrarlo en el login
        }
    };

    // Función de LOGOUT para usar en Navbar
    const logout = async () => {
        try {
            await axios.get(`${API_URL}/logout`);
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};