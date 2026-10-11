function crearServicioReservas(datosIniciales) {
    let reservas = [...datosIniciales];

    return {
        obtenerTodas: () => [...reservas],
        contarReservas: () => reservas.length,
        buscarPorId: (id) => reservas.find(r => r.id === parseInt(id, 10)),
        crear: (datosValidados) => {
            const nuevoId = reservas.length > 0 ? reservas[reservas.length - 1].id + 1 : 1;
            const nuevaReserva = { id: nuevoId, ...datosValidados };
            reservas.push(nuevaReserva);
            return nuevaReserva;
        }
    };
}

module.exports = crearServicioReservas;
