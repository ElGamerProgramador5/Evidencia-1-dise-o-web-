document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    window.location.href = '/dashboard.html';
                } else {
                    const errorData = await response.json();
                    errorMessage.textContent = errorData.message || 'Error al iniciar sesión';
                }
            } catch (error) {
                console.error('Error en el login:', error);
                errorMessage.textContent = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
            }
        });
    }
});
