function crearControladorReservas(servicio) {
    return {
        estado: (req, res) => {
            res.json({
                servicio: "activo",
                reservas: servicio.contarReservas(),
                solicitudId: res.locals.solicitudId
            });
        },
        listar: (req, res) => {
            res.render('reservas/lista', { titulo: 'Listado', reservas: servicio.obtenerTodas() });
        },
        mostrarFormulario: (req, res) => {
            res.render('reservas/nueva', { titulo: 'Nueva Reserva', error: null, datosIngresados: {} });
        },
        mostrarDetalle: (req, res) => {
            const reserva = servicio.buscarPorId(req.params.id);
            if (!reserva) {
                return res.status(404).render('no-encontrado', { titulo: 'Página no encontrada', mensaje: 'La reserva no existe.' });
            }
            res.render('reservas/detalle', { titulo: 'Detalle', reserva });
        },
        procesarCreacion: (req, res) => {
            servicio.crear(req.reservaValidada);
            res.redirect('/reservas');
        }
    };
}

module.exports = crearControladorReservas;
