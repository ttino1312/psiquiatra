// ============================================
// FORMULARIO DE CONTACTO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    const formulario = document.getElementById('contactForm');
    const mensajeRespuesta = document.getElementById('mensajeRespuesta');

    if (!formulario) {
        console.warn('⚠️ Formulario no encontrado');
        return;
    }

    // Configurar teléfono (solo números)
    const inputTelefono = document.getElementById('telefono');
    if (inputTelefono) {
        inputTelefono.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    // Enviar formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();

        const datos = obtenerDatosFormulario();
        
        if (!validarDatos(datos)) {
            return;
        }

        enviarFormulario(datos);
    });
});

// ============================================
// OBTENER DATOS DEL FORMULARIO
// ============================================
function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        fecha: document.getElementById('fecha').value,
        horario: document.getElementById('horario').value,
        motivo: document.getElementById('motivo').value.trim(),
        timestamp: new Date().toISOString()
    };
}

// ============================================
// VALIDAR DATOS
// ============================================
function validarDatos(datos) {
    
    if (!datos.nombre || !datos.email || !datos.telefono || !datos.fecha || !datos.horario) {
        mostrarMensaje('Por favor, completá todos los campos obligatorios.', 'error');
        return false;
    }

    if (!validarEmail(datos.email)) {
        mostrarMensaje('Por favor, ingresá un email válido.', 'error');
        return false;
    }

    if (!validarTelefono(datos.telefono)) {
        mostrarMensaje('El teléfono debe tener entre 10 y 11 dígitos.', 'error');
        return false;
    }

    if (!validarFecha(datos.fecha)) {
        mostrarMensaje('Por favor, seleccioná una fecha futura.', 'error');
        return false;
    }

    return true;
}

// ============================================
// ENVIAR FORMULARIO
// ============================================
function enviarFormulario(datos) {
    const btnEnviar = document.querySelector('.btn-full');
    
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '⏳ Enviando...';

    fetch('guardar-turno.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            mostrarExito(datos);
            limpiarFormulario();
        } else {
            mostrarMensaje('Error al guardar: ' + (data.error || 'Error desconocido'), 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error de conexión. Verificá tu internet e intentá nuevamente.', 'error');
    })
    .finally(() => {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = 'Enviar Solicitud';
    });
}

// ============================================
// MOSTRAR MENSAJE DE ÉXITO
// ============================================
function mostrarExito(datos) {
    const mensaje = `
        <div style="text-align: center;">
            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
            <strong style="font-size: 18px; display: block; margin-bottom: 8px;">¡Solicitud enviada con éxito!</strong>
            <p style="margin: 8px 0;">Hola <strong>${datos.nombre}</strong>, recibimos tu solicitud.</p>
            <p style="margin: 8px 0;">📅 Fecha: <strong>${formatearFecha(datos.fecha)}</strong></p>
            <p style="margin: 8px 0;">🕐 Horario: <strong>${datos.horario} hs</strong></p>
            <p style="margin: 12px 0 0 0; font-size: 14px; opacity: 0.9;">Te contactaremos pronto para confirmar tu turno.</p>
        </div>
    `;
    
    mostrarMensaje(mensaje, 'exito', true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// LIMPIAR FORMULARIO
// ============================================
function limpiarFormulario() {
    document.getElementById('contactForm').reset();
    
    const selectHorario = document.getElementById('horario');
    if (selectHorario) {
        selectHorario.disabled = true;
        selectHorario.innerHTML = '<option value="">Primero seleccioná una fecha</option>';
    }
}

// ============================================
// MOSTRAR MENSAJE
// ============================================
function mostrarMensaje(mensaje, tipo, esHTML = false) {
    const div = document.getElementById('mensajeRespuesta');
    if (!div) return;
    
    div.className = 'mensaje-respuesta ' + tipo;
    
    if (esHTML) {
        div.innerHTML = mensaje;
    } else {
        div.textContent = mensaje;
    }
    
    div.style.display = 'block';
    div.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    if (tipo === 'error' || tipo === 'info') {
        setTimeout(() => {
            div.style.display = 'none';
        }, 5000);
    }
}

// ============================================
// VALIDACIONES
// ============================================
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefono(telefono) {
    const limpio = telefono.replace(/\D/g, '');
    return limpio.length >= 10 && limpio.length <= 11;
}

function validarFecha(fecha) {
    const seleccionada = new Date(fecha + 'T12:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return seleccionada >= hoy;
}

function formatearFecha(fecha) {
    const fechaObj = new Date(fecha + 'T12:00:00');
    return fechaObj.toLocaleDateString('es-AR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}
