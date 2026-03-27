const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required().messages({
        'any.required': 'Le nom est requis',
        'string.empty': 'Le nom ne peut pas être vide',
        'string.min': 'Le nom doit contenir au moins 2 caractères',
        'string.max': 'Le nom ne peut pas dépasser 50 caractères'
    }),
    email: Joi.string()
        .email()
        .required().messages({
        'any.required': 'L\'email est requis',
        'string.empty': 'L\'email ne peut pas être vide',
        'string.email': 'L\'email doit être valide'
    }),
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required().messages({
        'any.required': 'Le mot de passe est requis',
        'string.empty': 'Le mot de passe ne peut pas être vide',
        'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)',
        'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
        'string.max': 'Le mot de passe ne peut pas dépasser 128 caractères'
    })
});

exports.loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required().messages({
        'any.required': 'L\'email est requis',
        'string.empty': 'L\'email ne peut pas être vide',
        'string.email': 'L\'email doit être valide'
    }),
    password: Joi.string()
        .required().messages({
        'any.required': 'Le mot de passe est requis',
        'string.empty': 'Le mot de passe ne peut pas être vide'
    })
});