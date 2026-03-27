const authServices = require('../services/authServices');

// Recuperes les donnees, appelle le service et gere les erreurs pour l'inscription
exports.register = async(req, res) => {
    try{
        const { name, email, password } = req.body;

        const result = await authServices.register({
            name,
            email,
            password,
        });

        res.status(201).json(result);
    }catch(error){
        res.status(400).json({
            message: error.message,
        })
    }
}

// Recuperes les donnees, appelle le service et gere les erreurs pour la connexion
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await authServices.login({
            email,
            password,
        });

        res.status(200).json(result);
    }catch (error){
        res.status(400).json({
            message: error.message,
        })
    }
}