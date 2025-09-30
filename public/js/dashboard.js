document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    const pacientesLista = document.getElementById('pacientes-lista');

    const cargarPacientes = async () => {
        try {
            const response = await fetch('/pacientes');
            if (response.ok) {
                const pacientes = await response.json();
                let listHtml = '';
                if (pacientes.length === 0) {
                    listHtml = '<li class="no-pacientes">No tienes pacientes asignados. ¡Agrega uno nuevo!</li>';
                } else {
                    pacientes.forEach(paciente => {
                        listHtml += `
                            <li data-paciente-id="${paciente.id}">
                                <div class="paciente-info">
                                    <span class="paciente-nombre">${paciente.nombre}</span>
                                </div>
                                <div class="paciente-acciones">
                                    <button class="btn-seleccionar">Seleccionar</button>
                                    <button class="btn-alta">Dar de Alta</button>
                                </div>
                            </li>
                        `;
                    });
                }
                pacientesLista.innerHTML = listHtml;
            } else if (response.status === 401) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
            pacientesLista.innerHTML = '<li class="no-pacientes">Error al cargar la lista de pacientes.</li>';
        }
    };

    pacientesLista.addEventListener('click', (e) => {
        const target = e.target;
        const li = target.closest('li');
        if (!li) return;

        const pacienteId = li.dataset.pacienteId;

        if (target.classList.contains('btn-seleccionar')) {
            // Redirigir a crear receta con el paciente pre-seleccionado
            window.location.href = `/crear-receta.html?pacienteId=${pacienteId}`;
        }

        if (target.classList.contains('btn-alta')) {
            // Lógica para dar de alta (eliminar)
            if (confirm('¿Estás seguro de que quieres dar de alta a este paciente?')) {
                fetch(`/pacientes/${pacienteId}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) li.remove(); // Eliminar de la lista si fue exitoso
                        else alert('Error al dar de alta al paciente.');
                    })
                    .catch(err => console.error('Error en el fetch de alta:', err));
            }
        }
    });

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

    cargarPacientes();
});
