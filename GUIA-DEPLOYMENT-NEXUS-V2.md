# 🚀 GUÍA DE DEPLOYMENT - NEXUS V2
## Chatbot + WhatsApp con Claude IA + Google Sheets + Meta Ads

---

## 📦 ARCHIVOS QUE RECIBES

1. **NEXUS-Chatbot-V2-Completo.html** - Chatbot web actualizado
2. **nexus-mapa-plano.jpg** - Imagen del mapa del proyecto
3. **Apps-Script-NEXUS-Claude-API.gs** - Script para Google Sheets
4. **GUIA-DEPLOYMENT-NEXUS-V2.md** - Este archivo

---

## ✨ NOVEDADES EN V2

### **Actualizaciones del Proyecto:**
- ✅ **5 zonas** (eliminada zona Industrial/Azul - vendida)
  - Zona Business: $6,000/m² (esquina $6,600/m²)
  - Zona Executive: $7,500/m² (esquina $8,000/m²)
  - Zona Platinum: $9,000/m²
  - Patio de Maniobras Executive: $5,000/m²
  - Zona Logistics: $5,000/m²

### **Nuevas Funcionalidades:**
- ✅ **Mapa interactivo** del proyecto visible en el chat
- ✅ **WhatsApp automático** con Claude IA (en lugar de OpenAI)
- ✅ **Respuestas inteligentes** 24/7 por WhatsApp
- ✅ **Google Sheets** para captura de leads
- ✅ **Preparado para Meta Ads** (exportación de audiencias)

---

## 🎯 PASO 1: SUBIR EL CHATBOT

### **Opción A: Hostgator (Ya tienes)**

1. Accede a tu cPanel de Hostgator
2. Ve a **File Manager**
3. Navega a `public_html/`
4. Sube el archivo `NEXUS-Chatbot-V2-Completo.html`
5. Renómbralo a `index.html` (reemplaza el actual)
6. Sube también `nexus-mapa-plano.jpg` al mismo directorio

### **Opción B: GitHub Pages (Gratis)**

```bash
# 1. Crear repositorio en GitHub
# 2. Subir los archivos
git add NEXUS-Chatbot-V2-Completo.html nexus-mapa-plano.jpg
git commit -m "NEXUS V2 con mapa y Claude IA"
git push

# 3. Activar GitHub Pages en Settings
# Tu sitio estará en: tuusuario.github.io/nexus
```

### **✏️ IMPORTANTE:**

Abre `NEXUS-Chatbot-V2-Completo.html` y en la línea 14, cambia:

```javascript
const NEXUS_MAP_URL = 'nexus-mapa-plano.jpg';
```

Por la URL completa donde subiste la imagen:

```javascript
const NEXUS_MAP_URL = 'https://tudominio.com/nexus-mapa-plano.jpg';
```

---

## 📊 PASO 2: CONFIGURAR GOOGLE SHEETS

### **2.1 Crear la Hoja**

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea nueva hoja: **"NEXUS - Leads V2"**
3. En la **fila 1**, escribe estos encabezados:

```
Timestamp | Fecha_Local | Nombre | Telefono | Email | Superficie | Tipo_Operacion | Urgencia | Presupuesto | Fecha_Visita | Lead_Score | Prioridad | Proyecto | Asesora | Origen
```

### **2.2 Crear el Apps Script**

1. En tu Google Sheet: **Extensiones** → **Apps Script**
2. Borra todo el código que aparece
3. Copia y pega el contenido de `Apps-Script-NEXUS-Claude-API.gs`
4. **Guardar** (Ctrl+S)

### **2.3 Configurar las Credenciales**

En el Apps Script, líneas 6-9, completa:

```javascript
const TWILIO_ACCOUNT_SID = 'ACxxxxxxxx'; // De Twilio Console
const TWILIO_AUTH_TOKEN = 'xxxxxxxx'; // De Twilio Console
const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886'; // Número Twilio
const CLAUDE_API_KEY = 'sk-ant-xxxxx'; // De console.anthropic.com
```

### **2.4 Implementar el Script**

1. En Apps Script → **Implementar** → **Nueva implementación**
2. Tipo: **Aplicación web**
3. Configurar:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
4. **Implementar**
5. **COPIAR LA URL** (algo como `https://script.google.com/macros/s/ABC.../exec`)

### **2.5 Conectar con el Chatbot**

En `NEXUS-Chatbot-V2-Completo.html`, línea ~900:

```javascript
const GOOGLE_SHEETS_URL = 'PEGA_AQUI_TU_URL_DEL_SCRIPT';
```

---

## 📱 PASO 3: CONFIGURAR TWILIO (WhatsApp)

### **3.1 Crear Cuenta Twilio**

1. Ve a [twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. **Sign up** (gratis - te dan $15 USD)
3. Verifica tu email y teléfono
4. Anota:
   - **Account SID**
   - **Auth Token** (clic en "Show")

### **3.2 Activar WhatsApp Sandbox**

1. En Twilio Console → **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Número de prueba: `+1 415 523 8886`
3. Sigue instrucciones para conectar TU WhatsApp:
   - Envía: `join [código]` al número de Twilio
   - Ejemplo: `join shadow-mountain`
4. Recibirás confirmación

### **3.3 Configurar Webhook**

1. Twilio Console → **Messaging** → **Settings** → **WhatsApp Sandbox Settings**
2. En **"When a message comes in":**
   - Pega tu URL de Apps Script (la del paso 2.4)
   - Método: **HTTP POST**
3. **Save**

---

## 🤖 PASO 4: CONFIGURAR CLAUDE API

### **4.1 Obtener API Key**

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. **Sign up** o **Log in**
3. Ve a **API Keys**
4. **Create Key**
5. Copia la key: `sk-ant-xxxxxxxxxxxxx`

### **4.2 Agregar Crédito**

1. En console.anthropic.com → **Settings** → **Billing**
2. Agrega $5-10 USD de crédito
3. Con $5 USD tienes para ~2,500 conversaciones

### **4.3 Costo Estimado**

| Concepto | Costo |
|----------|-------|
| Claude API | ~$0.002 por conversación |
| Twilio WhatsApp | ~$0.005 por mensaje |
| **Total por lead** | **~$0.01 USD** |

**Para 100 leads/mes = ~$1 USD/mes** 🎉

---

## 🧪 PASO 5: PROBAR EL SISTEMA

### **Test 1: Chatbot Web**

1. Abre tu sitio web
2. Haz clic en el botón del chat 🏭
3. Completa el flujo:
   - Ver zonas → Ver mapa → Calcular inversión
   - Ingresa datos: nombre, teléfono, email
   - Agenda visita

### **Test 2: Google Sheets**

1. Abre tu Google Sheet
2. Deberías ver una nueva fila con los datos
3. Color de fondo según prioridad:
   - Rojo = Prioritario (score ≥70)
   - Amarillo = Medio (score 50-69)
   - Azul = Normal (score <50)

### **Test 3: WhatsApp Automático**

1. Deberías recibir WhatsApp en tu número
2. Mensaje inicial del bot
3. Responde algo: "¿Cuál es el precio de la zona Business?"
4. El bot debe responder automáticamente con Claude IA

### **Test 4: Apps Script (Manual)**

1. En Apps Script → Función: `testWhatsApp`
2. **Importante:** Cambia el teléfono (línea 234) por el tuyo
3. **Ejecutar** ▶️
4. Deberías recibir WhatsApp de prueba

---

## 📈 PASO 6: META ADS - AUDIENCIAS PERSONALIZADAS

### **6.1 Exportar Leads de Google Sheets**

1. En Google Sheets → **Archivo** → **Descargar** → **CSV**
2. Se descarga un archivo `NEXUS-Leads-V2.csv`

### **6.2 Subir a Meta Ads**

1. Ve a [Meta Business Suite](https://business.facebook.com)
2. **Audiencias** → **Crear audiencia** → **Audiencia personalizada**
3. **Lista de clientes**
4. Sube el CSV con columnas:
   - Email
   - Teléfono
   - Nombre
5. Meta hace el matching (típicamente 60-80% match rate)

### **6.3 Crear Campaña**

1. **Crear campaña** → Objetivo: **Tráfico** o **Conversiones**
2. Audiencia: **La que acabas de crear**
3. Anuncio: Dirige a tu dominio de NEXUS
4. Presupuesto: $5-10 USD/día para empezar

### **Opción Automática (Zapier)**

Si quieres automatizar el flujo:

```
Google Sheets (nuevo lead)
    ↓
Zapier detecta nueva fila
    ↓
Zapier envía a Meta Ads API
    ↓
Lead se agrega automático a audiencia
```

Costo Zapier: $20 USD/mes (plan básico)

---

## ⚙️ CONFIGURACIONES ADICIONALES

### **Personalizar Horarios de Respuesta**

En el Apps Script, puedes agregar lógica de horario:

```javascript
function esHorarioLaboral() {
  var ahora = new Date();
  var hora = ahora.getHours();
  var dia = ahora.getDay(); // 0=Domingo, 6=Sábado
  
  // Lun-Vie 9-18 o Sáb-Dom 9-14
  if (dia >= 1 && dia <= 5) {
    return hora >= 9 && hora < 18;
  } else if (dia === 0 || dia === 6) {
    return hora >= 9 && hora < 14;
  }
  return false;
}

// Usar en la respuesta:
if (!esHorarioLaboral()) {
  return 'Gracias por tu mensaje. Nuestro horario es Lun-Vie 9-18 | Sáb-Dom 9-14. Te responderemos pronto. Para urgencias: 341 170 7365';
}
```

### **Notificaciones a Judith**

El sistema ya envía email automático para leads prioritarios. Si quieres también WhatsApp a Judith:

```javascript
// Agregar después de guardar el lead
if (data.leadScore >= 70) {
  enviarWhatsApp(
    'whatsapp:+523411707365', // WhatsApp de Judith
    '🔥 LEAD PRIORITARIO\n\n' +
    'Nombre: ' + data.nombre + '\n' +
    'Tel: ' + data.telefono + '\n' +
    'Presupuesto: ' + data.presupuesto + '\n' +
    'Score: ' + data.leadScore + '/100'
  );
}
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### **❌ "El mapa no carga"**

**Solución:**
1. Verifica que subiste `nexus-mapa-plano.jpg`
2. Comprueba que la URL en `NEXUS_MAP_URL` es correcta
3. Abre la URL directamente en el navegador para verificar

### **❌ "No recibo WhatsApp"**

**Solución:**
1. Verifica que conectaste TU WhatsApp al sandbox de Twilio
2. Comprueba las credenciales en Apps Script
3. Revisa el log en Apps Script: **Ejecuciones** → Ver errores
4. Prueba la función `testWhatsApp` manualmente

### **❌ "Claude no responde bien"**

**Solución:**
1. Verifica que tienes crédito en console.anthropic.com
2. Revisa que la API key es correcta
3. En Apps Script → **Ejecuciones** → Ver logs de Claude
4. Ajusta el `systemPrompt` si necesitas cambiar el tono

### **❌ "Los datos no llegan a Google Sheets"**

**Solución:**
1. Verifica que la URL del Apps Script es correcta
2. Comprueba que el script tiene permisos (ejecutar `testDoPost`)
3. Abre F12 en el navegador → Console → busca errores
4. Verifica los encabezados de la hoja (deben ser exactos)

---

## 📊 MÉTRICAS A MONITOREAR

### **En Google Sheets:**

| Métrica | Objetivo | Cómo Medirlo |
|---------|----------|--------------|
| Leads/día | 5-10 | Contar filas nuevas |
| % Leads prioritarios | >30% | Leads score ≥70 / Total |
| Tasa de respuesta WA | >80% | Leads que responden WA / Total |
| Tiempo respuesta Judith | <2 horas | Prioritarios |

### **En Meta Ads:**

| Métrica | Objetivo |
|---------|----------|
| Match rate | >60% |
| CTR | >2% |
| CPC | <$0.50 USD |
| Conversiones | 5-10% |

### **Sistema WhatsApp:**

| Métrica | Objetivo |
|---------|----------|
| Mensajes respondidos por IA | >90% |
| Tiempo respuesta IA | <5 segundos |
| Satisfacción (preguntar) | >80% |

---

## 💰 COSTOS TOTALES MENSUALES

| Servicio | Costo |
|----------|-------|
| Hostgator (ya tienes) | $0 adicional |
| Google Sheets | Gratis |
| Apps Script | Gratis |
| Twilio WhatsApp (100 leads) | ~$1 USD |
| Claude API (100 leads, 3 msg c/u) | ~$1 USD |
| Meta Ads (opcional) | $150-300 USD |
| **TOTAL (sin ads)** | **~$2 USD/mes** |
| **TOTAL (con ads)** | **~$152-302 USD/mes** |

---

## 🎯 CHECKLIST FINAL

Antes de lanzar, verifica:

### **Chatbot Web:**
- [ ] Subido a tu dominio
- [ ] Imagen del mapa carga correctamente
- [ ] 5 zonas se muestran correctamente
- [ ] Precios actualizados
- [ ] Datos de contacto correctos
- [ ] Google Sheets URL configurada

### **Google Sheets:**
- [ ] Hoja creada con encabezados correctos
- [ ] Apps Script pegado y guardado
- [ ] Credenciales configuradas (Twilio + Claude)
- [ ] Script implementado como aplicación web
- [ ] URL copiada al chatbot

### **Twilio:**
- [ ] Cuenta creada
- [ ] WhatsApp conectado al sandbox
- [ ] Webhook configurado con URL de Apps Script
- [ ] Número de prueba funcionando

### **Claude API:**
- [ ] Cuenta creada en console.anthropic.com
- [ ] API Key obtenida
- [ ] Crédito agregado ($5-10 USD)
- [ ] API Key pegada en Apps Script

### **Pruebas:**
- [ ] Chatbot web funciona
- [ ] Datos llegan a Google Sheets
- [ ] WhatsApp inicial se envía
- [ ] Bot responde preguntas por WhatsApp
- [ ] Email de notificación llega a Judith

---

## 🚀 ¡LISTO PARA PRODUCCIÓN!

Una vez completados todos los pasos, tu sistema estará:

✅ Capturando leads 24/7 en el sitio web
✅ Guardando automáticamente en Google Sheets
✅ Enviando WhatsApp automático a cada lead
✅ Respondiendo preguntas con IA las 24 horas
✅ Notificando a Judith de leads prioritarios
✅ Listo para escalar con Meta Ads

---

## 📞 SOPORTE

**Si necesitas ayuda:**

1. Revisa la consola del navegador (F12)
2. Revisa **Ejecuciones** en Apps Script
3. Verifica cada paso del checklist
4. Comprueba que todas las URLs y credenciales son correctas

---

## 🎉 PRÓXIMOS PASOS RECOMENDADOS

### **Semana 1:**
- Monitorear los primeros 10 leads
- Ajustar mensajes de WhatsApp si es necesario
- Optimizar respuestas de Claude IA

### **Semana 2:**
- Configurar Meta Ads con primeros leads
- Analizar qué zonas generan más interés
- Ajustar precios/promociones según respuesta

### **Mes 1:**
- Analizar métricas completas
- Optimizar lead scoring
- Escalar presupuesto de Meta Ads si ROI es positivo

---

**¡Todo listo! Sistema NEXUS V2 con WhatsApp IA completamente configurado.** 🎊

