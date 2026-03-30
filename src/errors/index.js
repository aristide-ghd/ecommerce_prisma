// Export centralisé de toutes les erreurs personnalisées
const AppError = require('./AppError');
const ERROR_CODES = require('./errorCodes');
const {
    createError,
    notFoundError,
    validationError,
    badRequestError,
    unauthorizedError,
    forbiddenError,
    conflictError,
    serverError
} = require('./errorFactory');

module.exports = {
    AppError,
    ERROR_CODES,
    createError,
    notFoundError,
    validationError,
    badRequestError,
    unauthorizedError,
    forbiddenError,
    conflictError,
    serverError
};
