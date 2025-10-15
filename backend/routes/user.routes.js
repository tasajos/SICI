const express = require('express');
const router = express.Router();
const pool = require('../config/db');


// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    try {
        const [users] = await pool.execute(`
            SELECT 
                u.*,
                r.name as role_name,
                ut.name as unit_name,
                ut_types.name as unit_type_name,  -- Nombre del tipo de unidad
                creator.username as created_by_username
            FROM users u
            JOIN roles r ON u.role_id = r.id
            LEFT JOIN units ut ON u.unit_id = ut.id
            LEFT JOIN unit_types ut_types ON ut.unit_type_id = ut_types.id  -- JOIN con unit_types
            LEFT JOIN users creator ON u.created_by = creator.id
            ORDER BY u.created_at DESC
        `);

        res.json({
            message: 'Usuarios obtenidos exitosamente',
            data: users
        });

    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/users/create - Crear nuevo usuario
router.post('/create', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const {
        fullName,
        username,
        email,
        phone,
        password,
        role,
        unitId, // NUEVO CAMPO
        isActive = true,
        notes
    } = req.body;

    // Validaciones
    if (!fullName || !username || !password || !role) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios: nombre completo, usuario, contraseña y rol.' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            message: 'La contraseña debe tener al menos 6 caracteres.' 
        });
    }

    try {
        // Verificar si el usuario ya existe
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ 
                message: 'El nombre de usuario o email ya está en uso.' 
            });
        }

        // Obtener el ID del rol
        const [roles] = await pool.execute(
            'SELECT id FROM roles WHERE name = ?',
            [role]
        );

        if (roles.length === 0) {
            return res.status(400).json({ 
                message: 'Rol no válido.' 
            });
        }

        const roleId = roles[0].id;

        // Verificar si la unidad existe (si se proporcionó)
        if (unitId) {
            const [units] = await pool.execute(
                'SELECT id FROM units WHERE id = ?',
                [unitId]
            );
            if (units.length === 0) {
                return res.status(400).json({ 
                    message: 'Unidad no válida.' 
                });
            }
        }

        // SIN HASH - Guardamos la contraseña en texto plano
        const passwordHash = password;

        // Insertar nuevo usuario
        const [result] = await pool.execute(
            `INSERT INTO users (
                username, password_hash, full_name, email, phone, 
                role_id, unit_id, is_active, created_by, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                username,
                passwordHash,
                fullName,
                email || null,
                phone || null,
                roleId,
                unitId || null, // NUEVO CAMPO
                isActive,
                req.session.user.id,
                notes || null
            ]
        );

        // Obtener el usuario creado con información completa
        const [newUsers] = await pool.execute(`
            SELECT 
        u.*,
        r.name as role_name,
        ut.name as unit_name,
        ut_types.name as unit_type_name,
        creator.username as created_by_username
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN units ut ON u.unit_id = ut.id
    LEFT JOIN unit_types ut_types ON ut.unit_type_id = ut_types.id
    LEFT JOIN users creator ON u.created_by = creator.id
    WHERE u.id = ?
`, [result.insertId]);

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            data: newUsers[0]
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor al crear el usuario.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


// GET /api/users/me - Obtener información del usuario actual
router.get('/me', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    try {
        const [users] = await pool.execute(`
            SELECT 
                u.*,
                r.name as role_name,
                ut.name as unit_name,
                ut_types.name as unit_type_name,
                creator.username as created_by_username
            FROM users u
            JOIN roles r ON u.role_id = r.id
            LEFT JOIN units ut ON u.unit_id = ut.id
            LEFT JOIN unit_types ut_types ON ut.unit_type_id = ut_types.id
            LEFT JOIN users creator ON u.created_by = creator.id
            WHERE u.id = ?
        `, [req.session.user.id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({
            message: 'Usuario obtenido exitosamente',
            data: users[0]
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


// PUT /api/users/:id - Actualizar usuario (SIN HASH)
router.put('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const userId = req.params.id;
    const {
        fullName,
        username,
        email,
        phone,
        password,
        role,
        unitId, // NUEVO CAMPO
        isActive,
        notes
    } = req.body;

    try {
        // Verificar si el usuario existe
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE id = ?',
            [userId]
        );

        if (existingUsers.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar si el username o email ya están en uso por otro usuario
        const [duplicateUsers] = await pool.execute(
            'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
            [username, email, userId]
        );

        if (duplicateUsers.length > 0) {
            return res.status(400).json({ 
                message: 'El nombre de usuario o email ya está en uso por otro usuario.' 
            });
        }

        // Obtener el ID del rol si se está actualizando
        let roleId = null;
        if (role) {
            const [roles] = await pool.execute(
                'SELECT id FROM roles WHERE name = ?',
                [role]
            );

            if (roles.length === 0) {
                return res.status(400).json({ 
                    message: 'Rol no válido.' 
                });
            }
            roleId = roles[0].id;
        }

        // Verificar si la unidad existe (si se proporcionó)
        if (unitId) {
            const [units] = await pool.execute(
                'SELECT id FROM units WHERE id = ?',
                [unitId]
            );
            if (units.length === 0) {
                return res.status(400).json({ 
                    message: 'Unidad no válida.' 
                });
            }
        }

        // Construir la consulta de actualización dinámicamente
        let updateFields = [];
        let updateValues = [];

        if (fullName) {
            updateFields.push('full_name = ?');
            updateValues.push(fullName);
        }
        if (username) {
            updateFields.push('username = ?');
            updateValues.push(username);
        }
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (phone !== undefined) {
            updateFields.push('phone = ?');
            updateValues.push(phone);
        }
        if (roleId) {
            updateFields.push('role_id = ?');
            updateValues.push(roleId);
        }
        if (unitId !== undefined) {
            updateFields.push('unit_id = ?');
            updateValues.push(unitId);
        }
        if (isActive !== undefined) {
            updateFields.push('is_active = ?');
            updateValues.push(isActive);
        }
        if (notes !== undefined) {
            updateFields.push('notes = ?');
            updateValues.push(notes);
        }

        // Si se proporciona una nueva contraseña, guardarla en texto plano
        if (password && password.length > 0) {
            if (password.length < 6) {
                return res.status(400).json({ 
                    message: 'La contraseña debe tener al menos 6 caracteres.' 
                });
            }
            updateFields.push('password_hash = ?');
            updateValues.push(password);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ 
                message: 'No hay campos para actualizar.' 
            });
        }

        updateValues.push(userId);

        const [result] = await pool.execute(
            `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            updateValues
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Obtener el usuario actualizado
        const [updatedUsers] = await pool.execute(`
            SELECT 
        u.*,
        r.name as role_name,
        ut.name as unit_name,
        ut_types.name as unit_type_name,
        creator.username as created_by_username
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN units ut ON u.unit_id = ut.id
    LEFT JOIN unit_types ut_types ON ut.unit_type_id = ut_types.id
    LEFT JOIN users creator ON u.created_by = creator.id
    WHERE u.id = ?
`, [userId]);

        res.json({
            message: 'Usuario actualizado exitosamente',
            data: updatedUsers[0]
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// PUT /api/users/:id/status - Cambiar estado del usuario
router.put('/:id/status', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const userId = req.params.id;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({ 
            message: 'El campo isActive debe ser un booleano.' 
        });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [isActive, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({
            message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
            data: { id: userId, isActive }
        });

    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/users/my-assignments
router.get('/my-assignments', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    try {
        const [assignments] = await pool.execute(`
            SELECT 
                ia.*,
                i.incident_name,
                i.incident_type,
                i.severity_level,
                i.location,
                i.description,
                i.status as incident_status,
                i.start_date,
                i.estimated_duration,
                i.resources_needed,
                i.emergency_contacts,
                u.full_name as user_name,
                u.unit_id,
                un.name as unit_name,
                creator.username as incident_creator,
                CASE 
                    WHEN ia.assignment_type = 'commander' THEN 'Comandante del Incidente'
                    WHEN ia.assignment_type = 'safety_officer' THEN 'Oficial de Seguridad'
                    WHEN ia.assignment_type = 'liaison_officer' THEN 'Oficial de Enlace'
                    WHEN ia.assignment_type = 'public_information_officer' THEN 'Oficial de Información Pública'
                    WHEN ia.assignment_type = 'operations_chief' THEN 'Jefe de Operaciones'
                    WHEN ia.assignment_type = 'planning_chief' THEN 'Jefe de Planificación'
                    WHEN ia.assignment_type = 'logistics_chief' THEN 'Jefe de Logística'
                    WHEN ia.assignment_type = 'finance_chief' THEN 'Jefe de Administración y Finanzas'  -- ✅ AGREGAR AQUÍ
                    ELSE ia.assignment_type
                END as assignment_type_name
            FROM incident_assignments ia
            JOIN incidents i ON ia.incident_id = i.id
            JOIN users u ON ia.user_id = u.id
            LEFT JOIN units un ON u.unit_id = un.id
            LEFT JOIN users creator ON i.created_by = creator.id
            WHERE ia.user_id = ? AND ia.status = 'active'
            ORDER BY ia.assignment_date DESC
        `, [req.session.user.id]);

        res.json({
            message: 'Asignaciones obtenidas exitosamente',
            data: assignments
        });

    } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


router.put('/:id/assignments/update', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const incidentId = req.params.id;
    const { assignments } = req.body;

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

        // Desactivar asignaciones existentes para este incidente
        await pool.execute(
            
            'UPDATE incident_assignments SET status = "canceled", updated_at = CURRENT_TIMESTAMP WHERE incident_id = ?',
            [incidentId]
        );

        // Crear nuevas asignaciones
        const newAssignments = assignments.map(assignment => [
            assignment.user_id,
            incidentId,
            assignment.assignment_type,
            'active'
        ]);

        if (newAssignments.length > 0) {
            const placeholders = newAssignments.map(() => '(?, ?, ?, ?)').join(', ');
            const values = newAssignments.flat();
            
            await pool.execute(
                `INSERT INTO incident_assignments 
                 (user_id, incident_id, assignment_type, status) 
                 VALUES ${placeholders}`,
                values
            );
        }

        res.json({
            message: `Asignaciones actualizadas exitosamente: ${newAssignments.length} asignaciones registradas`,
            data: {
                incidentId,
                assignmentsCount: newAssignments.length,
                assignments: assignments
            }
        });

    } catch (error) {
        console.error('Error al actualizar asignaciones:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


// DELETE /api/users/:id - Eliminar usuario (solo desactiva)
router.delete('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const userId = req.params.id;

    try {
        // En lugar de eliminar, desactivamos el usuario
        const [result] = await pool.execute(
            'UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.json({
            message: 'Usuario desactivado exitosamente',
            data: { id: userId, isActive: false }
        });

    } catch (error) {
        console.error('Error al desactivar usuario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;