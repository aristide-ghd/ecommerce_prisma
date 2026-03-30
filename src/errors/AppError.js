// Classe de base pour toutes les erreurs personnalisées de l'application
// Hérite de Error pour avoir une stack trace correcte
class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true; // Erreur opérationnelle (pas un bug)
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
