const express = require('express');
const router = express.Router();

const productController = require('../controllers/productControllers');
const validate = require('../middlewares/validateJoi');
const authMiddleware = require('../middlewares/authMiddlewares');
const { createProductSchema, updateProductSchema} = require('../validators/productValidators');


// Route pour ajouter un produit
router.post(
    '',
    authMiddleware,
    validate(createProductSchema),
    productController.createProduct
);


// Route pour récupérer les produits
router.get(
    '',
    authMiddleware,
    productController.getAllProducts
);


// Route pour récupérer la liste des produits de l'utilisateur connecté
router.get(
    '/my-products',
    authMiddleware,
    productController.getProductsByUserId
)


// Route pour récupérer la liste des produits actifs ou inactifs de l'utilisateur connecté
router.get(
    '/filter',
    authMiddleware,
    productController.getProductsByStatut
)


// Route pour récupérer la liste des produits d'un utilisateur connecté par catégorie
router.get(
    '/:category',
    authMiddleware,
    productController.getProductsByCategory
)


// Route pour récupérer la liste des produits d'un utilisateur connecté par catégorie et nom
router.get(
    '/search',
    authMiddleware,
    productController.getProductByCategoryAndName
)


// Route pour récupérer un produit par ID
router.get(
    '/:id',
    authMiddleware,
    productController.getProductById
)


// Route pour modifier un produit par ID
router.put(
    '/:id',
    authMiddleware,
    validate(updateProductSchema),
    productController.updateProductById
)


// Route pour supprimer un produit
router.delete(
    '/:id',
    authMiddleware,
    productController.deleteProductById
)


module.exports = router;