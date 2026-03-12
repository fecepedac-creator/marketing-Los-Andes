# Panel Editorial Los Andes MVP

MVP editorial sanitario con Next.js 15 + Firebase + OpenAI.

## Estado
Flujo principal implementado: login admin → dashboard → edición cápsula → generación IG/FB → versionado → galería → descarga → review status.

---

## 1) Variables de entorno

Copiar:

```bash
cp .env.example .env.local
```

### Variables requeridas

**OpenAI (server):**
- `OPENAI_API_KEY`: clave para generación de imágenes en `/api/generate-image`.

**Firebase Client (frontend):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Firebase Admin (backend):**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET`

**Control de acceso:**
- `ADMIN_EMAIL`: email admin esperado por el guard y recomendado para rules.

> Nunca exponer `OPENAI_API_KEY` ni `FIREBASE_PRIVATE_KEY` al frontend.

---

## 2) Configuración Firebase (real)

1. Crear proyecto Firebase.
2. Activar **Authentication > Email/Password**.
3. Crear **Firestore** (modo producción recomendado).
4. Crear **Storage**.
5. Crear service account (Admin SDK) y poblar variables `FIREBASE_*`.
6. Crear usuario admin en Auth con email igual a `ADMIN_EMAIL`.

### Reglas
Ya incluidas:
- `firestore.rules`
- `storage.rules`
- `firebase.json`

Deploy reglas:

```bash
firebase login
firebase use <tu-proyecto>
firebase deploy --only firestore:rules,storage
```

### Colecciones/documentos creados por la app
- `capsules/{capsuleId}`
- `capsules/{capsuleId}/generations/{generationId}`
- `settings/editorial`

### Path de logo
- `branding/logo-main.png`

---

## 3) PRIMER ARRANQUE REAL PASO A PASO

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Validar estático:
   ```bash
   npm run lint
   npm run typecheck
   ```
3. Seed base (10 cápsulas demo + settings/editorial):
   ```bash
   npm run seed
   ```
4. Iniciar app:
   ```bash
   npm run dev
   ```
5. Iniciar sesión en `/login` con usuario admin real.
6. Subir/reemplazar logo en `/settings`.
7. (Opcional) Importar Excel real.
8. Generar primera imagen IG/FB desde `/dashboard`.
9. Confirmar en `/gallery` descarga + review status.

---

## 4) Importación Excel real (`biblioteca_capsulas_los_andes_v2.xlsx`)

Comando:

```bash
npm run import:capsules:xlsx -- data/biblioteca_capsulas_los_andes_v2.xlsx
```

Si no pasas ruta, usa por defecto `data/biblioteca_capsulas_los_andes_v2.xlsx`.

### Mapeo de columnas
`COLUMN_MAP` está en `scripts/import-capsules-xlsx.ts`.
- Es explícito y fácil de ajustar si cambian encabezados.
- Incluye mapeos español/inglés para campos editoriales y prompts.

### Validaciones del importador
- Falla si no detecta columnas compatibles.
- Omite filas con campos requeridos faltantes (warning por fila).
- Advierte filas sin `promptInstagram` ni `promptFacebook`.
- Normaliza booleanos y fechas (incluye serial Excel).
- Marca `source = "excel_import"`.

### Cómo revisar cápsulas importadas
1. `/dashboard`: revisar columna **Origen**.
2. `/capsules/[id]`: revisar:
   - `promptInstagram`
   - `promptFacebook`
   - `suggestedFileName`
   - `source`

---

## 5) Logo institucional en Settings

Flujo:
1. Ir a `/settings`.
2. Subir imagen (máx 5MB).
3. Backend valida tipo/tamaño y guarda en `branding/logo-main.png`.
4. `settings/editorial.logoUrl` se actualiza.
5. La UI muestra preview del logo vigente y permite reemplazo.

---

## 6) Prompt builder (flujo real)

`buildPrompt` usa en orden:
1. bloque institucional (`institutionalPromptBase`)
2. identidad visual (instrucción logo oficial + `logoUrl` + `brandNotes`)
3. bloque de formato (`instagramFormatBlock` / `facebookFormatBlock`)
4. datos de cápsula (incluye escena visual)
5. prompt específico por formato (`promptInstagram` / `promptFacebook`)
6. salida esperada

---

## 7) Deploy preview (Vercel recomendado)

Se incluye `vercel.json` mínimo para autodetección Next.js.

### Pasos exactos
1. Importar repo en Vercel.
2. Confirmar framework `Next.js`.
3. Cargar **todas** las variables de `.env.example` en Project Settings.
4. Deploy preview.

### Validación post-deploy
- Login admin funciona.
- `POST /api/seed` o `npm run seed` (una vez).
- Import Excel (si corresponde).
- Subida logo en settings.
- Generación IG/FB y versionado.
- Visualización en galería + descarga + review.

---

## 8) Troubleshooting (QA preventivo)

### `next: not found`
Ejecutar `npm install` correctamente antes de lint/build/dev.

### Error Firebase Admin `Missing required env var`
Falta una variable `FIREBASE_*` en `.env.local`.

### Login falla aunque usuario existe
Verifica que email del usuario coincida con `ADMIN_EMAIL`.

### Error al generar imagen
Verificar:
- `OPENAI_API_KEY`
- cuota/acceso al modelo `gpt-image-1`
- permisos de Storage/Firestore en service account

### Importador omite filas
Revisar warnings del script y ajustar `COLUMN_MAP` o datos faltantes en Excel.

### Logo no sube
Confirmar formato imagen y tamaño <= 5MB.

---

## 9) Scripts npm
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run seed`
- `npm run import:capsules:xlsx`
