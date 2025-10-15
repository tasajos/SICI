// Función auxiliar para registrar asignaciones
export const registerAssignments = async (formData, incidentId, users) => {
    try {
        const assignments = [];

        // Mapeo de campos del formulario a tipos de asignación
        const assignmentTypes = {
            incident_commander: 'commander',
            safety_officer: 'safety_officer',
            liaison_officer: 'liaison_officer',
            public_information_officer: 'public_information_officer',
            operations_chief: 'operations_chief',
            planning_chief: 'planning_chief',
            logistics_chief: 'logistics_chief',
            finance_chief: 'finance_chief'
        };

        console.log('📝 Datos del formulario recibidos:', formData);
        console.log('👥 Usuarios disponibles:', users);

        // Crear asignaciones para cada campo que tenga un valor (ahora son IDs)
        Object.keys(assignmentTypes).forEach(field => {
            const userId = formData[field];
            
            // Verificar si hay un ID válido (número o string no vacío)
            if (userId && userId !== '' && userId !== '0') {
                // Encontrar el usuario para obtener el nombre
                const user = users.find(u => u.id == userId); // Usar == para comparación flexible
                
                if (user) {
                    assignments.push({
                        user_id: userId,
                        assignment_type: assignmentTypes[field],
                        user_name: user.full_name // Para referencia
                    });
                    console.log(`✅ Asignación creada: ${assignmentTypes[field]} -> ${user.full_name} (ID: ${userId})`);
                } else {
                    console.warn(`⚠️ Usuario no encontrado para ID: ${userId} en campo: ${field}`);
                }
            } else {
                console.log(`ℹ️ Campo ${field} vacío o sin asignación`);
            }
        });

        // Si hay asignaciones para registrar
        if (assignments.length > 0) {
            console.log('📤 Enviando asignaciones al servidor:', assignments);
            
            const response = await fetch(`http://localhost:3310/api/incidents/${incidentId}/assignments/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    assignments: assignments
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`Error al registrar asignaciones: ${response.status}`);
            }

            const result = await response.json();
            console.log(`✅ Registradas ${assignments.length} asignaciones para el incidente ${incidentId}`, result);
            
            return assignments.length;
        } else {
            console.log('ℹ️ No hay asignaciones para registrar');
            return 0;
        }

    } catch (error) {
        console.error('❌ Error al registrar asignaciones:', error);
        throw error;
    }
};