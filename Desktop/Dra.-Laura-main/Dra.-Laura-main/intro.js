// intro.js - Intro solo UNA VEZ por sesión

window.addEventListener('load', function() {
    const intro = document.getElementById('introLoader');
    const main = document.getElementById('mainContent');
    
    // Verificar que los elementos existan
    if (!intro || !main) {
        console.error('ERROR: No se encontraron los elementos intro/main');
        if (main) main.style.opacity = '1';
        return;
    }
    
    // Verificar si ya vio la intro en esta sesión
    const introVista = sessionStorage.getItem('introShown');
    
    if (introVista === 'true') {
        // Ya vio la intro - SALTEAR
        intro.style.display = 'none';
        main.style.opacity = '1';
        document.body.style.overflow = 'auto';
        console.log('Intro salteada - ya vista en esta sesión');
    } else {
        // PRIMERA VEZ EN ESTA SESIÓN - MOSTRAR INTRO
        console.log('Mostrando intro - primera vez en esta sesión');
        document.body.style.overflow = 'hidden';
        
        // Marcar que ya vio la intro
        sessionStorage.setItem('introShown', 'true');
        
        // Esperar 2.5 segundos
        setTimeout(() => {
            intro.style.opacity = '0';
            
            setTimeout(() => {
                intro.style.display = 'none';
                main.style.opacity = '1';
                document.body.style.overflow = 'auto';
            }, 800);
        }, 2500);
    }
});
