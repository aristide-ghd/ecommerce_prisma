const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderControllers');
const authMiddleware = require('../middlewares/authMiddlewares');
const validateJoi = require('../middlewares/validateJoi');
const {
    createOrderSchema,
    updateOrderStatusSchema,
    updatePaymentStatusSchema } = require('../validators/orderValidators');

// Route pour créer une commande
router.post(
    '/',
    authMiddleware,
    validateJoi(createOrderSchema),
    orderController.createOrder
);

// Route pour récupérer toutes les commandes
router.get(
    '/',
    authMiddleware,
    orderController.getOrders
);

// Route pour récupérer les commandes de l'utilisateur connecté
router.get(
    '/my-orders',
    authMiddleware,
    orderController.getUserOrders
);

// Route pour récupérer une commande par ID
router.get(
    '/:id',
    authMiddleware,
    orderController.getOrderById
);

// Route pour mettre à jour le statut de la commande
router.patch(
    '/:id/statut',
    authMiddleware,
    validateJoi(updateOrderStatusSchema),
    orderController.updateOrderStatus
);

// Route pour mettre à jour le statut de paiement
router.patch(
    '/:id/paiement',
    authMiddleware,
    validateJoi(updatePaymentStatusSchema),
    orderController.updatePaymentStatus
);

// Route pour annuler une commande
router.patch(
    '/:id/annuler',
    authMiddleware,
    orderController.cancelOrder
);

// Route pour supprimer une commande
router.delete(
    '/:id',
    authMiddleware,
    orderController.deleteOrder
)

module.exports = router;
