# 📱 Integración NEXUS Chatbot con WhatsApp

Este documento explica cómo funciona el chatbot y cómo integrarlo con WhatsApp.

---

## 🧠 Arquitectura del Bot

### Flujo de Conversación

```
┌─────────────────┐
│    INICIO       │
│   (greeting)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ INTERÉS INICIAL │──────┐
│(initial_interest)│      │
└────────┬────────┘      │
         │               │
    ┌────┴────┐         │
    ▼         ▼         │
┌───────┐ ┌───────┐    │
│ Zonas │ │Ubicar │    │
└───┬───┘ └───┬───┘    │
    │         │        │
    └────┬────┘        │
         ▼             │
┌─────────────────┐    │
│   POST-ZONAS    │◄───┘
│  (post_zones)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CALIFICACIÓN   │
│  (qualifying)   │
│ 4 preguntas     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    CONTACTO     │
│(collecting_cont)│
│ nombre/tel/email│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    AGENDAR      │
│  (scheduling)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     CIERRE      │
│   (closing)     │
│ Lead guardado   │
└─────────────────┘
```

### Estados del Bot (`conversationState.stage`)

| Estado | Descripción | Siguiente Estado |
|--------|-------------|------------------|
| `greeting` | Inicio de conversación | `initial_interest` |
| `initial_interest` | Usuario ve opciones iniciales | `post_zones` o `qualifying` |
| `post_zones` | Después de mostrar zonas | `qualifying` o `collecting_contact` |
| `qualifying` | Preguntas de calificación (4) | `collecting_contact` |
| `pre_contact` | Antes de pedir datos | `collecting_contact` |
| `collecting_contact` | Pidiendo nombre/tel/email | `scheduling` |
| `scheduling` | Agendando visita | `closing` |
| `closing` | Conversación terminada | - |

---

## 📊 Estructura de Datos del Lead

```javascript
const leadData = {
  // Datos de contacto
  nombre: "string",
  telefono: "string (10 dígitos)",
  email: "string (validado)",
  
  // Necesidades del cliente
  superficie_requerida: "500-1,000 m² | 1,000-2,000 m² | 2,000-3,000 m² | Más de 3,000 m²",
  tipo_operacion: "Almacenaje/Bodega | Manufactura ligera | Logística/Distribución | Oficinas corporativas",
  urgencia: "Inmediato | 1-3 meses | 3-6 meses | Más de 6 meses",
  presupuesto: "$3-5 millones | $5-10 millones | $10-20 millones | Más de $20 millones",
  
  // Métricas
  leadScore: "number (0-100)",
  
  // Agendamiento
  fecha_preferida: "string",
  
  // Metadata
  timestamp: "ISO 8601 string",
  fecha_local: "string (es-MX)",
  origen: "chatbot_nexus",
  proyecto: "NEXUS Centro Logístico",
  asesora: "Judith Leal"
};
```

### Cálculo del Lead Score

| Criterio | Puntos |
|----------|--------|
| Superficie > 2,000 m² | +20 |
| Superficie > 1,000 m² | +10 |
| Urgencia: Inmediato | +25 |
| Urgencia: 1-3 meses | +15 |
| Presupuesto > $20 millones | +25 |
| Presupuesto > $10 millones | +15 |
| Presupuesto > $5 millones | +10 |
| Tipo: Logística/Distribución | +10 |
| Tipo: Manufactura | +5 |

---

## 🔌 Opciones de Integración con WhatsApp

### Opción 1: WhatsApp Business API (Oficial de Meta)

**Pros:**
- API oficial, más estable
- Permite mensajes masivos
- Plantillas aprobadas

**Contras:**
- Requiere aprobación de Meta
- Más complejo de configurar
- Costo por mensaje

**Implementación:**
```javascript
async function sendWhatsAppMessage(phone, message) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: `52${phone}`, // México
        type: 'text',
        text: { body: message }
      })
    }
  );
  return response.json();
}
```

### Opción 2: Twilio WhatsApp

**Pros:**
- Fácil de configurar
- Buena documentación
- API REST simple

**Contras:**
- Costo por mensaje
- Sandbox limitado

**Implementación:**
```javascript
const twilio = require('twilio');
const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

async function sendWhatsAppMessage(phone, message) {
  const msg = await client.messages.create({
    body: message,
    from: 'whatsapp:+14155238886',
    to: `whatsapp:+52${phone}`
  });
  return msg.sid;
}
```

### Opción 3: Make.com / Zapier (Sin código)

**Pros:**
- Sin programación
- Rápido de configurar
- Múltiples integraciones

**Contras:**
- Costo mensual
- Menos control

**Flujo en Make.com:**
1. **Webhook** ← Recibe datos del lead
2. **WhatsApp Business** ← Envía mensaje
3. **Google Sheets** ← Guarda registro
4. **Email** ← Notifica a Judith

### Opción 4: WATI.io / 360dialog

Plataformas todo-en-uno con:
- API de WhatsApp
- Chatbot integrado
- CRM básico
- Dashboard de conversaciones

---

## 🔄 Arquitectura Propuesta para WhatsApp

### Opción A: Bot Espejo (Duplicar lógica)

```
Usuario WhatsApp ────► API WhatsApp ────► Servidor Node.js ────► Lógica del Bot
                                                │
                                                ▼
                                          Base de Datos
                                                │
                                                ▼
                                          Google Sheets
```

**Código base para servidor Node.js:**

```javascript
// server.js
const express = require('express');
const app = express();

// Estado de conversaciones (en producción usar Redis/MongoDB)
const conversations = new Map();

// Configuración del bot (igual que en el HTML)
const NEXUS_CONFIG = {
  zonas: [...],
  financiamiento: {...},
  preguntasCalificacion: [...]
};

// Webhook para recibir mensajes de WhatsApp
app.post('/webhook', express.json(), async (req, res) => {
  const { from, body } = req.body; // Estructura depende del proveedor
  
  // Obtener o crear estado de conversación
  let state = conversations.get(from) || {
    stage: 'greeting',
    userData: {},
    currentQuestionIndex: 0,
    leadScore: 0
  };
  
  // Procesar mensaje
  const response = processMessage(body, state);
  
  // Actualizar estado
  conversations.set(from, state);
  
  // Enviar respuesta
  await sendWhatsAppMessage(from, response);
  
  res.sendStatus(200);
});

function processMessage(input, state) {
  // Lógica similar a processUserInput() del bot web
  switch (state.stage) {
    case 'greeting':
      return handleGreeting(state);
    case 'initial_interest':
      return handleInitialInterest(input, state);
    // ... etc
  }
}

app.listen(3000);
```

### Opción B: API Centralizada

```
┌─────────────────┐     ┌─────────────────┐
│   Web Chatbot   │────►│                 │
└─────────────────┘     │   API REST      │
                        │   (Node.js)     │
┌─────────────────┐     │                 │
│ WhatsApp Bot    │────►│  /process-msg   │
└─────────────────┘     │  /get-state     │
                        │  /save-lead     │
┌─────────────────┐     │                 │
│ Telegram (fut.) │────►│                 │
└─────────────────┘     └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   MongoDB /     │
                        │   PostgreSQL    │
                        └─────────────────┘
```

---

## 📝 Mensajes Adaptados para WhatsApp

### Mensaje de Bienvenida
```
¡Hola! 👋 Soy Judith Leal, tu asesora en *NEXUS Centro Logístico*.

📍 Parques industriales inteligentes en Manzanillo, Colima.

Terrenos desde 500m² hasta 3,000m² con ubicación estratégica única:
• A 2 min del nuevo Puerto de Manzanillo
• A 7 min de Autopista Manzanillo-Guadalajara

¿Qué te gustaría saber?

1️⃣ Ver zonas y precios
2️⃣ Ubicación
3️⃣ Agendar visita
```

### Mensaje de Zonas
```
💎 *NEXUS tiene 4 zonas:*

🏭 *Zona Industrial*
$5,000 MXN/m²
Ideal para operaciones pesadas

📦 *Zona Business*
$6,000 MXN/m²
Perfecta para distribución y ecommerce

🏢 *Zona Executive*
$7,500 MXN/m²
Imagen corporativa y oficinas

💎 *Zona Platinum*
$9,000 MXN/m²
Zona premium alto nivel

---
🎁 *PREVENTA:* Precios preferenciales
💰 *Desde:* $3,000,000 MXN

Responde:
1️⃣ Calcular inversión
2️⃣ Ver financiamiento
3️⃣ Agendar visita
```

### Mensaje de Confirmación de Visita
```
🎉 *¡Tu visita a NEXUS está confirmada!*

📅 *Fecha:* [fecha]
👤 *Nombre:* [nombre]
📞 *Teléfono:* [telefono]
📧 *Email:* [email]

Te contactaré para confirmar los detalles.

📍 *Ubicación:*
Carretera Laguna de Cuyutlán, Florida, 28809 Manzanillo, Colima

Ver en Maps: [link]
```

---

## 🛠 Implementación Paso a Paso

### Paso 1: Elegir Proveedor
Recomendado para empezar: **Twilio** o **Make.com**

### Paso 2: Configurar Webhook
El webhook recibe mensajes entrantes de WhatsApp

### Paso 3: Crear Servidor
Node.js o usar Make.com para lógica sin código

### Paso 4: Mapear Mensajes
Convertir los HTML a texto plano con formato WhatsApp

### Paso 5: Manejar Estado
Guardar estado de conversación por número de teléfono

### Paso 6: Conectar CRM
Enviar leads a Google Sheets, HubSpot, etc.

---

## 📞 ¿Necesitas ayuda?

Contacta para implementar:
- **Asesora**: Judith Leal
- **WhatsApp**: 341 170 7365
- **Email**: asesorajudithleal@gmail.com
