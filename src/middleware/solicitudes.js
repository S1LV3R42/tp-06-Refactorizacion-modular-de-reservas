let contadorSolicitudes = 1;

const identificarSolicitud = (req, res, next) => {
    res.locals.solicitudId = `BIB-${String(contadorSolicitudes).padStart(4, '0')}`;
    contadorSolicitudes++;
    next();
};

const medirDuracion = (req, res, next) => {
    const inicio = Date.now();
    res.on('finish', () => {
        const duracion = Date.now() - inicio;
        console.log(`[Medición] ID: ${res.locals.solicitudId} | Método: ${req.method} | URL: ${req.originalUrl} | Estado: ${res.statusCode} | Duración: ${duracion}ms`);
    });
    next();
};

module.exports = { identificarSolicitud, medirDuracion };
