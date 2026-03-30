const Joi = require('joi');

exports.createOrderSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                productId: Joi.string().required().messages({
                    'any.required': 'L\'ID du produit est requis',
                    'string.empty': 'L\'ID du produit ne peut pas être vide'
                }),
                quantite: Joi.number().integer().min(1).required().messages({
                    'any.required': 'La quantité est requise',
                    'number.base': 'La quantité doit être un nombre',
                    'number.min': 'La quantité doit être au moins 1'
                })
            })
        )
        .min(1)
        .required()
        .messages({
            'any.required': 'La liste des produits est requise',
            'array.min': 'La commande doit contenir au moins un produit'
        })
});

exports.updateOrderStatusSchema = Joi.object({
    statut: Joi.string()
        .valid('EN_ATTENTE', 'CONFIRMEE', 'LIVREE', 'ANNULEE')
        .required()
        .messages({
            'any.required': 'Le statut est requis',
            'any.only': 'Le statut doit être EN_ATTENTE, CONFIRMEE, LIVREE ou ANNULEE'
        })
});

exports.updatePaymentStatusSchema = Joi.object({
    statutPaiement: Joi.string()
        .valid('EN_ATTENTE', 'PAYEE')
        .required()
        .messages({
            'any.required': 'Le statut de paiement est requis',
            'any.only': 'Le statut de paiement doit être EN_ATTENTE ou PAYEE'
        })
});
