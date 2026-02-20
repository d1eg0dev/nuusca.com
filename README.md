# NEXUS Centro Logístico - Chatbot

Chatbot interactivo para NEXUS Centro Logístico en Manzanillo, Colima.

## 🚀 Despliegue en GitHub Pages con Dominio Personalizado

### Paso 1: Crear Repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Haz clic en **"New repository"** (botón verde)
3. Configura:
   - **Repository name**: `nexuslogisticshub.com` (o cualquier nombre)
   - **Description**: "Chatbot NEXUS Centro Logístico"
   - **Public** ✓
   - **NO** marques "Add a README file"
4. Haz clic en **"Create repository"**

### Paso 2: Subir los Archivos

**Opción A - Desde la interfaz web de GitHub:**
1. En tu repositorio recién creado, haz clic en **"uploading an existing file"**
2. Arrastra los archivos `index.html` y `CNAME`
3. Haz clic en **"Commit changes"**

**Opción B - Usando Git en terminal:**
```bash
git init
git add .
git commit -m "Initial commit - NEXUS Chatbot"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/nexuslogisticshub.com.git
git push -u origin main
```

### Paso 3: Activar GitHub Pages

1. Ve a tu repositorio → **Settings** (Configuración)
2. En el menú lateral, haz clic en **Pages**
3. En **Source**, selecciona:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Haz clic en **Save**

### Paso 4: Configurar el Dominio Personalizado

#### En GitHub:
1. En la misma página de **Settings → Pages**
2. En **Custom domain**, escribe: `nexuslogisticshub.com`
3. Haz clic en **Save**
4. Espera a que aparezca ✅ junto a tu dominio (puede tardar unos minutos)
5. Marca la casilla **Enforce HTTPS** (SSL gratuito automático)

#### En tu proveedor de dominio (GoDaddy, Namecheap, etc.):

Configura los siguientes registros DNS:

**Para el dominio raíz (nexuslogisticshub.com):**

| Tipo | Host | Valor |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

**Para www (opcional pero recomendado):**

| Tipo | Host | Valor |
|------|------|-------|
| CNAME | www | TU_USUARIO.github.io |

### Paso 5: Esperar Propagación DNS

- Los cambios DNS pueden tardar de **10 minutos a 48 horas**
- Puedes verificar la propagación en: https://dnschecker.org

### Paso 6: Verificar SSL/HTTPS

1. Una vez que el DNS se propague, GitHub generará automáticamente un certificado SSL
2. Ve a **Settings → Pages** y marca **Enforce HTTPS**
3. Tu sitio estará disponible en `https://nexuslogisticshub.com`

---

## 📋 Resumen de la Estructura del Bot

### Configuración Principal (`NEXUS_CONFIG`)
```javascript
{
  nombre: "NEXUS Centro Logístico",
  ubicacion: "Manzanillo, Colima",
  asesora: "Judith Leal",
  telefono: "341 170 7365",
  whatsapp: "3411707365",
  email: "asesorajudithleal@gmail.com",
  zonas: [...], // 4 zonas con precios
  financiamiento: {...},
  preguntasCalificacion: [...] // Preguntas para calificar leads
}
```

### Estados de Conversación
1. `greeting` - Saludo inicial
2. `initial_interest` - Interés inicial (zonas, ubicación, visita)
3. `qualifying` - Preguntas de calificación
4. `post_zones` - Después de mostrar zonas
5. `collecting_contact` - Recolección de datos (nombre, teléfono, email)
6. `scheduling` - Agendar visita
7. `closing` - Cierre de conversación

### Datos Capturados del Lead
- Nombre
- Teléfono
- Email
- Superficie requerida
- Tipo de operación
- Urgencia
- Presupuesto
- Lead Score (0-100)
- Fecha preferida de visita

### Funciones Principales
- `initializeConversation()` - Inicia la conversación
- `processUserInput()` - Procesa entrada del usuario
- `showZones()` - Muestra las 4 zonas
- `showFinancing()` - Muestra opciones de financiamiento
- `showLocation()` - Muestra ubicación
- `handleContactCollection()` - Recolecta datos de contacto
- `handleScheduling()` - Agenda visitas
- `saveLead()` - Guarda lead (consola + Google Sheets opcional)

---

## 🔧 Integración con Google Sheets (Opcional)

1. Crea un Google Sheet
2. Ve a **Extensiones → Apps Script**
3. Pega el siguiente código:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.nombre,
    data.telefono,
    data.email,
    data.superficie_requerida,
    data.tipo_operacion,
    data.urgencia,
    data.presupuesto,
    data.leadScore,
    data.fecha_preferida
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({status: 'success'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Publica como aplicación web
5. Copia la URL y pégala en `GOOGLE_SHEETS_URL` en el código

---

## 🔄 Para Integración con WhatsApp

El bot está preparado para integrarse con WhatsApp. Los datos clave para la automatización:

### Datos disponibles para enviar a WhatsApp:
```javascript
{
  nombre: "string",
  telefono: "string (10 dígitos)",
  email: "string",
  superficie_requerida: "string",
  tipo_operacion: "string",
  urgencia: "string",
  presupuesto: "string",
  leadScore: "number (0-100)",
  fecha_preferida: "string",
  timestamp: "ISO string"
}
```

### Opciones de integración:
1. **WhatsApp Business API** (oficial)
2. **Twilio WhatsApp** 
3. **360dialog**
4. **WATI.io**
5. **Make.com / Zapier** (webhooks)

Ver archivo `WHATSAPP_INTEGRATION.md` para instrucciones detalladas.

---

## 📞 Contacto

- **Asesora**: Judith Leal
- **WhatsApp**: 341 170 7365
- **Email**: asesorajudithleal@gmail.com
- **Web**: nuusca.com
