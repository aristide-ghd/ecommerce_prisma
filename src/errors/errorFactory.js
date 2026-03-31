const AppError = require('./AppError');
const ERROR_CODES = require('./errorCodes');

// Fonction factory de base pour créer des erreurs
const createError = (message, statusCode, errorCode) => {
    return new AppError(message, statusCode, errorCode);
};

// Erreur 404 - Ressource non trouvée
const notFoundError = (message = 'Ressource non trouvée', errorCode = ERROR_CODES.RESOURCE_NOT_FOUND) => {
    return createError(message, 404, errorCode);
};

// Erreur 400 - Données invalides
const validationError = (message = 'Données de validation invalides', errorCode = ERROR_CODES.VALIDATION_FAILED) => {
    return createError(message, 400, errorCode);
};

// Erreur 400 - Requête invalide
const badRequestError = (message = 'Requête invalide', errorCode = ERROR_CODES.VALIDATION_FAILED) => {
    return createError(message, 400, errorCode);
};

// Erreur 401 - Non authentifiée
const unauthorizedError = (message = 'Authentification requise', errorCode = ERROR_CODES.AUTH_UNAUTHORIZED) => {
    return createError(message, 401, errorCode);
};

// Erreur 403 - Accès interdit
const forbiddenError = (message = 'Accès interdit', errorCode = ERROR_CODES.PERMISSION_FORBIDDEN) => {
    return createError(message, 403, errorCode);
};

// Erreur 409 - Conflit (ressource déjà existante)
const conflictError = (message = 'Ressource déjà existante', errorCode = ERROR_CODES.RESOURCE_ALREADY_EXISTS) => {
    return createError(message, 409, errorCode);
};

// Erreur 500 - Erreur serveur
const serverError = (message = 'Erreur serveur interne', errorCode = ERROR_CODES.SERVER_ERROR) => {
    return createError(message, 500, errorCode);
};

module.exports = {
    createError,
    notFoundError,
    validationError,
    badRequestError,
    unauthorizedError,
    forbiddenError,
    conflictError,
    serverError
};
