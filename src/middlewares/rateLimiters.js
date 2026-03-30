const rateLimit = require('express-rate-limit');

// Rate limit global pour toute l'application
exports.globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes toutes les 15 minutes
    message: {
        message: 'Trop de requêtes, réessayez plus tard'
    }
});

// Rate limit strict pour la connexion (protection contre force brute)
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives de connexion toutes les 15 minutes
    skipSuccessfulRequests: true, // Ne compte que les échecs
    message: {
        message: 'Trop de tentatives de connexion, reesayer plus tard'
    }
});
