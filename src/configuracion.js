require('dotenv').config();

function cargarConfiguracion() {
    const puertoCrudo = process.env.PORT || '3000';
    const puerto = parseInt(puertoCrudo, 10);

    if (isNaN(puerto) || !Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
        console.error(`Error crítico: El puerto configurado '${puertoCrudo}' es inválido. Debe ser un entero entre 1 y 65535.`);
        process.exit(1);
    }

    return {
        puerto,
        entorno: process.env.NODE_ENV === 'production' ? 'production' : 'development'
    };
}

module.exports = cargarConfiguracion;
