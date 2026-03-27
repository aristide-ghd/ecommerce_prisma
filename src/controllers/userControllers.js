const userServices = require('../services/userServices');

// Retourne la liste de tous les utilisateurs
exports.getUsers = async(req, res) => {
    try{
        const result = await userServices.getUsers();

        res.status(200).json(result);
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}

// Retourne les infos d'un utilisateur par son id
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await userServices.getUserById(id);

        res.status(200).json(result);
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
}


// Vérifie si id = userId, exige que l'utilisateur soit connecter, récupéré les infos, appelle le service et gere les erreurs
exports.modifyUserById = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const {name, email} = req.body;

        // Vérifier que l'utilisateur modifie bien son propre profil
        if (id !== userId) {
            return res.status(403).json({
                message: 'Vous ne pouvez modifier que votre propre profil'
            });
        }

        const result = await userServices.modifyUserById(userId, {name, email});

        res.status(200).json({
            message: "Utilisateur modifié avec succès",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

// Vérifie si id = userId et supprime l'utilisateur
exports.deleteUserById = async (req, res) => {
    try{
        const { id } = req.params;
        const userId = req.user.userId;

        // Vérifier que l'utilisateur supprime bien son propre profil
        if (id !== userId) {
            return res.status(403).json({
                message: 'Vous ne pouvez supprimer que votre propre profil'
            });
        }

        const result = await userServices.deleteUserById(userId);

        res.status(200).json(result);
    }catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}
