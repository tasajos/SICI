const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST /api/forms/:formType - Guardar formulario
router.post('/:formType', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const formType = req.params.formType;
    const formData = req.body;
    const userId = req.session.user.id;

    try {
        // Verificar que el usuario tenga permisos para este formulario
        const hasPermission = await checkFormPermission(userId, formType, formData.incident_id);
        if (!hasPermission) {
            return res.status(403).json({ message: 'No tienes permisos para este formulario.' });
        }

        let result;
        const tableName = getTableName(formType);

        // Insertar en la tabla correspondiente
        const [insertResult] = await pool.execute(
            `INSERT INTO ${tableName} SET ?`,
            [{ ...formData, created_by: userId }]
        );

        // Registrar en incident_forms
        await pool.execute(
            'INSERT INTO incident_forms (incident_id, form_type, form_id, created_by) VALUES (?, ?, ?, ?)',
            [formData.incident_id, formType, insertResult.insertId, userId]
        );

        res.status(201).json({
            message: 'Formulario guardado exitosamente',
            data: { id: insertResult.insertId, ...formData }
        });

    } catch (error) {
        console.error('Error al guardar formulario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Función para verificar permisos
async function checkFormPermission(userId, formType, incidentId) {
    // Aquí implementarías la lógica para verificar si el usuario
    // tiene el rol adecuado y si el formulario está habilitado
    return true; // Temporal
}

// Función para obtener nombre de tabla
function getTableName(formType) {
    const formTables = {
        'form201': 'form_201_resumen_situacion',
        'form202': 'form_202_objetivos_incidente',
        // ... agregar todos los formularios
    };
    return formTables[formType] || formType;
}

module.exports = router;