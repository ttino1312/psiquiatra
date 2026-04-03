// validaciones.js - Validaciones del formulario
document.addEventListener('DOMContentLoaded', function() {
    
    // Validar teléfono - Solo números
    const telefonoInputs = document.querySelectorAll('input[type="tel"]');
    telefonoInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9+\-() ]/g, '');
        });
        input.maxLength = 20;
    });

    // Validar email
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#ff6b6b';
            } else {
                this.style.borderColor = '#E6E0D8';
            }
        });
    });

    // Límite de caracteres en inputs
    const textInputs = document.querySelectorAll('input[type="text"], input[name="nombre"]');
    textInputs.forEach(input => {
        input.maxLength = 50;
    });

    // Límite en textarea
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.maxLength = 500;
    });
});
