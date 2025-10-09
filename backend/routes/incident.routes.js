const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/incidents/create - Crear nuevo SCI
router.post('/create', async (req, res) => {
    // Verificar si el usuario está autenticado
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado. Debe iniciar sesión.' });
    }

    const {
        incidentName,
        incidentType,
        severityLevel,
        location,
        description,
        commander,
        publicInformationOfficer,
        liaisonOfficer,
        safetyOfficer,
        startDate,
        estimatedDuration,
        resourcesNeeded,
        emergencyContacts
    } = req.body;

    // Validación básica de campos requeridos
    if (!incidentName || !incidentType || !severityLevel || !location || !description || !commander || !startDate) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios: nombre, tipo, severidad, ubicación, descripción, comandante y fecha de inicio.' 
        });
    }

    try {
        // Insertar el incidente en la base de datos
        const [result] = await pool.execute(
            `INSERT INTO incidents (
                incident_name, incident_type, severity_level, location, description,
                commander, public_information_officer, liaison_officer, safety_officer,
                start_date, estimated_duration, resources_needed, emergency_contacts, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                incidentName,
                incidentType,
                severityLevel,
                location,
                description,
                commander,
                publicInformationOfficer || null,
                liaisonOfficer || null,
                safetyOfficer || null,
                startDate,
                estimatedDuration || null,
                resourcesNeeded || null,
                emergencyContacts || null,
                req.session.user.id // ID del usuario que crea el incidente
            ]
        );

        // Respuesta exitosa
        res.status(201).json({
            message: 'SCI creado exitosamente',
            incidentId: result.insertId,
            data: {
                id: result.insertId,
                incidentName,
                incidentType,
                severityLevel,
                location,
                commander,
                startDate,
                status: 'activo'
            }
        });

    } catch (error) {
        console.error('Error al crear SCI:', error);
        
        // Manejar errores específicos de MySQL
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: 'Usuario creador no válido.' });
        }
        
        res.status(500).json({ 
            message: 'Error interno del servidor al crear el SCI.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/incidents - Obtener todos los incidentes
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    try {
        const [incidents] = await pool.execute(`
            SELECT 
                i.*,
                u.username as created_by_username
            FROM incidents i
            LEFT JOIN users u ON i.created_by = u.id
            ORDER BY i.created_at DESC
        `);

        res.json({
            message: 'Incidentes obtenidos exitosamente',
            data: incidents
        });

    } catch (error) {
        console.error('Error al obtener incidentes:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/incidents/:id - Obtener un incidente específico
router.get('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const incidentId = req.params.id;

    try {
        const [incidents] = await pool.execute(`
            SELECT 
                i.*,
                u.username as created_by_username
            FROM incidents i
            LEFT JOIN users u ON i.created_by = u.id
            WHERE i.id = ?
        `, [incidentId]);

        if (incidents.length === 0) {
            return res.status(404).json({ message: 'Incidente no encontrado.' });
        }

        res.json({
            message: 'Incidente obtenido exitosamente',
            data: incidents[0]
        });

    } catch (error) {
        console.error('Error al obtener incidente:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// PUT /api/incidents/:id/status - Actualizar estado del incidente
router.put('/:id/status', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const incidentId = req.params.id;
    const { status } = req.body;

    const allowedStatus = ['activo', 'cerrado', 'suspendido'];
    
    if (!status || !allowedStatus.includes(status)) {
        return res.status(400).json({ 
            message: 'Estado no válido. Use: activo, cerrado o suspendido.' 
        });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE incidents SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, incidentId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Incidente no encontrado.' });
        }

        res.json({
            message: `Estado del incidente actualizado a: ${status}`,
            data: { id: incidentId, status }
        });

    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;