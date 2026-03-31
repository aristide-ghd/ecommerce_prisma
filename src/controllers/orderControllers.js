const orderServices = require('../services/orderServices');
const { forbiddenError } = require('../errors/errorFactory');

// Créer une commande
exports.createOrder = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { items } = req.body;
        
        const commande = await orderServices.createOrder(userId, items);
        
        res.status(201).json({
            success: true,
            message: 'Commande créée avec succès',
            data: commande
        });
    } catch (error) {
        next(error);
    }
};

// Récupérer les commandes de l'utilisateur connecté
exports.getUserOrders = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        
        const commandes = await orderServices.getUserOrders(userId);
        
        res.status(200).json({
            success: true,
            data: commandes
        });
    } catch (error) {
        next(error);
    }
};

// Récupérer une commande par ID
exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        const commande = await orderServices.getOrderById(id);
        
        // Vérifier que l'utilisateur est propriétaire de la commande
        if (commande.userId !== userId) {
            throw forbiddenError('Vous ne pouvez consulter que vos propres commandes');
        }
        
        res.status(200).json({
            success: true,
            data: commande
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour le statut de la commande
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;
        const userId = req.user.userId;
        
        const commande = await orderServices.getOrderById(id);
        
        // Vérifier que l'utilisateur est propriétaire
        if (commande.userId !== userId) {
            const { forbiddenError } = require('../errors/errorFactory');
            throw forbiddenError('Vous ne pouvez modifier que vos propres commandes');
        }
        
        const updatedCommande = await orderServices.updateOrderStatus(id, statut);
        
        res.status(200).json({
            success: true,
            message: 'statut de la commande mis à jour',
            data: updatedCommande
        });
    } catch (error) {
        next(error);
    }
};

// Mettre à jour le statut de paiement
exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { statutPaiement } = req.body;
        const userId = req.user.userId;
        
        const commande = await orderServices.getOrderById(id);
        
        // Vérifier que l'utilisateur est propriétaire
        if (commande.userId !== userId) {
            const { forbiddenError } = require('../errors/errorFactory');
            throw forbiddenError('Vous ne pouvez modifier que vos propres commandes');
        }
        
        const updatedCommande = await orderServices.updatePaymentStatus(id, statutPaiement);
        
        res.status(200).json({
            success: true,
            message: 'statut de paiement mis à jour',
            data: updatedCommande
        });
    } catch (error) {
        next(error);
    }
};

// Annuler une commande
exports.cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        
        const commande = await orderServices.getOrderById(id);
        
        // Vérifier que l'utilisateur est propriétaire
        if (commande.userId !== userId) {
            const { forbiddenError } = require('../errors/errorFactory');
            throw forbiddenError('Vous ne pouvez annuler que vos propres commandes');
        }
        
        const cancelledCommande = await orderServices.cancelOrder(id);
        
        res.status(200).json({
            success: true,
            message: 'Commande annulée avec succès',
            data: cancelledCommande
        });
    } catch (error) {
        next(error);
    }
};
