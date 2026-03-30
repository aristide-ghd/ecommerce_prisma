const { AppError, createError } = require('../errors');
const ERROR_CODES = require('../errors/errorCodes');

// Middleware de gestion globale des erreurs
const errorHandler = (err, req, res, next) => {
    // Copier l'erreur pour ne pas modifier l'originale
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Log de l'erreur pour le développement
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Erreur Prisma - Ressource non trouvée
    if (err.code === 'P2025') {
        error = createError('Ressource non trouvée', 404, ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    // Erreur Prisma - Contrainte unique violée
    if (err.code === 'P2002') {
        const field = err.meta?.target?.[0] || 'champ';
        error = createError(
            `${field} existe déjà`,
            409,
            ERROR_CODES.RESOURCE_ALREADY_EXISTS
        );
    }

    // Erreur Prisma - Clé étrangère invalide
    if (err.code === 'P2003') {
        error = createError(
            'Référence invalide',
            400,
            ERROR_CODES.VALIDATION_FAILED
        );
    }

    // Erreur JWT - Token invalide
    if (err.name === 'JsonWebTokenError') {
        error = createError(
            'Token invalide',
            401,
            ERROR_CODES.AUTH_TOKEN_INVALID
        );
    }

    // Erreur JWT - Token expiré
    if (err.name === 'TokenExpiredError') {
        error = createError(
            'Token expiré',
            401,
            ERROR_CODES.AUTH_TOKEN_EXPIRED
        );
    }

    // Erreur de validation Joi
    if (err.isJoi) {
        error = createError(
            err.details[0].message,
            400,
            ERROR_CODES.VALIDATION_FAILED
        );
    }

    // Construire la réponse d'erreur
    const statusCode = error.statusCode || err.statusCode || 500;
    const errorCode = error.errorCode || ERROR_CODES.SERVER_ERROR;
    const message = error.message || 'Erreur serveur interne';

    // Format de réponse standardisé
    const response = {
        success: false,
        error: {
            code: errorCode,
            message: message,
            statusCode: statusCode,
            timestamp: new Date().toISOString(),
            path: req.originalUrl
        }
    };

    // Ajouter la stack trace en développement
    if (process.env.NODE_ENV === 'development') {
        response.error.stack = error.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
