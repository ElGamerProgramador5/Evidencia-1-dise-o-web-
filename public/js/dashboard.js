document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const pacientesSection = document.getElementById('pacientes');
    const pacienteSelect = document.getElementById('paciente-select');
    const medicamentosContainer = document.getElementById('medicamentos-container');
    const addMedicamentoBtn = document.getElementById('add-medicamento-btn');
    const recetaForm = document.getElementById('receta-form');

    const cargarPacientes = async () => {
        try {
            const response = await fetch('/pacientes');
            if (response.ok) {
                const pacientes = await response.json();
                let listHtml = '<h2>Mis Pacientes</h2><ul>';
                let selectHtml = '<option value="" disabled selected>Selecciona un paciente</option>';
                pacientes.forEach(paciente => {
                    listHtml += `<li>${paciente.nombre}</li>`;
                    selectHtml += `<option value="${paciente.id}">${paciente.nombre}</option>`;
                });
                listHtml += '</ul>';
                pacientesSection.innerHTML = listHtml;
                pacienteSelect.innerHTML = selectHtml;
            } else if (response.status === 401) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
        }
    };

    const addMedicamentoField = () => {
        const div = document.createElement('div');
        div.classList.add('medicamento-field');
        div.innerHTML = `
            <div class="input-group">
                <input type="text" name="medicamentoNombre" placeholder="Nombre del medicamento" required>
            </div>
            <div class="input-group">
                <input type="text" name="dosis" placeholder="Dosis" required>
            </div>
            <div class="input-group">
                <input type="text" name="posologia" placeholder="Posología" required>
            </div>
            <button type="button" class="remove-medicamento-btn">Eliminar</button>
        `;
        medicamentosContainer.appendChild(div);
    };

    medicamentosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-medicamento-btn')) {
            e.target.parentElement.remove();
        }
    });

    if (recetaForm) {
        recetaForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(recetaForm);
            const pacienteId = formData.get('pacienteId');
            const motivo = formData.get('motivo');

            const medicamentos = [];
            const medicamentoFields = medicamentosContainer.querySelectorAll('.medicamento-field');
            medicamentoFields.forEach(field => {
                medicamentos.push({
                    nombre: field.querySelector('[name="medicamentoNombre"]').value,
                    dosis: field.querySelector('[name="dosis"]').value,
                    posologia: field.querySelector('[name="posologia"]').value
                });
            });

            try {
                const response = await fetch('/recetas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pacienteId, motivo, medicamentos })
                });

                if (response.ok) {
                    const nuevaReceta = await response.json();
                    window.open(`/print_receta.html?id=${nuevaReceta.id}`, '_blank');
                } else {
                    alert('Error al crear la receta');
                }
            } catch (error) {
                console.error('Error al crear receta:', error);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST'
                });

                if (response.ok) {
                    window.location.href = '/login.html';
                } else {
                    console.error('Error al cerrar sesión');
                }
            } catch (error) {
                console.error('Error en el logout:', error);
            }
        });
    }

    if (addMedicamentoBtn) {
        addMedicamentoBtn.addEventListener('click', addMedicamentoField);
    }

    cargarPacientes();
    addMedicamentoField(); // Agregar el primer campo de medicamento por defecto
});
