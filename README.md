# Chat Supabase / Firebase - Joseph Caza

Una aplicación de chat en tiempo real construida con Angular, Ionic y Supabase.

## 🚀 Características

- 💬 Chat en tiempo real
- 👤 Perfiles de usuario con avatares personalizables
- 📸 Compartir imágenes
- 📍 Compartir ubicaciones
- 📚 Compartir datos curiosos
- 🔒 Autenticación segura
- 💾 Almacenamiento de archivos
- 📱 Diseño responsivo

## 🛠️ Tecnologías Utilizadas

- **Frontend:**
  - Angular 17
  - Ionic Framework
  - Capacitor (para funcionalidades nativas)
  - RxJS (para manejo de estado y eventos)

- **Backend:**
  - Supabase
    - Autenticación
    - Base de datos PostgreSQL
    - Almacenamiento de archivos
    - Tiempo real con Firebase

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta en Supabase
- Angular CLI
- Ionic CLI

## 🔧 Instalación

1. Clonar el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd chatSupabase
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Agregar las credenciales de Supabase:
     ```
     SUPABASE_URL=tu_url_de_supabase
     SUPABASE_KEY=tu_clave_anon_de_supabase
     ```

4. Ejecutar el proyecto:
   ```bash
   ionic serve
   ```

## 🗄️ Estructura de la Base de Datos

### Tabla `profiles`
- `id` (uuid, PK): ID del usuario
- `email` (text): Correo electrónico del usuario
- `avatar_url` (text): URL del avatar del usuario
- `updated_at` (timestamp): Fecha de última actualización

### Tabla `messages`
- `id` (serial, PK): ID del mensaje
- `created_at` (timestamp): Fecha de creación
- `user_id` (uuid, FK): ID del usuario que envió el mensaje
- `content` (text): Contenido del mensaje
- `user_email` (text): Correo electrónico del usuario

## 🔐 Políticas de Seguridad

### Perfiles
- Lectura pública
- Los usuarios solo pueden insertar/actualizar su propio perfil
![imagen](https://github.com/user-attachments/assets/385bebaa-03af-4dc3-b96f-8148493233d1)

### Mensajes
- Lectura pública
- Los usuarios solo pueden insertar sus propios mensajes
![imagen](https://github.com/user-attachments/assets/aa461cdc-dd2f-4867-afbc-5dc9fdc93f79)

### Almacenamiento
- Los avatares son accesibles públicamente
- Los usuarios solo pueden subir/actualizar sus propios avatares

## 📱 Funcionalidades Principales

### Chat
- Mensajes en tiempo real
- Soporte para texto plano
- Compartir imágenes
- Compartir ubicaciones
- Compartir datos curiosos
- Indicadores de usuario
- Avatares de perfil
![imagen](https://github.com/user-attachments/assets/884f7d93-e969-4c6f-b677-a6397e83a50d)

### Perfiles
- Avatar personalizable
- Subida de imágenes
- Vista previa de imágenes
- Actualización en tiempo real

## 🎨 Interfaz de Usuario

- Diseño moderno y minimalista
- Burbujas de chat con avatares
- Indicadores de estado
- Interfaz adaptativa
- Tema claro/oscuro
- Animaciones suaves
