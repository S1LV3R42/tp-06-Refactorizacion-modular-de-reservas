const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

const prepararAreaReservas = (req, res, next) => {
    res.locals.seccion = "Reservas de salas";
    res.locals.salasPermitidas = salasPermitidas;
    next();
};

const validarReserva = (req, res, next) => {
    let { estudiante, email, sala, fecha, turno, personas } = req.body;
    
    estudiante = estudiante ? estudiante.trim() : "";
    email = email ? email.trim() : "";
    fecha = fecha ? fecha.trim() : "";
    const personasNum = Number(personas);

    const errores = [];
    if (!estudiante) errores.push("El nombre del estudiante es obligatorio.");
    if (!email || !email.includes('@')) errores.push("Se requiere un correo válido con '@'.");
    if (!salasPermitidas.includes(sala)) errores.push("La sala seleccionada no es permitida.");
    if (!fecha) errores.push("La fecha es obligatoria.");
    if (!['Mañana', 'Tarde', 'Noche'].includes(turno)) errores.push("Turno inválido.");
    if (!Number.isInteger(personasNum) || personasNum < 1 || personasNum > 6) errores.push("Personas debe ser un número entre 1 y 6.");

    if (errores.length > 0) {
        return res.status(400).render('reservas/nueva', {
            titulo: 'Nueva Reserva',
            error: errores.join(" "),
            datosIngresados: req.body
        });
    }

    req.reservaValidada = { estudiante, email, sala, fecha, turno, personas: personasNum };
    next();
};

module.exports = { prepararAreaReservas, validarReserva };
