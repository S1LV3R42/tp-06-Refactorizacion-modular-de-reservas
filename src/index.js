const cargarConfiguracion = require('./configuracion');
const crearServicioReservas = require('./servicios/reservas');
const crearControladorReservas = require('./controladores/reservas');
const crearAplicacion = require('./app');

const config = cargarConfiguracion();

const datosIniciales = [
    { id: 1, estudiante: "Ana López", email: "ana@ej.com", sala: "Sala Norte", fecha: "2026-10-15", turno: "Mañana", personas: 2 },
    { id: 2, estudiante: "Carlos Ruiz", email: "car@ej.com", sala: "Sala Sur", fecha: "2026-10-16", turno: "Tarde", personas: 4 },
    { id: 3, estudiante: "María Sol", email: "mar@ej.com", sala: "Sala Multimedia", fecha: "2026-10-17", turno: "Noche", personas: 6 },
    { id: 4, estudiante: "Juan Pérez", email: "juan@ej.com", sala: "Sala Norte", fecha: "2026-10-18", turno: "Mañana", personas: 1 }
];

const servicio = crearServicioReservas(datosIniciales);
const controlador = crearControladorReservas(servicio);
const app = crearAplicacion(config, controlador);

app.listen(config.puerto, () => {
    console.log(`Servidor iniciado en http://localhost:${config.puerto} [Entorno: ${config.entorno}]`);
});
