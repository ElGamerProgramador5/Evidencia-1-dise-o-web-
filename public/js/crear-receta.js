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
            }
        } catch (error) {
            console.error('Error al cargar la lista de medicamentos:', error);
        }
    };

    const addMedicamentoField = () => {
        const div = document.createElement('div');
        div.classList.add('medicamento-field');
        div.innerHTML = `
            <div class="input-group med-nombre">
                <select name="medicamentoNombre" class="medicamento-select" placeholder="Buscar o añadir medicamento..."></select>
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

        // Inicializar Choices.js en el nuevo select
        const choicesInstance = new Choices(div.querySelector('.medicamento-select'), {
            allowHTML: false,
            removeItemButton: false, // Se ve mejor sin el botón de quitar en este contexto
            searchPlaceholderValue: "Buscar o añadir...",
            noResultsText: 'No hay resultados, presiona Enter para añadir',
            items: [],
            // Se establece la lista de opciones aquí
            choices: listaMedicamentos.map(med => ({ value: med.nombre, label: med.nombre }))
        });

        // Hacemos que la instancia sea accesible para poder destruirla si es necesario
        div.querySelector('.medicamento-select').choices = choicesInstance;

        // Evento para añadir un nuevo medicamento a la lista global si no existe
        choicesInstance.passedElement.element.addEventListener('addItem', function(event) {
            const exists = listaMedicamentos.some(med => med.nombre === event.detail.value);
            if (!exists) {
                listaMedicamentos.push({ nombre: event.detail.value });
                // Opcional: podrías actualizar otros selectores si fuera necesario
            }
        });
    };
    
    medicamentosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-medicamento-btn')) {
            e.target.parentElement.remove();
        }
    });


    recetaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(recetaForm);
        const pacienteId = formData.get('pacienteId');
        const motivo = formData.get('motivo');
        const fecha = formData.get('fecha');

        const medicamentos = [];
        const medicamentoFields = medicamentosContainer.querySelectorAll('.medicamento-field');
        medicamentoFields.forEach(field => {
            const dosis_cantidad = field.querySelector('[name="dosis_cantidad"]').value;
            const dosis_unidad = field.querySelector('[name="dosis_unidad"]').value;
            const posologia_frecuencia = field.querySelector('[name="posologia_frecuencia"]').value;
            const posologia_duracion = field.querySelector('[name="posologia_duracion"]').value;

            medicamentos.push({
                nombre: field.querySelector('.medicamento-select').value,
                dosis: `${dosis_cantidad} ${dosis_unidad}`,
                posologia: `${posologia_frecuencia} ${posologia_duracion}`.trim()
            });
        });

        try {
            const response = await fetch('/recetas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pacienteId, motivo, fecha, medicamentos })
            });

            if (response.ok) {
                const nuevaReceta = await response.json();
                window.open(`/print_receta.html?id=${nuevaReceta.id}`, '_blank');
                
                // Limpiar campos específicos en lugar de resetear todo el formulario
                recetaForm.querySelector('#motivo').value = '';
                recetaForm.querySelector('#receta-fecha').valueAsDate = new Date();

                // Destruir las instancias de Choices.js antes de limpiar el contenedor
                medicamentosContainer.querySelectorAll('.medicamento-select').forEach(select => {
                    if (select.choices) {
                        select.choices.destroy();
                    }
                });
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
        const formData = new FormData(modalForm);
        const data = {
            nombre: formData.get('nombre'),
            fecha_nacimiento: formData.get('fecha_nacimiento'),
            genero: formData.get('genero')
        };

        try {
            const response = await fetch('/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
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
        // Poner la fecha de hoy por defecto
        document.getElementById('receta-fecha').valueAsDate = new Date();
        addMedicamentoField(); // Agregar el primer campo de medicamento por defecto
    };

    init();
});