import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; 
import LoginPage from './pages/LoginPage.jsx'; 
import AdminDashboard from './pages/AdminDashboard.jsx'; 
import CreateSCI from './pages/admin/CreateSCI.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import IncidentList from './pages/admin/IncidentList.jsx'; 
import EquipmentUnits from './pages/admin/EquipmentUnits.jsx'; 
import Reports from './pages/admin/Reports.jsx'; // NUEVO
//import SystemConfig from './pages/admin/SystemConfig.jsx'; 
import VolunteerDashboard from './pages/VolunteerDashboard.jsx'; 
import StatusDashboard from './pages/StatusDashboard.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
        <AuthProvider> 
            <Routes>
                <Route path="/" element={<LoginPage />} />

                {/* Rutas Protegidas */}
                <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
                    <Route path="/admin/*" element={<AdminDashboard />} /> 
                    <Route path="/admin/create-sci" element={<CreateSCI />} />
                     <Route path="/admin/users" element={<UserManagement />} />
                     <Route path="/admin/incidents" element={<IncidentList />} /> 
                    <Route path="/admin/resources" element={<EquipmentUnits />} /> 
                    <Route path="/admin/reports" element={<Reports />} /> {/* NUEVA *
                   {/*  <Route path="/admin/settings" element={<SystemConfig />} */}
                    
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['Voluntario']} />}>
                    <Route path="/volunteer" element={<VolunteerDashboard />} />
                </Route>
                
                <Route element={<ProtectedRoute allowedRoles={['Estado']} />}>
                    <Route path="/status" element={<StatusDashboard />} />
                </Route>
                
                {/* Opcional: Ruta para Acceso Denegado */}
                <Route path="/unauthorized" element={<h1 style={{textAlign: 'center', color: 'red'}}>403 ACCESO DENEGADO</h1>} />

                {/* Opcional: Manejo de ruta no encontrada 404 */}
                <Route path="*" element={<h1 style={{textAlign: 'center'}}>404 Página no encontrada</h1>} />

            </Routes>
        </AuthProvider>
    </Router>
  </React.StrictMode>
);