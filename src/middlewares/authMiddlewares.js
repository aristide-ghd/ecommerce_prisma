const jwt = require('jsonwebtoken');
const { prisma } = require('../../lib/prisma');

// Vérifie la validité dui token
module.exports = (req, res, next) => {
    try {
        // Récupère le header Authorization de la requête HTTP
        const authHeader = req.headers.authorization;

        // Vérifie si le header existe ET s'il commence par "Bearer " . Format attendu : "Bearer TOKEN"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Accès non autorisé'
            });
        }

        // Extraction du token (on enlève "Bearer "). Exemple : "Bearer abc123" → "abc123"
        const token = authHeader.split(' ')[1];

        // Vérifie et décode le token avec la clé secrète. Si le token est invalide ou expiré → erreur levée
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ajoute les données décodées dans la requête. Exemple : { userId: 1 } .Cela permet d'utiliser ces infos dans les routes suivantes
        req.user = decoded;

        // Passe au middleware suivant (ou au controller)
        next();

    } catch (error) {
        // Si erreur (token invalide, expiré, mal formé)
        return res.status(401).json({
            message: 'Token invalide ou expiré'
        });
    }
};


// Vérifie si l'utilisateur est connecté
exports.verifyUserExists = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé, veuillez vous reconnecter'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
