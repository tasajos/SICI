require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const incidentRoutes = require('./routes/incident.routes');
const userRoutes = require('./routes/user.routes');
const unitRoutes = require('./routes/unit.routes');
const app = express();

// --- 1. Configuración de CORS (Debe ir primero para permitir la comunicación) ---
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

// --- 2. Parser para JSON (Necesario para leer req.body) ---
app.use(express.json());

// --- 3. Configuración de la Sesión (Crea la sesión en req.session) ---
app.use(session({
    secret: 'Bolivia2025@!', // Clave fuerte
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

// --- 4. Rutas (Ahora pueden acceder a req.session) ---
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/units', unitRoutes); // NUEVA RUTA

const PORT = process.env.PORT || 3310;

// Rutas públicas de prueba
app.get('/', (req, res) => {
    res.send('Backend SICI operativo.');
});

app.get('/testdb', async (req, res) => {
    // ... (Tu lógica de prueba de DB)
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en el puerto ${PORT}`);
});