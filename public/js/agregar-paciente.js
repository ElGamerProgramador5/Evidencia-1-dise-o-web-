document.addEventListener('DOMContentLoaded', () => {
    const addPacienteForm = document.getElementById('add-paciente-form');
    const messageDiv = document.getElementById('message');
    const logoutBtn = document.getElementById('logout-btn');

    addPacienteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;

        try {
            const response = await fetch('/pacientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre })
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = 'Paciente agregado con éxito.';
                messageDiv.style.color = 'green';
                addPacienteForm.reset();
            } else {
                messageDiv.textContent = result.message || 'Error al agregar el paciente.';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error al agregar paciente:', error);
            messageDiv.textContent = 'Error de conexión.';
            messageDiv.style.color = 'red';
        }
    });

    logoutBtn.addEventListener('click', async () => {
        await fetch('/auth/logout', { method: 'POST' });
        window.location.href = '/login.html';
    });
});