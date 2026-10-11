# Trabajo práctico 06

## Proyecto de partida y cambios
El punto de partida es el TP 05 funcional. Se reorganizó la aplicación monolítica en múltiples módulos separados (configuración, app, rutas, controladores, servicios y middleware) para mejorar la escalabilidad y mantenibilidad. No se requirieron reparaciones de la línea de base, ya que el TP 05 ya cumplía con todos los comportamientos esperados y la validación estricta de datos.

## Instalación y ejecución
- **Instalar dependencias:** `npm install`
- **Ejecutar servidor (por defecto):** `npm start`
- **Ejecutar servidor con variables locales:** `npm run start:local`

## Configuración del entorno
La aplicación consume las variables `PORT` y `NODE_ENV` desde el entorno. Si `PORT` no se define, utiliza el puerto 3000 por defecto. Además, el módulo de configuración valida estrictamente que el puerto proporcionado sea un número entero válido (entre 1 y 65535); de lo contrario, aborta la ejecución. El formato de registro de Morgan se ajusta dinámicamente: usa formato `dev` en desarrollo y `combined` en producción.

## Mapa de módulos y dependencias
- `src/index.js`: Archivo de arranque. Crea la semilla de datos, inicializa el servicio, carga la configuración, inyecta las dependencias para crear la app y pone a escuchar al servidor.
- `src/configuracion.js`: Encargado exclusivamente de leer, validar y exportar las variables de entorno (`process.env`).
- `src/app.js`: Configura el motor de vistas EJS, establece el pipeline de middleware global y monta los routers. No manipula datos.
- `src/rutas/reservas.js`: Relaciona los métodos HTTP y las rutas relativas con sus respectivos middlewares de validación y controladores.
- `src/controladores/reservas.js`: Recibe las peticiones (`req`), delega la lógica de negocio al servicio y emite una respuesta al cliente (`res`).
- `src/servicios/reservas.js`: Contiene la lógica de negocio pura y el almacenamiento en memoria. No interactúa con HTTP.
- `src/middleware/`: Contiene la lógica transversal separada en `solicitudes.js` (Morgan, ID, timer) y `reservas.js` (validaciones).

## Pipeline y contrato de rutas
El pipeline de ejecución global se mantiene idéntico al TP 05:
Morgan -> identificarSolicitud -> medirDuracion -> expressLayouts -> express.static -> express.urlencoded -> express.json -> rutas de aplicación -> router /reservas -> página 404 final.

## Matriz antes/después
Se realizaron pruebas manuales comprobando la paridad funcional estricta entre la versión monolítica (TP05) y la refactorizada (TP06):

| Caso | Esperado | Evidencia a registrar | Resultado TP 05 (Antes) | Resultado TP 06 (Después) |
| :--- | :--- | :--- | :--- | :--- |
| Inicio y CSS | 200 | Navegación, recurso cargado, ID visible | OK (200) | OK (200) |
| Estado inicial | 200 | JSON con cantidad inicial e ID | OK (200) | OK (200) |
| Listado y detalle existente | 200 | Mismos datos de TP 05 | OK (200) | OK (200) |
| Detalle inexistente | 404 | Vista HTML; sin caída del servidor | OK (404) | OK (404) |
| Formulario | 200 | Campos y valores de selección | OK (200) | OK (200) |
| POST vacío | 400 | Error; sin alta | OK (400) | OK (400) |
| Sala no permitida | 400 | Sin alta | OK (400) | OK (400) |
| Email sin @ | 400 | Sin alta | OK (400) | OK (400) |
| Personas 0, 7 o fraccionarias | 400 | Sin alta | OK (400) | OK (400) |
| POST válido | 302 -> 200 | Nueva reserva en listado y /estado | OK (302 -> 200) | OK (302 -> 200) |
| URL inexistente | 404 | Vista HTML final | OK (404) | OK (404) |
| Reinicio | 200 | Regreso a la semilla inicial | OK (200) | OK (200) |
| Puerto alternativo | 200 | Responde en puerto configurado | N/A | OK (Probado en puerto 8080) |
| Puerto inválido | No inicia | Mensaje explícito | N/A | OK (Error fatal e interrupción) |

*(Nota: Durante estas comprobaciones se verificó en la terminal que Morgan y el temporizador propio continúan imprimiendo los códigos 200, 302, 400 y 404 de la misma manera que en el proyecto anterior).*

## Formato y análisis estático
- **Comandos ejecutados y resultados:**
  - `npm run format`: Prettier analizó el código y reescribió automáticamente el espaciado e indentación de todos los archivos del directorio `src` para estandarizarlos.
  - `npm run check`: ESLint verificó el código estáticamente sin reportar advertencias ni errores en el uso de variables u otras reglas definidas.

## Persistencia temporal y límites
- **¿Por qué el servicio no usa `res`?** Porque el servicio debe centrarse pura y exclusivamente en procesar la información y aplicar las reglas de negocio (ej. guardar o buscar una reserva). Al ser independiente de Express y del protocolo HTTP, este mismo servicio podría reutilizarse mañana para una aplicación de terminal o de escritorio sin tener que reescribir su lógica.
- **¿Qué hace el controlador?** Funciona como un orquestador o intermediario. Su trabajo es interceptar la petición web del usuario (`req`), extraer los parámetros, pedirle al servicio que haga el trabajo duro, y finalmente usar `res` para decidir cómo se le contesta al navegador (renderizando EJS, mandando JSON o redirigiendo).
- **¿Por qué el router declara caminos relativos?** Al usar rutas como `/` o `/:id` en lugar de `/reservas/:id`, el router se vuelve 100% modular. Esto le permite a `app.js` "montar" ese paquete completo de rutas bajo cualquier prefijo que desee en el futuro, sin tener que modificar el archivo del router por dentro.
- **¿Dónde vive el único arreglo de reservas?** Existe protegido como una variable privada en la memoria (closure) del módulo `servicios/reservas.js`. Solo se expone lo que las funciones de retorno (`crear`, `obtenerTodas`) permiten hacer con él.
- **¿Qué ocurrirá al reiniciar?** Dado que el código carece de instrucciones para escribir datos en el disco duro o conectarse a una base de datos, las nuevas reservas viven temporalmente en la memoria RAM. Al detener la ejecución (con `Ctrl+C`), la RAM se vacía; al reiniciar, el arreglo se regenera únicamente con los 4 datos de la "semilla inicial" inyectados desde `index.js`.