// ============================================
// APPS SCRIPT NEXUS - Con Claude API (Anthropic)
// ============================================

// CONFIGURACIÓN - Completa estos datos
const TWILIO_ACCOUNT_SID = 'TU_ACCOUNT_SID_AQUI';
const TWILIO_AUTH_TOKEN = 'TU_AUTH_TOKEN_AQUI';
const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'; // Número de prueba de Twilio
const CLAUDE_API_KEY = 'TU_CLAUDE_API_KEY_AQUI'; // Obten en console.anthropic.com

// ============================================
// FUNCIÓN PRINCIPAL - Recibe leads del chatbot web
// ============================================

function doPost(e) {
  try {
    // Si viene de Twilio (mensaje WhatsApp del cliente)
    if (e.parameter && e.parameter.From) {
      return procesarMensajeWhatsApp(e);
    }
    
    // Si viene del chatbot web (nuevo lead)
    if (e.postData && e.postData.contents) {
      return guardarLeadYEnviarWhatsApp(e);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: 'Tipo de request no reconocido'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    Logger.log('Error en doPost: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// GUARDAR LEAD Y ENVIAR WHATSAPP INICIAL
// ============================================

function guardarLeadYEnviarWhatsApp(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Calcular prioridad
    var prioridad = '';
    if (data.leadScore >= 70) {
      prioridad = '🔥 ALTA';
    } else if (data.leadScore >= 50) {
      prioridad = '⚡ MEDIA';
    } else {
      prioridad = '📌 NORMAL';
    }
    
    // Guardar en Google Sheets
    var row = [
      data.timestamp || new Date().toISOString(),
      data.fecha_local || new Date().toLocaleString('es-MX'),
      data.nombre || '',
      data.telefono || '',
      data.email || '',
      data.superficie_requerida || '',
      data.tipo_operacion || '',
      data.urgencia || '',
      data.presupuesto || '',
      data.fecha_preferida || '',
      data.leadScore || 0,
      prioridad,
      data.proyecto || 'NEXUS Centro Logístico',
      data.asesora || 'Judith Leal',
      data.origen || 'chatbot_nexus_v2'
    ];
    
    sheet.appendRow(row);
    
    var lastRow = sheet.getLastRow();
    
    // Colorear según prioridad
    if (data.leadScore >= 70) {
      sheet.getRange(lastRow, 1, 1, 15).setBackground('#fee2e2');
    } else if (data.leadScore >= 50) {
      sheet.getRange(lastRow, 1, 1, 15).setBackground('#fef3c7');
    } else {
      sheet.getRange(lastRow, 1, 1, 15).setBackground('#f0f9ff');
    }
    
    // 🆕 ENVIAR WHATSAPP AUTOMÁTICO
    enviarMensajeWhatsAppInicial(data);
    
    // Email para leads prioritarios
    if (data.leadScore >= 70) {
      var emailBody = 
        '🔥 LEAD PRIORITARIO - NEXUS\n\n' +
        'Nombre: ' + data.nombre + '\n' +
        'Teléfono: ' + data.telefono + '\n' +
        'Email: ' + data.email + '\n' +
        'Superficie: ' + data.superficie_requerida + '\n' +
        'Presupuesto: ' + data.presupuesto + '\n' +
        'Urgencia: ' + data.urgencia + '\n' +
        'Lead Score: ' + data.leadScore + '/100\n\n' +
        'Fecha de visita: ' + data.fecha_preferida + '\n\n' +
        '⚡ WhatsApp automático enviado al cliente\n' +
        '🤖 Sistema de IA activado para responder dudas';
      
      MailApp.sendEmail({
        to: 'asesorajudithleal@gmail.com',
        subject: '🔥 LEAD PRIORITARIO - ' + data.nombre,
        body: emailBody
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      row: lastRow,
      whatsapp_sent: true
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    Logger.log('Error guardando lead: ' + error);
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// ENVIAR PRIMER MENSAJE DE WHATSAPP
// ============================================

function enviarMensajeWhatsAppInicial(leadData) {
  var telefono = leadData.telefono.replace(/\D/g, '');
  var whatsappNumber = 'whatsapp:+52' + telefono;
  
  var mensaje = 
    '¡Hola ' + leadData.nombre + '! 👋\n\n' +
    'Soy el asistente virtual de *NEXUS Centro Logístico*.\n\n' +
    '✅ Recibimos tu solicitud para:\n' +
    '📏 Superficie: ' + (leadData.superficie_requerida || 'Por definir') + '\n' +
    '💼 Uso: ' + (leadData.tipo_operacion || 'Por definir') + '\n' +
    '💰 Presupuesto: ' + (leadData.presupuesto || 'Por definir') + '\n' +
    '📅 Visita: ' + (leadData.fecha_preferida || 'Por coordinar') + '\n\n' +
    'Judith te contactará pronto para confirmar.\n\n' +
    'Mientras tanto, puedo responder cualquier duda sobre NEXUS. ¿Qué te gustaría saber? 😊';
  
  enviarWhatsApp(whatsappNumber, mensaje);
  
  guardarContextoLead(telefono, leadData);
}

// ============================================
// ENVIAR WHATSAPP VÍA TWILIO
// ============================================

function enviarWhatsApp(to, mensaje) {
  var url = 'https://api.twilio.com/2010-04-01/Accounts/' + TWILIO_ACCOUNT_SID + '/Messages.json';
  
  var payload = {
    'From': TWILIO_WHATSAPP_NUMBER,
    'To': to,
    'Body': mensaje
  };
  
  var options = {
    'method': 'post',
    'payload': payload,
    'headers': {
      'Authorization': 'Basic ' + Utilities.base64Encode(TWILIO_ACCOUNT_SID + ':' + TWILIO_AUTH_TOKEN)
    },
    'muteHttpExceptions': true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log('WhatsApp enviado: ' + response.getContentText());
    return true;
  } catch(error) {
    Logger.log('Error enviando WhatsApp: ' + error);
    return false;
  }
}

// ============================================
// WEBHOOK - Recibe respuestas del lead por WhatsApp
// ============================================

function procesarMensajeWhatsApp(e) {
  try {
    var from = e.parameter.From;
    var body = e.parameter.Body;
    var telefono = from.replace('whatsapp:+52', '');
    
    var contextoLead = obtenerContextoLead(telefono);
    
    var respuesta = generarRespuestaConClaude(body, contextoLead);
    
    enviarWhatsApp(from, respuesta);
    
    return ContentService.createTextOutput('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
      .setMimeType(ContentService.MimeType.XML);
    
  } catch(error) {
    Logger.log('Error procesando mensaje WhatsApp: ' + error);
    return ContentService.createTextOutput('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
      .setMimeType(ContentService.MimeType.XML);
  }
}

// ============================================
// GENERAR RESPUESTA CON CLAUDE API (ANTHROPIC)
// ============================================

function generarRespuestaConClaude(pregunta, contextoLead) {
  var url = 'https://api.anthropic.com/v1/messages';
  
  var systemPrompt = `Eres el asistente virtual de NEXUS Centro Logístico en Manzanillo, Colima.

INFORMACIÓN DE NEXUS:
- Ubicación: Carretera Laguna de Cuyutlán, Florida, 28809 Manzanillo, Colima
- A 2 minutos del nuevo Puerto de Manzanillo (Vaso 2)
- A 7 minutos de Autopista Manzanillo-Guadalajara
- 34 lotes disponibles de 500 m² a 3,000 m²

5 ZONAS DISPONIBLES:
1. Zona Business: $6,000 MXN/m² (esquina $6,600/m²) - Distribución y ecommerce
2. Zona Executive: $7,500 MXN/m² (esquina $8,000/m²) - Imagen corporativa
3. Zona Platinum: $9,000 MXN/m² - Premium alto nivel
4. Patio de Maniobras Executive: $5,000 MXN/m² - Operaciones logísticas
5. Zona Logistics: $5,000 MXN/m² - Área logística especializada

Infraestructura: Business Center, comedores, áreas de descanso, sistema contra incendios, salas de capacitación, seguridad 24/7, accesos controlados

Financiamiento:
- Contado: Promoción negociable + Ratificación notarial GRATIS (ahorro $2,000)
- Financiado: 48 meses, 50% enganche, 12% anual, ratificación $2,000
- Preventa con precios preferenciales
- Incrementos cada 6 meses aprox

Contacto: Judith Leal - WhatsApp: 341 170 7365
Horario: Lun-Vie 9:00-18:00 | Sáb-Dom 9:00-14:00

DATOS DEL LEAD:
${JSON.stringify(contextoLead, null, 2)}

INSTRUCCIONES:
- Responde en español de manera amigable y profesional
- Respuestas MUY CORTAS (máximo 3-4 líneas para WhatsApp)
- Usa emojis moderadamente (1-2 por mensaje)
- Si preguntan por Judith, menciona que la contactarás
- Si piden agendar, confirma que Judith los contactará pronto
- Si preguntan por zonas, da precios pero siempre menciona que hay más opciones
- Mantén el foco en NEXUS y sus beneficios
- NUNCA inventes información que no esté arriba`;

  var payload = {
    'model': 'claude-3-5-sonnet-20241022',
    'max_tokens': 200,
    'messages': [
      {
        'role': 'user',
        'content': pregunta
      }
    ],
    'system': systemPrompt
  };
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': {
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    'payload': JSON.stringify(payload),
    'muteHttpExceptions': true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());
    
    Logger.log('Respuesta de Claude: ' + response.getContentText());
    
    if (json.content && json.content[0]) {
      return json.content[0].text;
    } else if (json.error) {
      Logger.log('Error de Claude API: ' + JSON.stringify(json.error));
      return 'Disculpa, tuve un problema técnico. Judith te contactará pronto. Para dudas urgentes: 341 170 7365 📞';
    } else {
      return 'Disculpa, no pude procesar tu mensaje. Judith te contactará pronto. WhatsApp: 341 170 7365 📞';
    }
  } catch(error) {
    Logger.log('Error llamando a Claude API: ' + error);
    return 'Disculpa, tuve un problema técnico. Judith te contactará pronto. Para dudas urgentes: 341 170 7365 📞';
  }
}

// ============================================
// GUARDAR Y OBTENER CONTEXTO DEL LEAD
// ============================================

function guardarContextoLead(telefono, leadData) {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('lead_' + telefono, JSON.stringify(leadData));
}

function obtenerContextoLead(telefono) {
  var props = PropertiesService.getScriptProperties();
  var data = props.getProperty('lead_' + telefono);
  
  if (data) {
    return JSON.parse(data);
  }
  return {
    nombre: 'Cliente',
    observacion: 'Lead sin contexto previo en el chatbot web'
  };
}

// ============================================
// FUNCIÓN DE PRUEBA
// ============================================

function testWhatsApp() {
  var testData = {
    nombre: 'Test Usuario',
    telefono: '3311112222', // CAMBIA POR TU NÚMERO PARA PROBAR
    email: 'test@ejemplo.com',
    superficie_requerida: '1,000-2,000 m²',
    tipo_operacion: 'Logística/Distribución',
    urgencia: 'Inmediato',
    presupuesto: '$10-20 millones',
    fecha_preferida: 'Esta semana',
    leadScore: 85
  };
  
  enviarMensajeWhatsAppInicial(testData);
  Logger.log('Mensaje de prueba enviado a ' + testData.telefono);
}

function testClaudeAPI() {
  var respuesta = generarRespuestaConClaude(
    '¿Cuánto cuesta la zona Business?',
    {
      nombre: 'Test',
      presupuesto: '$10-20 millones'
    }
  );
  
  Logger.log('Respuesta de Claude: ' + respuesta);
}
