const { notFoundError } = require('../errors');
const ERROR_CODES = require('../errors/errorCodes');

// Middleware pour gérer les routes non trouvées (404)
const notFound = (req, res, next) => {
    const error = notFoundError(
        'La ressource demandée est introuvable',
        ERROR_CODES.ROUTE_NOT_FOUND
    );
    next(error);
};

module.exports = notFound;
