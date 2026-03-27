const Joi = require('joi');

exports.modifyUserByIdSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .optional().messages({
        'string.empty': 'Le nom ne peut pas être vide',
        'string.min': 'Le nom doit contenir au moins 2 caractères',
        'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
    email: Joi.string()
        .email()
        .optional().messages({
        'string.empty': 'L\'email ne peut pas être vide',
        'string.email': 'L\'email doit être valide'
    }),
})