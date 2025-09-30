document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const pacienteSelect = document.getElementById('paciente-select');
    const medicamentosContainer = document.getElementById('medicamentos-container');
    const addMedicamentoBtn = document.getElementById('add-medicamento-btn');
    const recetaForm = document.getElementById('receta-form');

    // Elementos del Modal
    const modal = document.getElementById('add-paciente-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const modalForm = document.getElementById('modal-add-paciente-form');
    const modalMessage = document.getElementById('modal-message');
    const modalPacienteNombre = document.getElementById('modal-paciente-nombre');

    let listaMedicamentos = []; // Almacenará la lista de medicamentos

    const cargarPacientes = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const pacienteIdSeleccionado = urlParams.get('pacienteId');

        try {
            const response = await fetch('/pacientes');
            if (response.ok) {
                const pacientes = await response.json();
                let selectHtml = '<option value="" disabled selected>Selecciona un paciente</option>';
                pacientes.forEach(paciente => {
                    // Si el ID del paciente coincide con el de la URL, lo pre-seleccionamos
                    const isSelected = paciente.id == pacienteIdSeleccionado ? 'selected' : '';
                    selectHtml += `<option value="${paciente.id}" ${isSelected}>${paciente.nombre}</option>`;
                });
                selectHtml += '<option value="nuevo" style="font-weight:bold; color: #007bff;">-- Agregar Nuevo Paciente --</option>';
                pacienteSelect.innerHTML = selectHtml;
            } else if (response.status === 401) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
        }
    };

    const cargarListaMedicamentos = async () => {
        try {
            const response = await fetch('/medicamentos');
            if (response.ok) {
                listaMedicamentos = await response.json();
                // Actualizar cualquier campo de medicamento ya existente
                document.querySelectorAll('datalist[id^="medicamentos-list-"]').forEach(datalist => {
                    datalist.innerHTML = listaMedicamentos.map(med => `<option value="${med.nombre}"></option>`).join('');
                });
            }
        } catch (error) {
            console.error('Error al cargar la lista de medicamentos:', error);
        }
    };

    const addMedicamentoField = () => {
        const fieldId = Date.now(); // ID único para el campo
        const div = document.createElement('div');
        div.classList.add('medicamento-field');
        div.innerHTML = `
            <div class="input-group med-nombre autocomplete-container">
                <input type="text" name="medicamentoNombre" class="medicamento-search" placeholder="Escriba para buscar medicamento..." required autocomplete="off">
                <div class="autocomplete-results"></div>
            </div>

            <div class="input-group med-dosis">
                <input type="number" name="dosis_cantidad" placeholder="Cant." required>
                <select name="dosis_unidad">
                    <option>mg</option>
                    <option>g</option>
                    <option>ml</option>
                    <option>UI</option>
                    <option>tableta(s)</option>
                    <option>cápsula(s)</option>
                    <option>gota(s)</option>
                    <option>aplicación(es)</option>
                </select>
            </div>
            <div class="input-group med-posologia">
                <select name="posologia_frecuencia">
                    <option>Cada 4 horas</option>
                    <option>Cada 6 horas</option>
                    <option>Cada 8 horas</option>
                    <option>Cada 12 horas</option>
                    <option>Cada 24 horas</option>
                    <option>Una vez al día</option>
                    <option>Dos veces al día</option>
                    <option>Tres veces al día</option>
                    <option>Según sea necesario</option>
                </select>
                <input type="text" name="posologia_duracion" placeholder="ej: por 7 días">
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

    // --- Lógica del Autocompletado de Medicamentos ---
    medicamentosContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('medicamento-search')) {
            const input = e.target;
            const resultsContainer = input.nextElementSibling;
            const query = input.value.toLowerCase();

            resultsContainer.innerHTML = '';
            if (query.length > 0) {
                const filteredMeds = listaMedicamentos.filter(med => med.nombre.toLowerCase().includes(query));
                
                filteredMeds.forEach(med => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('autocomplete-item');
                    resultItem.textContent = med.nombre;
                    resultItem.addEventListener('click', () => {
                        input.value = med.nombre;
                        resultsContainer.innerHTML = '';
                    });
                    resultsContainer.appendChild(resultItem);
                });
            }
        }
    });

    // Ocultar resultados si se hace clic fuera
    document.addEventListener('click', (e) => {
        const openAutocomplete = document.querySelector('.autocomplete-results:not(:empty)');
        if (openAutocomplete && !e.target.closest('.autocomplete-container')) {
            openAutocomplete.innerHTML = '';
        }
    });


    recetaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(recetaForm);
        const pacienteId = formData.get('pacienteId');
        const motivo = formData.get('motivo');

        const medicamentos = [];
        const medicamentoFields = medicamentosContainer.querySelectorAll('.medicamento-field');
        medicamentoFields.forEach(field => {
            const dosis_cantidad = field.querySelector('[name="dosis_cantidad"]').value;
            const dosis_unidad = field.querySelector('[name="dosis_unidad"]').value;
            const posologia_frecuencia = field.querySelector('[name="posologia_frecuencia"]').value;
            const posologia_duracion = field.querySelector('[name="posologia_duracion"]').value;

            medicamentos.push({
                nombre: field.querySelector('[name="medicamentoNombre"]').value,
                dosis: `${dosis_cantidad} ${dosis_unidad}`,
                posologia: `${posologia_frecuencia} ${posologia_duracion}`.trim()
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
                recetaForm.reset();
                medicamentosContainer.innerHTML = '';
                addMedicamentoField();
            } else {
                alert('Error al crear la receta');
            }
        } catch (error) {
            console.error('Error al crear receta:', error);
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await fetch('/auth/logout', { method: 'POST' });
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Error en el logout:', error);
        }
    });

    // --- Lógica del Modal ---

    // Abrir modal si se selecciona "Agregar Nuevo Paciente"
    pacienteSelect.addEventListener('change', () => {
        if (pacienteSelect.value === 'nuevo') {
            modal.style.display = 'block';
            modalPacienteNombre.focus();
        }
    });

    // Cerrar modal
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        pacienteSelect.value = ''; // Resetear el select
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            pacienteSelect.value = ''; // Resetear el select
        }
    });

    // Enviar formulario del modal
    modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = modalPacienteNombre.value;

        try {
            const response = await fetch('/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });
            const nuevoPaciente = await response.json();

            if (response.ok) {
                // Agregar el nuevo paciente al select y seleccionarlo
                const newOption = new Option(nuevoPaciente.nombre, nuevoPaciente.id, true, true);
                pacienteSelect.add(newOption, pacienteSelect.options[pacienteSelect.options.length - 1]);
                
                // Cerrar y resetear el modal
                modal.style.display = 'none';
                modalForm.reset();
            } else {
                modalMessage.textContent = nuevoPaciente.message || 'Error al guardar.';
            }
        } catch (error) {
            modalMessage.textContent = 'Error de conexión.';
        }
    });

    addMedicamentoBtn.addEventListener('click', addMedicamentoField);

    // Función de inicialización para asegurar que todo se carga en orden
    const init = async () => {
        await cargarPacientes();
        await cargarListaMedicamentos();
        addMedicamentoField(); // Agregar el primer campo de medicamento por defecto
    };

    init();
});