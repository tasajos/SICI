const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Mapeo de tipos de formulario a nombres de tabla
const formTableMap = {
    'form201': 'form_201_resumen_situacion',
    'form202': 'form_202_objetivos_incidente',
    'form203': 'form_203_organizacion_incidente',
    'form204': 'form_204_asignaciones_tacticas',
    'form205': 'form_205_plan_comunicaciones',
    'form206': 'form_206_plan_medico',
    'form207': 'form_207_lista_recursos',
    'form208': 'form_208_resumen_situacion',
    'form209': 'form_209_registro_progreso',
    'form211': 'form_211_registro_personal',
    'form212': 'form_212_registro_seguridad',
    'form213': 'form_213_registro_comunicaciones',
    'form214': 'form_214_registro_actividades',
    'form215': 'form_215_registro_logistica',
    'form216': 'form_216_registro_finanzas',
    'form217': 'form_217_informe_evaluacion',
    'form218': 'form_218_registro_desmovilizacion_recursos',
    'form219': 'form_219_informe_desmovilizacion',
    'form220': 'form_220_registro_lecciones_aprendidas',
    'form221': 'form_221_verificacion_desmovilizacion'
};

// POST /api/forms/:formType - Guardar formulario
router.post('/:formType', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const formType = req.params.formType;
    const formData = req.body;
    const userId = req.session.user.id;

    // Verificar que el tipo de formulario es válido
    if (!formTableMap[formType]) {
        return res.status(400).json({ message: 'Tipo de formulario no válido.' });
    }

    try {
        const tableName = formTableMap[formType];

        // Preparar datos para inserción
        const insertData = {
            ...formData,
            created_by: userId
        };

        // Construir la consulta dinámicamente
        const fields = Object.keys(insertData);
        const placeholders = fields.map(() => '?').join(', ');
        const values = fields.map(field => insertData[field]);

        const [result] = await pool.execute(
            `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${placeholders})`,
            values
        );

        // Registrar en incident_forms si hay incident_id
        if (formData.incident_id) {
            await pool.execute(
                'INSERT INTO incident_forms (incident_id, form_type, form_id, created_by) VALUES (?, ?, ?, ?)',
                [formData.incident_id, formType, result.insertId, userId]
            );
        }

        res.status(201).json({
            message: 'Formulario guardado exitosamente',
            data: { 
                id: result.insertId, 
                form_type: formType,
                ...formData 
            }
        });

    } catch (error) {
        console.error('Error al guardar formulario:', error);
        
        // Manejar error de tabla no existente
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return res.status(500).json({ 
                message: 'La tabla para este formulario no existe. Contacte al administrador.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }

        res.status(500).json({ 
            message: 'Error interno del servidor al guardar el formulario.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});


// En tu archivo de rutas de forms (routes/forms.routes.js)
router.get('/form203-by-incident/:incidentName', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const incidentName = req.params.incidentName;

    try {
        const [results] = await pool.execute(`
            SELECT 
                f.id AS form203_id,
                f.incident_name,
                f.incident_date,
                f.incident_commander,
                f.safety_officer,
                f.liaison_officer,
                f.public_information_officer,
                f.operations_chief,
                f.planning_chief,
                i.id AS incident_id,
                i.incident_type,
                i.severity_level,
                i.location,
                i.description,
                i.commander,
                i.start_date,
                i.estimated_duration
            FROM form_203_organizacion_incidente AS f
            INNER JOIN incidents AS i 
                ON f.incident_name = i.incident_name
            WHERE f.incident_name = ?
        `, [incidentName]);

        if (results.length === 0) {
            return res.status(404).json({ 
                message: 'Formulario 203 no encontrado para este incidente.',
                data: null 
            });
        }

        res.json({
            message: 'Formulario 203 obtenido exitosamente',
            data: results[0]
        });

    } catch (error) {
        console.error('Error al obtener formulario 203:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/forms/:formType/:id - Obtener formulario específico
router.get('/:formType/:id', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const formType = req.params.formType;
    const formId = req.params.id;

    if (!formTableMap[formType]) {
        return res.status(400).json({ message: 'Tipo de formulario no válido.' });
    }

    try {
        const tableName = formTableMap[formType];
        
        const [rows] = await pool.execute(
            `SELECT * FROM ${tableName} WHERE id = ?`,
            [formId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Formulario no encontrado.' });
        }

        res.json({
            message: 'Formulario obtenido exitosamente',
            data: rows[0]
        });

    } catch (error) {
        console.error('Error al obtener formulario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/forms/incident/:incidentId - Obtener formularios por incidente
router.get('/incident/:incidentId', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    const incidentId = req.params.incidentId;

    try {
        const [forms] = await pool.execute(`
            SELECT 
                if.*,
                f.*,
                u.full_name as created_by_name
            FROM incident_forms if
            LEFT JOIN users u ON if.created_by = u.id
            WHERE if.incident_id = ?
            ORDER BY if.created_at DESC
        `, [incidentId]);

        res.json({
            message: 'Formularios del incidente obtenidos exitosamente',
            data: forms
        });

    } catch (error) {
        console.error('Error al obtener formularios del incidente:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/forms/user/my-forms - Obtener formularios del usuario actual
router.get('/user/my-forms', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autorizado.' });
    }

    try {
        const [forms] = await pool.execute(`
            SELECT 
                if.*,
                i.incident_name,
                u.full_name as created_by_name
            FROM incident_forms if
            JOIN incidents i ON if.incident_id = i.id
            LEFT JOIN users u ON if.created_by = u.id
            WHERE if.created_by = ?
            ORDER BY if.created_at DESC
        `, [req.session.user.id]);

        res.json({
            message: 'Formularios del usuario obtenidos exitosamente',
            data: forms
        });

    } catch (error) {
        console.error('Error al obtener formularios del usuario:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;