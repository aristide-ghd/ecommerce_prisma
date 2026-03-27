const productServices = require('../services/productServices');
const {prisma} = require("../../lib/prisma");

// Créer un produit
exports.createProduct = async (req, res) => {
    try {
        const userId = req.user.userId; // Récupéré depuis le JWT
        const { name, description, price, stock, category } = req.body;

        const product = await productServices.createProduct({
            name,
            description,
            price,
            stock,
            category,
            userId
        });

        res.status(201).json({
            message: 'Produit créé avec succès',
            product
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productServices.getAllProducts();

        res.status(200).json({
            products
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Récupérer un produit par son ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productServices.getProductById(id);

        res.status(200).json({
            product
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};


// Modifier un produit
exports.updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const { name, description, price, stock, category } = req.body;

        const product = await productServices.getProductById(id);

        if (product.userId !== userId) {
            return res.status(403).json({
                message: 'Vous ne pouvez modifier que vos propres produits'
            });
        }

        const updatedProduct = await productServices.updateProductById(id, {
            name,
            description,
            price,
            stock,
            category
        });

        res.status(200).json({
            message: 'Produit modifié avec succès',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Supprimé un produit
exports.deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const product = await productServices.getProductById(id);

        if (product.userId !== userId) {
            return res.status(403).json({
                message: 'Vous ne pouvez supprimer que vos propres produits'
            });
        }

        const result = await productServices.deleteProductById(id);

        res.status(200).json({
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Récupérer la liste des produits d'un utilisateur
exports.getProductsByUserId = async (req, res) => {
    try{
        const userId = req.user.userId;

        const getProducts = await productServices.getProductsByUserId(userId);

        res.status(200).json(getProducts);
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}


// Récupérer la liste des produits d'un utilisateur par catégorie
exports.getProductsByCategory = async (req, res) => {
    try{
        const { category } = req.params;
        const userId = req.user.userId;

        const productsByCategorie = await productServices.getProductsByCategory(userId, category);

        res.status(200).json(productsByCategorie)
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}


// Récupérer la liste des produits d'un utilisateur par catégorie et nom
exports.getProductByCategoryAndName = async (req, res) => {
    try{
        const { category, name } = req.query;
        const userId = req.user.userId;

        const productByCategorieAndName = await productServices.getProductByCategoryAndName(userId, category, name);

        res.status(200).json(productByCategorieAndName);
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}


// Retourner la liste des produits d'un utilisateur par statut
exports.getProductsByStatut = async (req, res) => {
    try{
        const { isActive } = req.query;
        const userId = req.user.userId;

        const productsByStatut = await productServices.getProductsByStatut(userId, isActive);

        res.status(200).json(productsByStatut);
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
}
