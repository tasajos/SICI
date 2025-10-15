const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/incidents/create - Crear nuevo SCI
router.post('/create', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
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

    // Validaciones
    if (!incidentName || !incidentType || !severityLevel || !location || !description || !commander) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios.' 
        });
    }

    try {
        // Insertar el incidente
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
                req.session.user.id
            ]
        );

        const incidentId = result.insertId;

        // Registrar las asignaciones en incident_assignments
        const assignments = [];

        // Comandante (obligatorio)
        if (commander) {
            assignments.push([
                commander, 
                incidentId, 
                'commander', 
                'active'
            ]);
        }

        // Oficial de Información Pública (opcional)
        if (publicInformationOfficer && publicInformationOfficer !== '') {
            assignments.push([
                publicInformationOfficer, 
                incidentId, 
                'public_information_officer', 
                'active'
            ]);
        }

        // Oficial de Enlaces (opcional)
        if (liaisonOfficer && liaisonOfficer !== '') {
            assignments.push([
                liaisonOfficer, 
                incidentId, 
                'liaison_officer', 
                'active'
            ]);
        }

        // Oficial de Seguridad (opcional)
        if (safetyOfficer && safetyOfficer !== '') {
            assignments.push([
                safetyOfficer, 
                incidentId, 
                'safety_officer', 
                'active'
            ]);
        }

        // Insertar todas las asignaciones si hay alguna
        if (assignments.length > 0) {
            // Construir la consulta dinámicamente para múltiples valores
            const placeholders = assignments.map(() => '(?, ?, ?, ?)').join(', ');
            const values = assignments.flat(); // Aplanar el array de arrays
            
            await pool.execute(
                `INSERT INTO incident_assignments 
                 (user_id, incident_id, assignment_type, status) 
                 VALUES ${placeholders}`,
                values
            );

            console.log(`✅ Se registraron ${assignments.length} asignaciones para el incidente ${incidentId}`);
        }

        // Obtener el incidente creado con información completa
        const [newIncidents] = await pool.execute(`
            SELECT 
                i.*,
                creator.username as created_by_username,
                cmd.full_name as commander_name,
                cmd_role.name as commander_role,
                cmd_unit.name as commander_unit
            FROM incidents i
            LEFT JOIN users creator ON i.created_by = creator.id
            LEFT JOIN users cmd ON i.commander = cmd.id
            LEFT JOIN roles cmd_role ON cmd.role_id = cmd_role.id
            LEFT JOIN units cmd_unit ON cmd.unit_id = cmd_unit.id
            WHERE i.id = ?
        `, [incidentId]);

        res.status(201).json({
            message: 'Incidente creado exitosamente y asignaciones registradas',
            incidentId: incidentId,
            data: newIncidents[0],
            assignmentsCount: assignments.length
        });

    } catch (error) {
        console.error('Error al crear incidente:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/:id/assignments', async (req, res) => {
    try {
        const [assignments] = await pool.execute(`
            SELECT 
                ia.*,
                i.incident_name,
                u.full_name,
                u.username,
                CASE 
                    WHEN ia.assignment_type = 'commander' THEN 'Comandante del Incidente'
                    WHEN ia.assignment_type = 'safety_officer' THEN 'Oficial de Seguridad'
                    WHEN ia.assignment_type = 'liaison_officer' THEN 'Oficial de Enlace'
                    WHEN ia.assignment_type = 'public_information_officer' THEN 'Oficial de Información Pública'
                    WHEN ia.assignment_type = 'operations_chief' THEN 'Jefe de Operaciones'
                    WHEN ia.assignment_type = 'planning_chief' THEN 'Jefe de Planificación'
                    WHEN ia.assignment_type = 'logistics_chief' THEN 'Jefe de Logística'
                    WHEN ia.assignment_type = 'finance_chief' THEN 'Jefe de Administración y Finanzas'  -- ✅ CORREGIDO
                    ELSE ia.assignment_type
                END as assignment_type_name
            FROM incident_assignments ia
            JOIN incidents i ON ia.incident_id = i.id
            JOIN users u ON ia.user_id = u.id
            WHERE ia.incident_id = ?
            ORDER BY ia.assignment_date DESC
        `, [req.params.id]);

        res.json({
            message: 'Asignaciones obtenidas exitosamente',
            data: assignments
        });
    } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message
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


router.get('/:id/details', async (req, res) => {
    try {
        const incidentId = req.params.id;
        
        const [incidents] = await pool.execute(`
            SELECT 
                i.*,
                commander_user.full_name as commander_name,
                safety_user.full_name as safety_officer_name,
                liaison_user.full_name as liaison_officer_name,
                pio_user.full_name as public_information_officer_name
            FROM incidents i
            LEFT JOIN users commander_user ON i.commander = commander_user.id
            LEFT JOIN users safety_user ON i.safety_officer = safety_user.id
            LEFT JOIN users liaison_user ON i.liaison_officer = liaison_user.id
            LEFT JOIN users pio_user ON i.public_information_officer = pio_user.id
            WHERE i.id = ?
        `, [incidentId]);

        if (incidents.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Incidente no encontrado'
            });
        }

        res.json({
            success: true,
            data: incidents[0]
        });

    } catch (error) {
        console.error('Error al obtener detalles del incidente:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
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

// PUT /api/incidents/:id - Actualizar incidente y sus asignaciones
router.put('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const incidentId = req.params.id;
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
        emergencyContacts,
        status
    } = req.body;

    try {
        // Verificar si el incidente existe
        const [existingIncidents] = await pool.execute(
            'SELECT id FROM incidents WHERE id = ?',
            [incidentId]
        );

        if (existingIncidents.length === 0) {
            return res.status(404).json({ message: 'Incidente no encontrado.' });
        }

        // Construir la consulta de actualización dinámicamente
        let updateFields = [];
        let updateValues = [];

        if (incidentName) {
            updateFields.push('incident_name = ?');
            updateValues.push(incidentName);
        }
        if (incidentType) {
            updateFields.push('incident_type = ?');
            updateValues.push(incidentType);
        }
        if (severityLevel) {
            updateFields.push('severity_level = ?');
            updateValues.push(severityLevel);
        }
        if (location) {
            updateFields.push('location = ?');
            updateValues.push(location);
        }
        if (description) {
            updateFields.push('description = ?');
            updateValues.push(description);
        }
        if (commander) {
            updateFields.push('commander = ?');
            updateValues.push(commander);
        }
        if (publicInformationOfficer !== undefined) {
            updateFields.push('public_information_officer = ?');
            updateValues.push(publicInformationOfficer);
        }
        if (liaisonOfficer !== undefined) {
            updateFields.push('liaison_officer = ?');
            updateValues.push(liaisonOfficer);
        }
        if (safetyOfficer !== undefined) {
            updateFields.push('safety_officer = ?');
            updateValues.push(safetyOfficer);
        }
        if (startDate) {
            updateFields.push('start_date = ?');
            updateValues.push(startDate);
        }
        if (estimatedDuration !== undefined) {
            updateFields.push('estimated_duration = ?');
            updateValues.push(estimatedDuration);
        }
        if (resourcesNeeded !== undefined) {
            updateFields.push('resources_needed = ?');
            updateValues.push(resourcesNeeded);
        }
        if (emergencyContacts !== undefined) {
            updateFields.push('emergency_contacts = ?');
            updateValues.push(emergencyContacts);
        }
        if (status) {
            updateFields.push('status = ?');
            updateValues.push(status);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ 
                message: 'No hay campos para actualizar.' 
            });
        }

        updateValues.push(incidentId);

        // Actualizar el incidente
        const [result] = await pool.execute(
            `UPDATE incidents SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Incidente no encontrado.' });
        }

        // Actualizar asignaciones si se cambiaron los roles
        if (commander || publicInformationOfficer !== undefined || liaisonOfficer !== undefined || safetyOfficer !== undefined) {
            await updateIncidentAssignments(incidentId, {
                commander,
                publicInformationOfficer,
                liaisonOfficer,
                safetyOfficer
            });
        }

        // Obtener el incidente actualizado
        const [updatedIncidents] = await pool.execute(`
            SELECT 
                i.*,
                creator.username as created_by_username,
                cmd.full_name as commander_name,
                cmd_role.name as commander_role,
                cmd_unit.name as commander_unit
            FROM incidents i
            LEFT JOIN users creator ON i.created_by = creator.id
            LEFT JOIN users cmd ON i.commander = cmd.id
            LEFT JOIN roles cmd_role ON cmd.role_id = cmd_role.id
            LEFT JOIN units cmd_unit ON cmd.unit_id = cmd_unit.id
            WHERE i.id = ?
        `, [incidentId]);

        res.json({
            message: 'Incidente actualizado exitosamente',
            data: updatedIncidents[0]
        });

    } catch (error) {
        console.error('Error al actualizar incidente:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Función auxiliar para actualizar asignaciones
async function updateIncidentAssignments(incidentId, roles) {
    try {
        // Primero, desactivar todas las asignaciones existentes para este incidente
        await pool.execute(
            'UPDATE incident_assignments SET status = "canceled", updated_at = CURRENT_TIMESTAMP WHERE incident_id = ?',
            [incidentId]
        );

        // Luego, crear nuevas asignaciones activas
        const newAssignments = [];

        if (roles.commander) {
            newAssignments.push([roles.commander, incidentId, 'commander', 'active']);
        }
        if (roles.publicInformationOfficer && roles.publicInformationOfficer !== '') {
            newAssignments.push([roles.publicInformationOfficer, incidentId, 'public_information_officer', 'active']);
        }
        if (roles.liaisonOfficer && roles.liaisonOfficer !== '') {
            newAssignments.push([roles.liaisonOfficer, incidentId, 'liaison_officer', 'active']);
        }
        if (roles.safetyOfficer && roles.safetyOfficer !== '') {
            newAssignments.push([roles.safetyOfficer, incidentId, 'safety_officer', 'active']);
        }

        if (newAssignments.length > 0) {
            // Construir la consulta dinámicamente para múltiples valores
            const placeholders = newAssignments.map(() => '(?, ?, ?, ?)').join(', ');
            const values = newAssignments.flat();
            
            await pool.execute(
                `INSERT INTO incident_assignments 
                 (user_id, incident_id, assignment_type, status) 
                 VALUES ${placeholders}`,
                values
            );
        }

        console.log(`✅ Asignaciones actualizadas para incidente ${incidentId}: ${newAssignments.length} nuevas asignaciones`);
    } catch (error) {
        console.error('Error al actualizar asignaciones:', error);
        throw error;
    }
}


// PUT /api/incidents/:id/assignment-status - Cambiar estado de asignación
router.put('/:id/assignment-status', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const incidentId = req.params.id;
    const { userId, assignmentType, status } = req.body;

    if (!userId || !assignmentType || !status) {
        return res.status(400).json({ 
            message: 'Faltan campos: userId, assignmentType, status.' 
        });
    }

    if (!['active', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ 
            message: 'Estado no válido. Use: active, completed, cancelled.' 
        });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE incident_assignments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE incident_id = ? AND user_id = ? AND assignment_type = ?',
            [status, incidentId, userId, assignmentType]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: 'Asignación no encontrada.' 
            });
        }

        res.json({
            message: `Estado de asignación actualizado a: ${status}`,
            data: { incidentId, userId, assignmentType, status }
        });

    } catch (error) {
        console.error('Error al actualizar estado de asignación:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


// PUT /api/incidents/:id/assignments/update - Actualizar asignaciones de incidente
router.put('/:id/assignments/update', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const incidentId = req.params.id;
    const { assignments } = req.body;

    console.log('📥 SOLICITUD DE ASIGNACIONES RECIBIDA:', {
        incidentId,
        assignments: assignments
    });

    if (!assignments || !Array.isArray(assignments)) {
        return res.status(400).json({ 
            message: 'Se requiere un array de asignaciones.' 
        });
    }

    try {
        // Verificar si el incidente existe
        const [existingIncidents] = await pool.execute(
            'SELECT id FROM incidents WHERE id = ?',
            [incidentId]
        );

        if (existingIncidents.length === 0) {
            return res.status(404).json({ message: 'Incidente no encontrado.' });
        }

        console.log(`🔄 Procesando ${assignments.length} asignaciones para incidente ${incidentId}`);

        // ✅ CORREGIDO: usar "canceled" en lugar de "cancelled"
        const [cancelResult] = await pool.execute(
            'UPDATE incident_assignments SET status = "canceled", updated_at = CURRENT_TIMESTAMP WHERE incident_id = ?',
            [incidentId]
        );
        
        console.log(`✅ Asignaciones canceladas: ${cancelResult.affectedRows}`);

        // Crear nuevas asignaciones
        const newAssignments = assignments.map(assignment => [
            assignment.user_id,
            incidentId,
            assignment.assignment_type,
            'active'  // ✅ Este está correcto
        ]);

        console.log('📋 Nuevas asignaciones a insertar:', newAssignments);

        if (newAssignments.length > 0) {
            const placeholders = newAssignments.map(() => '(?, ?, ?, ?)').join(', ');
            const values = newAssignments.flat();
            
            console.log('🚀 Ejecutando INSERT con valores:', values);
            
            const [insertResult] = await pool.execute(
                `INSERT INTO incident_assignments 
                 (user_id, incident_id, assignment_type, status) 
                 VALUES ${placeholders}`,
                values
            );
            
            console.log(`✅ Asignaciones insertadas: ${insertResult.affectedRows}`);
        }

        // ✅ CORREGIDO: Verificar con el status correcto
        const [verifyAssignments] = await pool.execute(
            'SELECT * FROM incident_assignments WHERE incident_id = ? AND status = "active"',
            [incidentId]
        );

        console.log(`🔍 Asignaciones activas verificadas: ${verifyAssignments.length}`);
        console.log('📊 Detalles de asignaciones activas:', verifyAssignments);

        res.json({
            message: `Asignaciones actualizadas exitosamente: ${newAssignments.length} asignaciones registradas`,
            data: {
                incidentId,
                assignmentsCount: newAssignments.length,
                assignments: assignments,
                verified: verifyAssignments.length,
                verifiedDetails: verifyAssignments
            }
        });

    } catch (error) {
        console.error('❌ Error al actualizar asignaciones:', error);
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