const express = require('express');
const router = express.Router();
// NOTA: Se elimina la importación de bcryptjs a solicitud del usuario
const pool = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Se requiere nombre de usuario y contraseña.' });
    }

    try {
        // 1. Buscar el usuario
        // Seleccionamos directamente el hash (que ahora es el texto plano)
        const [rows] = await pool.query(
            `SELECT u.id, u.username, u.password_hash, u.full_name, r.name AS role_name
             FROM users u
             JOIN roles r ON u.role_id = r.id
             WHERE u.username = ?`,
            [username]
        );

        const user = rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 2. Comparar la contraseña (SIN HASHING - Comparación de texto plano)
        const passwordMatch = (password === user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // 3. Crear Sesión y Restringir Contenido
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role_name, // 'Administrador', 'Voluntario', 'Estado'
        };

        // 4. Respuesta exitosa
        return res.json({
            message: 'Inicio de sesión exitoso',
            user: {
                id: user.id,
                username: user.username,
                role: user.role_name,
                fullName: user.full_name,
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

// GET /api/auth/logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'No se pudo cerrar la sesión.' });
        }
        res.clearCookie('connect.sid'); // Limpia la cookie de sesión
        res.json({ message: 'Sesión cerrada exitosamente.' });
    });
});

// GET /api/auth/session
router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ user: null, message: 'No hay sesión activa' });
    }
});

module.exports = router;