const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Tabla para almacenar la configuración
const CREATE_CONFIG_TABLE = `
    CREATE TABLE IF NOT EXISTS system_configuration (
        id INT PRIMARY KEY AUTO_INCREMENT,
        config_key VARCHAR(100) NOT NULL UNIQUE,
        config_value JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

// Inicializar tabla
pool.execute(CREATE_CONFIG_TABLE).catch(console.error);

// GET /api/system/configuration - Obtener configuración del sistema
router.get('/configuration', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    try {
        const [config] = await pool.execute(
            'SELECT config_value FROM system_configuration WHERE config_key = ?',
            ['ics_forms']
        );

        if (config.length > 0) {
            res.json({
                message: 'Configuración obtenida exitosamente',
                data: { forms: config[0].config_value }
            });
        } else {
            // Configuración por defecto (todos los formularios deshabilitados)
            const defaultConfig = {
                form201: false,
                form202: false,
                form203: false,
                form204: false,
                form205: false,
                form206: false,
                form207: false,
                form208: false,
                form209: false,
                form211: false,
                form212: false,
                form213: false,
                form214: false,
                form215: false,
                form216: false,
                form217: false,
                form218: false,
                form219: false,
                form220: false,
                form221: false
            };

            res.json({
                message: 'Configuración por defecto',
                data: { forms: defaultConfig }
            });
        }

    } catch (error) {
        console.error('Error al obtener configuración:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/system/configuration - Guardar configuración del sistema
router.post('/configuration', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const { forms } = req.body;

    try {
        const [existing] = await pool.execute(
            'SELECT id FROM system_configuration WHERE config_key = ?',
            ['ics_forms']
        );

        if (existing.length > 0) {
            // Actualizar configuración existente
            await pool.execute(
                'UPDATE system_configuration SET config_value = ? WHERE config_key = ?',
                [JSON.stringify(forms), 'ics_forms']
            );
        } else {
            // Insertar nueva configuración
            await pool.execute(
                'INSERT INTO system_configuration (config_key, config_value) VALUES (?, ?)',
                ['ics_forms', JSON.stringify(forms)]
            );
        }

        res.json({
            message: 'Configuración guardada exitosamente',
            data: { forms }
        });

    } catch (error) {
        console.error('Error al guardar configuración:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;