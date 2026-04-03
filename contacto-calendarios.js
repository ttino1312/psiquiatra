// contacto-calendarios.js - CON VALIDACIÓN DE DÍAS Y HORARIOS DINÁMICOS

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const mensajeRespuesta = document.getElementById('mensajeRespuesta');
    const fechaInput = document.getElementById('fecha');
    const horarioSelect = document.getElementById('horario');

    // Establecer fecha mínima (hoy)
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.setAttribute('min', hoy);
    }

    // HORARIOS SEGÚN DÍA
    const horariosLunesViernes = [
        { value: '09:00-11:00', text: 'Mañana (09:00 - 11:00)' },
        { value: '11:00-13:00', text: 'Mediodía (11:00 - 13:00)' },
        { value: '14:00-17:00', text: 'Tarde (14:00 - 17:00)' },
        { value: '17:00-20:00', text: 'Noche (17:00 - 20:00)' }
    ];

    const horariosSabado = [
        { value: '09:00-11:00', text: 'Mañana (09:00 - 11:00)' },
        { value: '11:00-13:00', text: 'Mediodía (11:00 - 13:00)' }
    ];

    // Cambiar horarios cuando selecciona fecha
    if (fechaInput && horarioSelect) {
        fechaInput.addEventListener('change', function() {
            const fechaSeleccionada = new Date(this.value + 'T00:00:00');
            const diaSemana = fechaSeleccionada.getDay(); // 0=Domingo, 6=Sábado

            // Limpiar select
            horarioSelect.innerHTML = '<option value="">Seleccione horario</option>';

            // DOMINGO (0) = CERRADO
            if (diaSemana === 0) {
                mostrarMensaje('⚠️ Los domingos no hay atención. Por favor, elegí otro día.', 'error');
                fechaInput.value = '';
                return;
            }

            // SÁBADO (6) = Horario reducido
            if (diaSemana === 6) {
                horariosSabado.forEach(h => {
                    const option = document.createElement('option');
                    option.value = h.value;
                    option.textContent = h.text;
                    horarioSelect.appendChild(option);
                });
                mostrarMensaje('ℹ️ Sábados: horario reducido 09:00-13:00', 'info');
            } 
            // LUNES A VIERNES
            else {
                horariosLunesViernes.forEach(h => {
                    const option = document.createElement('option');
                    option.value = h.value;
                    option.textContent = h.text;
                    horarioSelect.appendChild(option);
                });
            }
        });
    }

    // ENVIAR FORMULARIO
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Obtener valores
            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const email = document.getElementById('email').value.trim();
            const servicio = document.getElementById('servicio').value;
            const modalidad = document.getElementById('modalidad').value;
            const fecha = fechaInput.value;
            const horario = horarioSelect.value;
            const mensaje = document.getElementById('mensaje').value.trim();

            // Validación básica
            if (!nombre || !telefono || !servicio || !modalidad || !fecha || !horario) {
                mostrarMensaje('Por favor, completá todos los campos obligatorios (*)', 'error');
                return;
            }

            // Validar que no sea domingo
            const fechaObj = new Date(fecha + 'T00:00:00');
            if (fechaObj.getDay() === 0) {
                mostrarMensaje('⚠️ No se puede agendar turnos los domingos', 'error');
                return;
            }

            // Formatear fecha
            const fechaFormateada = fechaObj.toLocaleDateString('es-AR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            // Crear mensaje
            const servicioTexto = document.querySelector(`#servicio option[value="${servicio}"]`).text;
            const modalidadTexto = document.querySelector(`#modalidad option[value="${modalidad}"]`).text;
            const horarioTexto = document.querySelector(`#horario option[value="${horario}"]`).text;

            let mensajeWhatsApp = `¡Hola! Quiero solicitar un turno:\n\n`;
            mensajeWhatsApp += `👤 *Nombre:* ${nombre}\n`;
            mensajeWhatsApp += `📱 *Teléfono:* ${telefono}\n`;
            if (email) mensajeWhatsApp += `📧 *Email:* ${email}\n`;
            mensajeWhatsApp += `🩺 *Servicio:* ${servicioTexto}\n`;
            mensajeWhatsApp += `📍 *Modalidad:* ${modalidadTexto}\n`;
            mensajeWhatsApp += `📅 *Fecha:* ${fechaFormateada}\n`;
            mensajeWhatsApp += `🕐 *Horario:* ${horarioTexto}\n`;
            if (mensaje) mensajeWhatsApp += `\n💬 *Mensaje:*\n${mensaje}`;

            // Codificar y redirigir
            const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
            const numeroWhatsApp = '5491161647080';
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

            mostrarMensaje('¡Perfecto! Te estamos redirigiendo a WhatsApp...', 'exito');

            setTimeout(function() {
                window.open(urlWhatsApp, '_blank');
                form.reset();
                horarioSelect.innerHTML = '<option value="">Seleccione horario</option>';
            }, 1500);
        });
    }

    function mostrarMensaje(texto, tipo) {
        mensajeRespuesta.textContent = texto;
        mensajeRespuesta.className = 'mensaje-respuesta ' + tipo;
        mensajeRespuesta.style.display = 'block';

        setTimeout(function() {
            if (tipo !== 'error') {
                mensajeRespuesta.style.display = 'none';
            }
        }, tipo === 'error' ? 5000 : 8000);
    }
});
