const {prisma} = require('../../lib/prisma');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

// Logique metier pour l'inscription de l'utilisateur
exports.register = async ({ name, email, password }) => {

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('Utilisateur deja existant');
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
        throw new Error("L'email et le mot de passe sont requis");
    }

    const existingEmail = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingEmail?.password) {
        throw new Error('Identifiants invalides');
    }

    const isValid = await argon2.verify(
        existingEmail.password,
        password
    );

    if (!isValid) {
        throw new Error('Identifiants invalides');
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