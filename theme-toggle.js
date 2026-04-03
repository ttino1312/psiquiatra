// ============================================
// MODO OSCURO / CLARO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Crear botón de tema
    crearBotonTema();
    
    // Aplicar tema guardado
    const temaGuardado = localStorage.getItem('tema') || 'claro';
    aplicarTema(temaGuardado);
});

function crearBotonTema() {
    // Crear botón flotante
    const btnTema = document.createElement('button');
    btnTema.id = 'theme-toggle';
    btnTema.className = 'theme-toggle';
    btnTema.setAttribute('aria-label', 'Cambiar tema');
    btnTema.innerHTML = '🌙';
    
    document.body.appendChild(btnTema);
    
    // Event listener
    btnTema.addEventListener('click', cambiarTema);
}

function cambiarTema() {
    const temaActual = document.body.classList.contains('dark-theme') ? 'oscuro' : 'claro';
    const nuevoTema = temaActual === 'claro' ? 'oscuro' : 'claro';
    
    aplicarTema(nuevoTema);
    localStorage.setItem('tema', nuevoTema);
}

function aplicarTema(tema) {
    const btn = document.getElementById('theme-toggle');
    
    if (tema === 'oscuro') {
        document.body.classList.add('dark-theme');
        if (btn) btn.innerHTML = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        if (btn) btn.innerHTML = '🌙';
    }
}
