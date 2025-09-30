document.addEventListener('DOMContentLoaded', () => {
    const medicoNombreEl = document.getElementById('medico-nombre');
    const recetaFechaEl = document.getElementById('receta-fecha');
    const pacienteNombreEl = document.getElementById('paciente-nombre');
    const medicamentosListaEl = document.getElementById('medicamentos-lista');

    const cargarDatosReceta = async () => {
        const recetaId = new URLSearchParams(window.location.search).get('id');

        if (recetaId) {
            try {
                const response = await fetch(`/recetas/${recetaId}/print`);
                if (response.ok) {
                    const receta = await response.json();
                    
                    medicoNombreEl.textContent = receta.Medico.nombre;
                    pacienteNombreEl.textContent = receta.Paciente.nombre;
                    recetaFechaEl.textContent = new Date(receta.fecha).toLocaleDateString('es-ES');

                    let medicamentosHtml = '';
                    receta.RecetaItems.forEach(item => {
                        medicamentosHtml += `
                            <li>
                                <strong>${item.Medicamento.nombre}</strong> (${item.dosis}) - ${item.posologia}
                            </li>
                        `;
                    });
                    medicamentosListaEl.innerHTML = medicamentosHtml;

                    // Opcional: abrir diálogo de impresión automáticamente
                    // window.print();

                } else {
                    document.body.innerHTML = '<h1>Error al cargar la receta. Verifique que tiene permiso para verla.</h1>';
                }
            } catch (error) {
                console.error('Error al cargar datos de la receta:', error);
                document.body.innerHTML = '<h1>Error de conexión al cargar la receta.</h1>';
            }
        }
    };

    cargarDatosReceta();
});
