const express = require('express');
const router = express.Router();

const { loginLimiter } = require('../middlewares/rateLimiters');
const validate = require('../middlewares/validateJoi');
const { registerSchema, loginSchema } = require('../validators/authValidators');
const authController = require('../controllers/authControllers');

// Routes pour l'authentification
router.post(
    '/register',
    validate(registerSchema),
    authController.register
);


router.post(
    '/login',
    loginLimiter,
    validate(loginSchema),
    authController.login
);


module.exports = router;