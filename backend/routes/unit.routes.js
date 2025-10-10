const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET /api/units/types - Obtener tipos de unidades
router.get('/types', async (req, res) => {
    try {
        const [types] = await pool.execute(`
            SELECT * FROM unit_types 
            ORDER BY is_emergency_unit DESC, name ASC
        `);

        res.json({
            message: 'Tipos de unidades obtenidos exitosamente',
            data: types
        });

    } catch (error) {
        console.error('Error al obtener tipos de unidades:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/units - Obtener todas las unidades
router.get('/', async (req, res) => {
    try {
        const [units] = await pool.execute(`
            SELECT 
                u.*,
                ut.name as unit_type_name,
                ut.is_emergency_unit,
                creator.username as created_by_username
            FROM units u
            JOIN unit_types ut ON u.unit_type_id = ut.id
            LEFT JOIN users creator ON u.created_by = creator.id
            ORDER BY ut.is_emergency_unit DESC, u.name ASC
        `);

        res.json({
            message: 'Unidades obtenidas exitosamente',
            data: units
        });

    } catch (error) {
        console.error('Error al obtener unidades:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/units/create - Crear nueva unidad
router.post('/create', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const {
        name,
        unitTypeId,
        contactPerson,
        phone,
        email,
        address,
        availableMembers,
        availableVehicles,
        availableEquipment,
        status,
        latitude,
        longitude,
        notes
    } = req.body;

    if (!name || !unitTypeId) {
        return res.status(400).json({ 
            message: 'Faltan campos obligatorios: nombre y tipo de unidad.' 
        });
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO units (
                name, unit_type_id, contact_person, phone, email, address,
                available_members, available_vehicles, available_equipment,
                status, latitude, longitude, notes, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                unitTypeId,
                contactPerson || null,
                phone || null,
                email || null,
                address || null,
                availableMembers || 0,
                availableVehicles || 0,
                availableEquipment || null,
                status || 'activo',
                latitude || null,
                longitude || null,
                notes || null,
                req.session.user.id
            ]
        );

        // Obtener la unidad creada con información completa
        const [newUnits] = await pool.execute(`
            SELECT 
                u.*,
                ut.name as unit_type_name,
                ut.is_emergency_unit,
                creator.username as created_by_username
            FROM units u
            JOIN unit_types ut ON u.unit_type_id = ut.id
            LEFT JOIN users creator ON u.created_by = creator.id
            WHERE u.id = ?
        `, [result.insertId]);

        res.status(201).json({
            message: 'Unidad creada exitosamente',
            data: newUnits[0]
        });

    } catch (error) {
        console.error('Error al crear unidad:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor al crear la unidad.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// PUT /api/units/:id - Actualizar unidad
router.put('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const unitId = req.params.id;
    const {
        name,
        unitTypeId,
        contactPerson,
        phone,
        email,
        address,
        availableMembers,
        availableVehicles,
        availableEquipment,
        status,
        latitude,
        longitude,
        notes
    } = req.body;

    try {
        const [result] = await pool.execute(
            `UPDATE units SET 
                name = ?, unit_type_id = ?, contact_person = ?, phone = ?, email = ?, 
                address = ?, available_members = ?, available_vehicles = ?, 
                available_equipment = ?, status = ?, latitude = ?, longitude = ?, 
                notes = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`,
            [
                name,
                unitTypeId,
                contactPerson,
                phone,
                email,
                address,
                availableMembers,
                availableVehicles,
                availableEquipment,
                status,
                latitude,
                longitude,
                notes,
                unitId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Unidad no encontrada.' });
        }

        // Obtener la unidad actualizada
        const [updatedUnits] = await pool.execute(`
            SELECT 
                u.*,
                ut.name as unit_type_name,
                ut.is_emergency_unit,
                creator.username as created_by_username
            FROM units u
            JOIN unit_types ut ON u.unit_type_id = ut.id
            LEFT JOIN users creator ON u.created_by = creator.id
            WHERE u.id = ?
        `, [unitId]);

        res.json({
            message: 'Unidad actualizada exitosamente',
            data: updatedUnits[0]
        });

    } catch (error) {
        console.error('Error al actualizar unidad:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// PUT /api/units/:id/status - Cambiar estado de la unidad
router.put('/:id/status', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const unitId = req.params.id;
    const { status } = req.body;

    const allowedStatus = ['activo', 'inactivo', 'en_mision'];
    
    if (!status || !allowedStatus.includes(status)) {
        return res.status(400).json({ 
            message: 'Estado no válido. Use: activo, inactivo o en_mision.' 
        });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE units SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [status, unitId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Unidad no encontrada.' });
        }

        res.json({
            message: `Estado de la unidad actualizado a: ${status}`,
            data: { id: unitId, status }
        });

    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// DELETE /api/units/:id - Eliminar unidad (solo desactiva)
router.delete('/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const unitId = req.params.id;

    try {
        const [result] = await pool.execute(
            'UPDATE units SET status = "inactivo", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [unitId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Unidad no encontrada.' });
        }

        res.json({
            message: 'Unidad desactivada exitosamente',
            data: { id: unitId, status: 'inactivo' }
        });

    } catch (error) {
        console.error('Error al desactivar unidad:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;