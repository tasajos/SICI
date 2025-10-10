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
                creator.username as created_by_username,
                -- Información del comandante
                cmd.id as commander_id,
                cmd.full_name as commander_name,
                cmd_role.name as commander_role,
                cmd_unit.name as commander_unit,
                -- Información del oficial de información pública
                pio.id as pio_id,
                pio.full_name as pio_name,
                pio_role.name as pio_role,
                pio_unit.name as pio_unit,
                -- Información del oficial de enlaces
                lio.id as lio_id,
                lio.full_name as lio_name,
                lio_role.name as lio_role,
                lio_unit.name as lio_unit,
                -- Información del oficial de seguridad
                so.id as so_id,
                so.full_name as so_name,
                so_role.name as so_role,
                so_unit.name as so_unit
            FROM incidents i
            LEFT JOIN users creator ON i.created_by = creator.id
            -- JOINs para el comandante
            LEFT JOIN users cmd ON i.commander = cmd.id
            LEFT JOIN roles cmd_role ON cmd.role_id = cmd_role.id
            LEFT JOIN units cmd_unit ON cmd.unit_id = cmd_unit.id
            -- JOINs para el oficial de información pública
            LEFT JOIN users pio ON i.public_information_officer = pio.id
            LEFT JOIN roles pio_role ON pio.role_id = pio_role.id
            LEFT JOIN units pio_unit ON pio.unit_id = pio_unit.id
            -- JOINs para el oficial de enlaces
            LEFT JOIN users lio ON i.liaison_officer = lio.id
            LEFT JOIN roles lio_role ON lio.role_id = lio_role.id
            LEFT JOIN units lio_unit ON lio.unit_id = lio_unit.id
            -- JOINs para el oficial de seguridad
            LEFT JOIN users so ON i.safety_officer = so.id
            LEFT JOIN roles so_role ON so.role_id = so_role.id
            LEFT JOIN units so_unit ON so.unit_id = so_unit.id
            ORDER BY i.created_at DESC
        `);

        // Transformar los datos para el frontend
        const transformedIncidents = incidents.map(incident => ({
            ...incident,
            // Información formateada del comandante
            commander_info: incident.commander_name ? {
                id: incident.commander_id,
                name: incident.commander_name,
                role: incident.commander_role,
                unit: incident.commander_unit
            } : null,
            commander_display: incident.commander_name ? 
                `${incident.commander_name} - ${incident.commander_role}${incident.commander_unit ? ` - ${incident.commander_unit}` : ''}` 
                : 'No asignado',
            
            // Información formateada del oficial de información pública
            pio_info: incident.pio_name ? {
                id: incident.pio_id,
                name: incident.pio_name,
                role: incident.pio_role,
                unit: incident.pio_unit
            } : null,
            pio_display: incident.pio_name ? 
                `${incident.pio_name} - ${incident.pio_role}${incident.pio_unit ? ` - ${incident.pio_unit}` : ''}` 
                : 'No asignado',
            
            // Información formateada del oficial de enlaces
            lio_info: incident.lio_name ? {
                id: incident.lio_id,
                name: incident.lio_name,
                role: incident.lio_role,
                unit: incident.lio_unit
            } : null,
            lio_display: incident.lio_name ? 
                `${incident.lio_name} - ${incident.lio_role}${incident.lio_unit ? ` - ${incident.lio_unit}` : ''}` 
                : 'No asignado',
            
            // Información formateada del oficial de seguridad
            so_info: incident.so_name ? {
                id: incident.so_id,
                name: incident.so_name,
                role: incident.so_role,
                unit: incident.so_unit
            } : null,
            so_display: incident.so_name ? 
                `${incident.so_name} - ${incident.so_role}${incident.so_unit ? ` - ${incident.so_unit}` : ''}` 
                : 'No asignado'
        }));

        res.json({
            message: 'Incidentes obtenidos exitosamente',
            data: transformedIncidents
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
                creator.username as created_by_username,
                -- Información del comandante
                cmd.id as commander_id,
                cmd.full_name as commander_name,
                cmd_role.name as commander_role,
                cmd_unit.name as commander_unit,
                -- Información del oficial de información pública
                pio.id as pio_id,
                pio.full_name as pio_name,
                pio_role.name as pio_role,
                pio_unit.name as pio_unit,
                -- Información del oficial de enlaces
                lio.id as lio_id,
                lio.full_name as lio_name,
                lio_role.name as lio_role,
                lio_unit.name as lio_unit,
                -- Información del oficial de seguridad
                so.id as so_id,
                so.full_name as so_name,
                so_role.name as so_role,
                so_unit.name as so_unit
            FROM incidents i
            LEFT JOIN users creator ON i.created_by = creator.id
            -- JOINs para el comandante
            LEFT JOIN users cmd ON i.commander = cmd.id
            LEFT JOIN roles cmd_role ON cmd.role_id = cmd_role.id
            LEFT JOIN units cmd_unit ON cmd.unit_id = cmd_unit.id
            -- JOINs para el oficial de información pública
            LEFT JOIN users pio ON i.public_information_officer = pio.id
            LEFT JOIN roles pio_role ON pio.role_id = pio_role.id
            LEFT JOIN units pio_unit ON pio.unit_id = pio_unit.id
            -- JOINs para el oficial de enlaces
            LEFT JOIN users lio ON i.liaison_officer = lio.id
            LEFT JOIN roles lio_role ON lio.role_id = lio_role.id
            LEFT JOIN units lio_unit ON lio.unit_id = lio_unit.id
            -- JOINs para el oficial de seguridad
            LEFT JOIN users so ON i.safety_officer = so.id
            LEFT JOIN roles so_role ON so.role_id = so_role.id
            LEFT JOIN units so_unit ON so.unit_id = so_unit.id
            WHERE i.id = ?
        `, [incidentId]);

        if (incidents.length === 0) {
            return res.status(404).json({ message: 'Incidente no encontrado.' });
        }

        const incident = incidents[0];

        // Transformar los datos
        const transformedIncident = {
            ...incident,
            commander_info: incident.commander_name ? {
                id: incident.commander_id,
                name: incident.commander_name,
                role: incident.commander_role,
                unit: incident.commander_unit
            } : null,
            pio_info: incident.pio_name ? {
                id: incident.pio_id,
                name: incident.pio_name,
                role: incident.pio_role,
                unit: incident.pio_unit
            } : null,
            lio_info: incident.lio_name ? {
                id: incident.lio_id,
                name: incident.lio_name,
                role: incident.lio_role,
                unit: incident.lio_unit
            } : null,
            so_info: incident.so_name ? {
                id: incident.so_id,
                name: incident.so_name,
                role: incident.so_role,
                unit: incident.so_unit
            } : null
        };

        res.json({
            message: 'Incidente obtenido exitosamente',
            data: transformedIncident
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