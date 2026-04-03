// ============================================
// BOT DE WHATSAPP - CONSULTORIOS RÍO PIEDRAS
// ============================================

const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

console.log('🚀 Iniciando bot de WhatsApp...');
console.log('📁 Directorio actual:', __dirname);

// ============================================
// CONFIGURACIÓN
// ============================================

// NÚMERO DE LA DOCTORA
const NUMERO_DOCTORA = '5491161365346'; // 0336 154-7080

// Archivos
const archivoTurnos = '../turnos.json';
const archivoEnviados = '../turnos-enviados.json';

// ============================================
// CLIENTE DE WHATSAPP
// ============================================

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './whatsapp-session'
    }),
    puppeteer: {
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// ============================================
// EVENTOS DEL BOT
// ============================================

client.on('loading_screen', (percent, message) => {
    console.log('⏳ Cargando WhatsApp Web:', percent + '%', message);
});

client.on('qr', (qr) => {
    console.log('\n========================================');
    console.log('📱 ESCANEÁ ESTE QR CON WHATSAPP:');
    console.log('========================================\n');
    qrcode.generate(qr, { small: true });
    console.log('\n========================================');
    console.log('💡 Abrí WhatsApp en tu celular');
    console.log('💡 Andá a: Menú > Dispositivos vinculados');
    console.log('💡 Tocá: Vincular un dispositivo');
    console.log('💡 Escaneá el QR que aparece arriba ☝️');
    console.log('========================================\n');
});

client.on('authenticated', () => {
    console.log('✅ Autenticación exitosa!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Error de autenticación:', msg);
});

client.on('ready', () => {
    console.log('\n========================================');
    console.log('✅ BOT CONECTADO Y FUNCIONANDO!');
    console.log('========================================');
    console.log('🔍 Monitoreando nuevos turnos cada 10 segundos...');
    console.log('📂 Buscando archivo:', archivoTurnos);
    console.log('📱 Número de la doctora:', NUMERO_DOCTORA);
    console.log('========================================\n');
    
    // Verificar turnos cada 10 segundos
    setInterval(() => {
        verificarNuevosTurnos();
    }, 10000);
    
    // Verificar inmediatamente al iniciar
    setTimeout(() => {
        console.log('🔍 Primera verificación de turnos...');
        verificarNuevosTurnos();
    }, 2000);
});

client.on('disconnected', (reason) => {
    console.log('⚠️ Bot desconectado:', reason);
});

// ============================================
// FUNCIÓN: VERIFICAR NUEVOS TURNOS
// ============================================
async function verificarNuevosTurnos() {
    try {
        console.log('🔍 Verificando turnos...', new Date().toLocaleTimeString());
        
        if (!fs.existsSync(archivoTurnos)) {
            console.log('⚠️ Archivo turnos.json no existe todavía');
            return;
        }
        
        const contenido = fs.readFileSync(archivoTurnos, 'utf8');
        const turnos = JSON.parse(contenido);
        
        console.log('📊 Total de turnos en archivo:', turnos.length);
        
        if (!turnos || turnos.length === 0) {
            console.log('⚠️ No hay turnos en el archivo');
            return;
        }
        
        // Leer turnos enviados
        let turnosEnviados = [];
        if (fs.existsSync(archivoEnviados)) {
            const enviados = fs.readFileSync(archivoEnviados, 'utf8');
            turnosEnviados = JSON.parse(enviados);
        }
        
        // Buscar turnos nuevos
        for (const turno of turnos) {
            if (!turnosEnviados.includes(turno.id)) {
                console.log(`\n🆕 NUEVO TURNO DETECTADO!`);
                console.log(`   ID: ${turno.id}`);
                console.log(`   Nombre: ${turno.nombre}`);
                console.log(`   Teléfono: ${turno.telefono}`);
                console.log(`   Fecha: ${turno.fecha} ${turno.horario}`);
                
                // Enviar mensaje al PACIENTE
                const enviadoPaciente = await enviarMensajePaciente(turno);
                
                // Enviar mensaje a la DOCTORA
                const enviadoDoctora = await enviarMensajeDoctora(turno);
                
                if (enviadoPaciente || enviadoDoctora) {
                    // Marcar como enviado
                    turnosEnviados.push(turno.id);
                    fs.writeFileSync(archivoEnviados, JSON.stringify(turnosEnviados, null, 2));
                    console.log(`✅ Turno ${turno.id} procesado\n`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Error al verificar turnos:', error.message);
    }
}

// ============================================
// FUNCIÓN: MENSAJE AL PACIENTE
// ============================================
async function enviarMensajePaciente(turno) {
    try {
        console.log(`\n📤 ENVIANDO MENSAJE AL PACIENTE: ${turno.nombre}`);
        
        // Normalizar número
        let numero = normalizarNumero(turno.telefono);
        
        if (!numero) {
            console.error(`❌ Número inválido: ${turno.telefono}`);
            return false;
        }
        
        const chatId = numero + '@c.us';
        console.log(`   Chat ID paciente: ${chatId}`);
        
        // Verificar si existe en WhatsApp
        try {
            const existe = await client.isRegisteredUser(chatId);
            if (!existe) {
                console.error(`❌ El número ${numero} NO está en WhatsApp`);
                return false;
            }
            console.log(`   ✅ Número verificado en WhatsApp`);
        } catch (e) {
            console.warn(`   ⚠️ No se pudo verificar, intentando enviar...`);
        }
        
        // Crear mensaje
        const fechaFormateada = formatearFecha(turno.fecha);
        
        const mensaje = `
Hola ${turno.nombre}! 👋

✅ *Recibimos tu solicitud de turno*

📋 *Detalles de tu solicitud:*
📅 Fecha: *${fechaFormateada}*
🕐 Horario: *${turno.horario} hs*
${turno.motivo ? `📝 Motivo: ${turno.motivo}\n` : ''}

🔔 *Próximos pasos:*
Te confirmaremos tu turno a la brevedad por este medio. En caso de no poder atenderte en el horario solicitado, te ofreceremos alternativas.

📍 *Consultorios Río Piedras*
Río Piedras 372 - Planta 3, Consultorio D
Morón, Buenos Aires

⚠️ *Política de cancelación:*
Los turnos deben cancelarse con 24 horas de anticipación.

📞 *Consultas:*
Podés escribirnos por este número para cualquier duda.

*PORQUE TU SALUD MENTAL NOS IMPORTA* 💙

_Dra. María Laura Hernández Rico_
_Especialista en Psiquiatría y Psicología Médica_
        `.trim();
        
        // Enviar
        await client.sendMessage(chatId, mensaje);
        console.log(`✅ Mensaje enviado al paciente: ${turno.nombre}`);
        
        return true;
        
    } catch (error) {
        console.error(`❌ Error al enviar mensaje al paciente:`, error.message);
        return false;
    }
}

// ============================================
// FUNCIÓN: MENSAJE A LA DOCTORA
// ============================================
async function enviarMensajeDoctora(turno) {
    try {
        console.log(`\n📤 ENVIANDO NOTIFICACIÓN A LA DOCTORA`);
        
        const chatIdDoctora = NUMERO_DOCTORA + '@c.us';
        console.log(`   Chat ID doctora: ${chatIdDoctora}`);
        
        // Crear mensaje para la doctora
        const fechaFormateada = formatearFecha(turno.fecha);
        
        const mensaje = `
🔔 *NUEVA SOLICITUD DE TURNO*

👤 *Paciente:* ${turno.nombre}
📧 *Email:* ${turno.email}
📱 *Teléfono:* ${turno.telefono}

📅 *Fecha solicitada:* ${fechaFormateada}
🕐 *Horario:* ${turno.horario} hs

${turno.motivo ? `📝 *Motivo de consulta:*\n${turno.motivo}\n` : ''}

⏰ *Recibido:* ${turno.fecha_registro}
🆔 *ID:* ${turno.id}

_Solicitud registrada en el sistema._
_Ya se envió confirmación al paciente._
        `.trim();
        
        // Enviar
        await client.sendMessage(chatIdDoctora, mensaje);
        console.log(`✅ Notificación enviada a la doctora`);
        
        return true;
        
    } catch (error) {
        console.error(`❌ Error al enviar mensaje a la doctora:`, error.message);
        return false;
    }
}

// ============================================
// FUNCIÓN: NORMALIZAR NÚMERO
// ============================================
function normalizarNumero(telefono) {
    // Limpiar
    let numero = telefono.replace(/\D/g, '');
    
    if (numero.length < 10) {
        return null;
    }
    
    // Si empieza con 15, cambiar a código de área
    if (numero.startsWith('15')) {
        // Asumimos Buenos Aires (11)
        numero = '11' + numero.substring(2);
    }
    
    // Quitar 0 inicial
    if (numero.startsWith('0')) {
        numero = numero.substring(1);
    }
    
    // Agregar código de país Argentina
    if (!numero.startsWith('549')) {
        numero = '549' + numero;
    }
    
    return numero;
}

// ============================================
// FUNCIÓN: FORMATEAR FECHA
// ============================================
function formatearFecha(fecha) {
    const fechaObj = new Date(fecha + 'T12:00:00');
    return fechaObj.toLocaleDateString('es-AR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ============================================
// INICIAR BOT
// ============================================
client.initialize().catch(err => {
    console.error('❌ Error al inicializar el bot:', err);
});

console.log('⏳ Esperando conexión con WhatsApp Web...\n');
