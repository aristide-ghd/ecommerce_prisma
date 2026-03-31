const express = require('express');
const router = express.Router();

const authMiddleware  = require('../middlewares/authMiddlewares');
const validate = require('../middlewares/validateJoi');
const { modifyUserByIdSchema } = require('../validators/userValidators');
const userControllers = require('../controllers/userControllers');


// Route publique - Récupérer tous les utilisateurs
router.get(
    '',
    userControllers.getUsers
);


// Route publique - Récupérer un utilisateur par son ID
router.get(
    '/:id',
    userControllers.getUserById
)


// Route protégée - Modifier son propre profil
router.patch(
    '/:id/update',
    authMiddleware,
    validate(modifyUserByIdSchema),
    userControllers.modifyUserById
);


//Route protégée - Supprimer son propre profil
router.delete(
    '/:id/cancel',
    authMiddleware,
    userControllers.deleteUserById
)


module.exports = router;