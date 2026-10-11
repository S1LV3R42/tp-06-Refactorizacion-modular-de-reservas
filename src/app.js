const express = require('express');
const path = require('node:path');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const { identificarSolicitud, medirDuracion } = require('./middleware/solicitudes');
const crearRouterReservas = require('./rutas/reservas');

function crearAplicacion(config, controlador) {
    const app = express();

    app.use(morgan(config.entorno === 'production' ? 'combined' : 'dev'));
    app.use(identificarSolicitud);
    app.use(medirDuracion);

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "..", "views"));
    app.use(expressLayouts);
    app.set("layout", "layouts/main");

    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.get('/', (req, res) => res.render('inicio', { titulo: 'Inicio' }));
    app.get('/estado', controlador.estado);
    app.use('/reservas', crearRouterReservas(controlador));

    app.use((req, res) => res.status(404).render("no-encontrado", { titulo: "Error 404", mensaje: "URL inexistente." }));

    return app;
}

module.exports = crearAplicacion;
