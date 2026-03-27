const {prisma} = require('../../lib/prisma');


//Logique metier pour récupérer tous les utilisateurs
exports.getUsers = async() => {
    const allUsers = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return {
        data: allUsers
    }
}

//Logique metier pour récupérer un utilisateur par id
exports.getUserById = async(id) => {
    // Récupérer l'utilisateur par son ID
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }

    return {
        data: user
    };
}

// Logique metier pour modifier les infos d'un utilisateur
exports.modifyUserById = async(userId, {name, email}) => {
    // Vérifier si l'utilisateur connecté existe
    const existingUser = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return {
        data: updatedUser
    };
}

// Logique metier pour supprimer un utilisateur
exports.deleteUserById = async(userId) => {
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
        where: { id: userId }
    });

    return {
        message: 'Utilisateur supprimé avec succès'
    };
}