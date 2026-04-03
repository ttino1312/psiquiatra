// ============================================
// BOT DE WHATSAPP - CONSULTORIOS RÍO PIEDRAS
// ============================================

const fs = require('fs');
<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(cors());
app.use(express.json());

=======
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
console.log('🚀 Iniciando bot de WhatsApp...');
console.log('📁 Directorio actual:', __dirname);

// ============================================
// CONFIGURACIÓN
// ============================================

<<<<<<< HEAD
const NUMERO_DOCTORA = '5491161647080';

const archivoTurnos = './turnos.json';
const archivoEnviados = './turnos-enviados.json';

// ============================================
// API REST - RECIBIR TURNOS DEL FORMULARIO
// ============================================

app.post('/api/turno', (req, res) => {
    try {
        const turno = req.body;

        console.log('\n🆕 TURNO RECIBIDO DESDE EL FORMULARIO:');
        console.log('   Nombre:', turno.nombre);
        console.log('   Teléfono:', turno.telefono);
        console.log('   Servicio:', turno.servicio);
        console.log('   Fecha:', turno.fecha, '|', turno.horario);

        // Leer turnos existentes
        let turnos = [];
        if (fs.existsSync(archivoTurnos)) {
            const contenido = fs.readFileSync(archivoTurnos, 'utf8');
            turnos = JSON.parse(contenido);
        }

        // Agregar nuevo turno
        turnos.push(turno);

        // Guardar en turnos.json
        fs.writeFileSync(archivoTurnos, JSON.stringify(turnos, null, 2));
        console.log('✅ Turno guardado en turnos.json - ID:', turno.id);

        res.json({ ok: true, id: turno.id });

    } catch (error) {
        console.error('❌ Error al guardar turno:', error.message);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Iniciar servidor API
app.listen(3001, () => {
    console.log('🌐 Servidor API corriendo en http://localhost:3001');
    console.log('📬 Endpoint listo: POST http://localhost:3001/api/turno');
});
=======
// NÚMERO DE LA DOCTORA
const NUMERO_DOCTORA = '5491161365346'; // 0336 154-7080

// Archivos
const archivoTurnos = '../turnos.json';
const archivoEnviados = '../turnos-enviados.json';
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f

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
<<<<<<< HEAD
    console.log('📱 Número de la doctora:', NUMERO_DOCTORA);
    console.log('========================================\n');

    setInterval(() => {
        verificarNuevosTurnos();
    }, 10000);

=======
    console.log('📂 Buscando archivo:', archivoTurnos);
    console.log('📱 Número de la doctora:', NUMERO_DOCTORA);
    console.log('========================================\n');
    
    // Verificar turnos cada 10 segundos
    setInterval(() => {
        verificarNuevosTurnos();
    }, 10000);
    
    // Verificar inmediatamente al iniciar
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
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
<<<<<<< HEAD

async function verificarNuevosTurnos() {
    try {
        if (!fs.existsSync(archivoTurnos)) {
            return;
        }

        const contenido = fs.readFileSync(archivoTurnos, 'utf8');
        const turnos = JSON.parse(contenido);

        if (!turnos || turnos.length === 0) return;

=======
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
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
        let turnosEnviados = [];
        if (fs.existsSync(archivoEnviados)) {
            const enviados = fs.readFileSync(archivoEnviados, 'utf8');
            turnosEnviados = JSON.parse(enviados);
        }
<<<<<<< HEAD

        for (const turno of turnos) {
            if (!turnosEnviados.includes(turno.id)) {
                console.log(`\n🆕 PROCESANDO TURNO: ${turno.nombre} - ${turno.fecha}`);

                const enviadoPaciente = await enviarMensajePaciente(turno);
                const enviadoDoctora = await enviarMensajeDoctora(turno);

                if (enviadoPaciente || enviadoDoctora) {
                    turnosEnviados.push(turno.id);
                    fs.writeFileSync(archivoEnviados, JSON.stringify(turnosEnviados, null, 2));
                    console.log(`✅ Turno ${turno.id} procesado y marcado como enviado\n`);
                }
            }
        }

=======
        
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
        
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
    } catch (error) {
        console.error('❌ Error al verificar turnos:', error.message);
    }
}

// ============================================
// FUNCIÓN: MENSAJE AL PACIENTE
// ============================================
<<<<<<< HEAD

async function enviarMensajePaciente(turno) {
    try {
        console.log(`📤 Enviando confirmación al paciente: ${turno.nombre}`);

        let numero = normalizarNumero(turno.telefono);
=======
async function enviarMensajePaciente(turno) {
    try {
        console.log(`\n📤 ENVIANDO MENSAJE AL PACIENTE: ${turno.nombre}`);
        
        // Normalizar número
        let numero = normalizarNumero(turno.telefono);
        
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
        if (!numero) {
            console.error(`❌ Número inválido: ${turno.telefono}`);
            return false;
        }
<<<<<<< HEAD

        const chatId = numero + '@c.us';

        try {
            const existe = await client.isRegisteredUser(chatId);
            if (!existe) {
                console.error(`❌ El número ${numero} no está registrado en WhatsApp`);
                return false;
            }
        } catch (e) {
            console.warn(`⚠️ No se pudo verificar el número, intentando enviar de todas formas...`);
        }

        const fechaFormateada = formatearFecha(turno.fecha);

        const mensaje = `Hola ${turno.nombre}! 👋
=======
        
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
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f

✅ *Recibimos tu solicitud de turno*

📋 *Detalles de tu solicitud:*
<<<<<<< HEAD
🩺 Servicio: *${turno.servicio}*
📍 Modalidad: *${turno.modalidad}*
📅 Fecha: *${fechaFormateada}*
🕐 Horario: *${turno.horario}*
${turno.motivo ? `💬 Mensaje: ${turno.motivo}\n` : ''}
🔔 *Próximos pasos:*
Te confirmaremos tu turno a la brevedad por este medio. En caso de no poder atenderte en ese horario, te ofreceremos alternativas.
=======
📅 Fecha: *${fechaFormateada}*
🕐 Horario: *${turno.horario} hs*
${turno.motivo ? `📝 Motivo: ${turno.motivo}\n` : ''}

🔔 *Próximos pasos:*
Te confirmaremos tu turno a la brevedad por este medio. En caso de no poder atenderte en el horario solicitado, te ofreceremos alternativas.
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f

📍 *Consultorios Río Piedras*
Río Piedras 372 - Planta 3, Consultorio D
Morón, Buenos Aires

⚠️ *Política de cancelación:*
<<<<<<< HEAD
Los turnos deben cancelarse con al menos 24 horas de anticipación.

_Dra. María Laura Hernández Rico_
_Especialista en Psiquiatría y Psicología Médica_ 💙`;

        await client.sendMessage(chatId, mensaje);
        console.log(`✅ Confirmación enviada a: ${turno.nombre} (${numero})`);
        return true;

    } catch (error) {
        console.error(`❌ Error al enviar al paciente:`, error.message);
=======
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
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
        return false;
    }
}

// ============================================
// FUNCIÓN: MENSAJE A LA DOCTORA
// ============================================
<<<<<<< HEAD

async function enviarMensajeDoctora(turno) {
    try {
        console.log(`📤 Enviando notificación a la Dra. Laura`);

        const chatIdDoctora = NUMERO_DOCTORA + '@c.us';
        const fechaFormateada = formatearFecha(turno.fecha);

        const mensaje = `🔔 *NUEVA SOLICITUD DE TURNO*

👤 *Paciente:* ${turno.nombre}
📱 *Teléfono:* ${turno.telefono}
${turno.email ? `📧 *Email:* ${turno.email}\n` : ''}
🩺 *Servicio:* ${turno.servicio}
📍 *Modalidad:* ${turno.modalidad}
📅 *Fecha solicitada:* ${fechaFormateada}
🕐 *Horario:* ${turno.horario}
${turno.motivo ? `\n💬 *Mensaje del paciente:*\n${turno.motivo}\n` : ''}
⏰ *Recibido:* ${turno.fecha_registro}
🆔 *ID:* ${turno.id}

_El paciente ya recibió la confirmación automática._`;

        await client.sendMessage(chatIdDoctora, mensaje);
        console.log(`✅ Notificación enviada a la Dra. Laura`);
        return true;

    } catch (error) {
        console.error(`❌ Error al enviar a la doctora:`, error.message);
=======
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
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
        return false;
    }
}

// ============================================
// FUNCIÓN: NORMALIZAR NÚMERO
// ============================================
<<<<<<< HEAD

function normalizarNumero(telefono) {
    let numero = telefono.replace(/\D/g, '');

    if (numero.length < 10) return null;

    if (numero.startsWith('15')) {
        numero = '11' + numero.substring(2);
    }

    if (numero.startsWith('0')) {
        numero = numero.substring(1);
    }

    if (!numero.startsWith('549')) {
        numero = '549' + numero;
    }

=======
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
    
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
    return numero;
}

// ============================================
// FUNCIÓN: FORMATEAR FECHA
// ============================================
<<<<<<< HEAD

function formatearFecha(fecha) {
    const fechaObj = new Date(fecha + 'T12:00:00');
    return fechaObj.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
=======
function formatearFecha(fecha) {
    const fechaObj = new Date(fecha + 'T12:00:00');
    return fechaObj.toLocaleDateString('es-AR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
    });
}

// ============================================
// INICIAR BOT
// ============================================
<<<<<<< HEAD

client.initialize().catch(err => {
    console.error('❌ Error al inicializar:', err);
=======
client.initialize().catch(err => {
    console.error('❌ Error al inicializar el bot:', err);
>>>>>>> 33da1a933a6036f236ec12198ad321aea738e03f
});

console.log('⏳ Esperando conexión con WhatsApp Web...\n');
