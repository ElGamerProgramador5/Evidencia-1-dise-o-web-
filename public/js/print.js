document.addEventListener('DOMContentLoaded', () => {
    const recetaContainer = document.getElementById('receta-container');
    const medicoNombreEl = document.getElementById('medico-nombre');
    const recetaFechaEl = document.getElementById('receta-fecha');
    const pacienteNombreEl = document.getElementById('paciente-nombre');
    const medicamentosListaEl = document.getElementById('medicamentos-lista');
    const pacienteFechaNacimientoEl = document.getElementById('paciente-fecha-nacimiento');
    const pacienteGeneroEl = document.getElementById('paciente-genero');

    const cargarDatosReceta = async () => {
        document.body.innerHTML = '<h1>Generando PDF, por favor espere...</h1>';
        const recetaId = new URLSearchParams(window.location.search).get('id');

        if (recetaId) {
            try {
                const response = await fetch(`/recetas/${recetaId}/print`);
                if (response.ok) {
                    const receta = await response.json();
                    
                    medicoNombreEl.textContent = receta.Medico.nombre;
                    pacienteNombreEl.textContent = receta.Paciente.nombre;
                    pacienteFechaNacimientoEl.textContent = receta.Paciente.fecha_nacimiento ? new Date(receta.Paciente.fecha_nacimiento).toLocaleDateString('es-ES') : 'No especificada';
                    pacienteGeneroEl.textContent = receta.Paciente.genero || 'No especificado';
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

                    // Generar el PDF
                    const opt = {
                        margin:       1,
                        filename:     `receta-${receta.Paciente.nombre.replace(/\s/g, '_')}-${receta.id}.pdf`,
                        image:        { type: 'jpeg', quality: 0.98 },
                        html2canvas:  { scale: 2 },
                        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                    };
                    html2pdf().from(recetaContainer).set(opt).save().then(() => { window.close(); });

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
