const Joi = require('joi');

exports.createProductSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required().messages({
        'string.empty': 'Le nom du produit est requis',
        'string.min': 'Le nom doit contenir au moins 3 caractères',
        'any.required': 'Le nom du produit est requis'
    }),

    description: Joi.string()
        .min(10)
        .max(1000)
        .required().messages({
        'string.empty': 'La description est requise',
        'string.min': 'La description doit contenir au moins 10 caractères',
        'any.required': 'La description est requise'
    }),

    price: Joi.number()
        .positive()
        .precision(2)
        .required().messages({
        'number.base': 'Le prix doit être un nombre',
        'number.positive': 'Le prix doit être positif',
        'any.required': 'Le prix est requis'
    }),

    stock: Joi.number()
        .integer()
        .min(0)
        .required().messages({
        'number.base': 'Le stock doit être un nombre',
        'number.min': 'Le stock ne peut pas être négatif',
        'any.required': 'Le stock est requis'
    }),

    category: Joi.string().max(50).optional()
});

exports.updateProductSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .optional().messages({
        'string.empty': 'Le nom du produit ne peut pas être vide',
        'string.min': 'Le nom doit contenir au moins 3 caractères'
    }),

    description: Joi.string()
        .min(10)
        .max(1000)
        .optional().messages({
        'string.empty': 'La description ne peut pas être vide',
        'string.min': 'La description doit contenir au moins 10 caractères'
    }),

    price: Joi.number()
        .positive()
        .precision(2)
        .optional().messages({
        'number.base': 'Le prix doit être un nombre',
        'number.positive': 'Le prix doit être positif'
    }),

    stock: Joi.number()
        .integer()
        .min(0)
        .optional().messages({
        'number.base': 'Le stock doit être un nombre',
        'number.min': 'Le stock ne peut pas être négatif'
    }),

    category: Joi.string().max(50).optional()
});
