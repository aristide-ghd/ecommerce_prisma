const {prisma} = require('../../lib/prisma');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { conflictError, unauthorizedError, validationError, ERROR_CODES } = require('../errors');

// Logique metier pour l'inscription de l'utilisateur
exports.register = async ({ name, email, password }) => {

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw conflictError('Utilisateur déjà existant', ERROR_CODES.USER_EMAIL_EXISTS);
    }

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    return {
        data: user
    };
};

// Logique metier pour la connexion de l'utilisateur
exports.login = async ({ email, password }) => {

    if (!email || !password) {
        throw validationError("L'email et le mot de passe sont requis", ERROR_CODES.VALIDATION_MISSING_FIELD);
    }

    const existingEmail = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingEmail?.password) {
        throw unauthorizedError('Identifiants invalides', ERROR_CODES.AUTH_INVALID_CREDENTIALS);
    }

    const isValid = await argon2.verify(
        existingEmail.password,
        password
    );

    if (!isValid) {
        throw unauthorizedError('Identifiants invalides', ERROR_CODES.AUTH_INVALID_CREDENTIALS);
    }

    const token = jwt.sign(
        { userId: existingEmail.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return {
        token,
        user: {
            id: existingEmail.id,
            email: existingEmail.email,
            name: existingEmail.name,
        }
    };
};