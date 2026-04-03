// ============================================
// CONTACTO - TODO EN UNO
// ============================================

console.log('🚀 Script de contacto cargado');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado - Inicializando...');
    
    // ============================================
    // CONFIGURAR HORARIOS
    // ============================================
    const inputFecha = document.getElementById('fecha');
    const selectHorario = document.getElementById('horario');
    
    console.log('Fecha input:', inputFecha);
    console.log('Horario select:', selectHorario);
    
    if (inputFecha && selectHorario) {
        console.log('✅ Elementos encontrados');
        
        // Fecha mínima
        const hoy = new Date();
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);
        inputFecha.min = manana.toISOString().split('T')[0];
        
        // Evento change
        inputFecha.addEventListener('change', function() {
            const fecha = this.value;
            console.log('📅 Fecha seleccionada:', fecha);
            
            if (!fecha) return;
            
            const fechaObj = new Date(fecha + 'T12:00:00');
            const dia = fechaObj.getDay(); // 0=Dom, 1=Lun, ..., 6=Sab
            
            console.log('📆 Día de semana:', dia);
            
            // Limpiar
            selectHorario.innerHTML = '';
            
            let horarios = [];
            
            // Domingo
            if (dia === 0) {
                selectHorario.disabled = true;
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = 'Cerrado los domingos';
                selectHorario.appendChild(opt);
                alert('⚠️ Los domingos no hay atención');
                return;
            }
            
            // Sábado
            if (dia === 6) {
                horarios = ['10:00', '11:00', '12:00', '13:00', '14:00'];
            } 
            // Lunes a Viernes
            else {
                horarios = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
            }
            
            console.log('⏰ Horarios a cargar:', horarios.length);
            
            // Opción por defecto
            const optDefault = document.createElement('option');
            optDefault.value = '';
            optDefault.textContent = 'Seleccioná un horario';
            selectHorario.appendChild(optDefault);
            
            // Cargar horarios
            horarios.forEach(function(hora) {
                const opt = document.createElement('option');
                opt.value = hora;
                opt.textContent = hora + ' hs';
                selectHorario.appendChild(opt);
                console.log('  ✓ Agregado:', hora);
            });
            
            // Habilitar
            selectHorario.disabled = false;
            console.log('✅ Select habilitado con', selectHorario.options.length, 'opciones');
        });
        
    } else {
        console.error('❌ NO SE ENCONTRARON LOS ELEMENTOS');
    }
    
    // ============================================
    // FORMULARIO
    // ============================================
    const form = document.getElementById('contactForm');
    
    if (form) {
        console.log('✅ Formulario encontrado');
        
        // Solo números en teléfono
        const tel = document.getElementById('telefono');
        if (tel) {
            tel.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '');
            });
        }
        
        // Submit
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Formulario enviado');
            
            const datos = {
                nombre: document.getElementById('nombre').value.trim(),
                email: document.getElementById('email').value.trim(),
                telefono: document.getElementById('telefono').value.trim(),
                fecha: document.getElementById('fecha').value,
                horario: document.getElementById('horario').value,
                motivo: document.getElementById('motivo').value.trim(),
                timestamp: new Date().toISOString()
            };
            
            console.log('Datos:', datos);
            
            // Validar
            if (!datos.nombre || !datos.email || !datos.telefono || !datos.fecha || !datos.horario) {
                alert('⚠️ Por favor completá todos los campos obligatorios');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
                alert('⚠️ Email inválido');
                return;
            }
            
            if (datos.telefono.length < 10) {
                alert('⚠️ Teléfono debe tener al menos 10 dígitos');
                return;
            }
            
            // Enviar
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = '⏳ Enviando...';
            
            fetch('guardar-turno.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            })
            .then(r => r.json())
            .then(data => {
                console.log('Respuesta:', data);
                
                if (data.success) {
                    alert('✅ ¡Turno guardado! Te contactaremos pronto.');
                    form.reset();
                    selectHorario.disabled = true;
                    selectHorario.innerHTML = '<option value="">Primero seleccioná una fecha</option>';
                } else {
                    alert('❌ Error: ' + (data.error || 'Desconocido'));
                }
            })
            .catch(err => {
                console.error('Error:', err);
                alert('❌ Error de conexión');
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = 'Enviar Solicitud';
            });
        });
    }
});
