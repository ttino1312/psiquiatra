// dark-mode.js - Toggle de modo oscuro

document.addEventListener('DOMContentLoaded', function() {
    // Crear botón de dark mode
    const darkModeBtn = document.createElement('button');
    darkModeBtn.className = 'dark-mode-toggle';
    darkModeBtn.setAttribute('aria-label', 'Cambiar modo oscuro');
    darkModeBtn.innerHTML = '🌙';
    document.body.appendChild(darkModeBtn);

    // Verificar si hay preferencia guardada
    const darkModePreference = localStorage.getItem('darkMode');
    
    if (darkModePreference === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '☀️';
    }

    // Toggle al hacer click
    darkModeBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            darkModeBtn.innerHTML = '☀️';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeBtn.innerHTML = '🌙';
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});
