# music-reproductor

## Instrucciones de instalación

- Descargar el repositorio en su equipo.
- Correr `npm install` para instalar dependencias. Si no puede correr comandos con npm, debe instalar node.js desde este link: https://nodejs.org/es/download/.
- Crear un archivo `.env` en la raíz del proyecto, guiandose por el archivo `.env.dist` en la misma ubicación.
- Si se va a modificar el proyecto, se recomienda instalar las extensiones de eslint, prettier y jest en su IDE.
- Para iniciar la base de datos, correr `npm run schema:migrate`.
- Para correr el servidor, correr `npm run dev`. Al correr dicho comando la aplicación se ejecutará mediante Nodemon, con el cual el servidor se reiniciará al detectar cambios.
- Ir a la dirección indicada en la consola, por defecto http://localhost:3000/.
