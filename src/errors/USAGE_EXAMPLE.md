# Guide d'utilisation des erreurs personnalisées

## Import

```javascript
const { 
    notFoundError, 
    validationError, 
    unauthorizedError,
    forbiddenError,
    conflictError,
    badRequestError,
    ERROR_CODES 
} = require('../errors');
```

## Utilisation dans les services

### Exemple 1 : Ressource non trouvée
```javascript
exports.getProductById = async (productId) => {
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });
    
    if (!product) {
        throw notFoundError('Produit non trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }
    
    return product;
};
```

### Exemple 2 : Validation
```javascript
exports.createProduct = async (data) => {
    if (!data.name || !data.price) {
        throw validationError('Nom et prix requis', ERROR_CODES.PRODUCT_INVALID_DATA);
    }
    
    // ...
};
```

### Exemple 3 : Conflit (ressource existante)
```javascript
exports.createProduct = async (data) => {
    const existing = await prisma.product.findFirst({
        where: { userId: data.userId, name: data.name }
    });
    
    if (existing) {
        throw conflictError('Ce produit existe déjà', ERROR_CODES.PRODUCT_ALREADY_EXISTS);
    }
    
    // ...
};
```

### Exemple 4 : Non autorisé
```javascript
exports.updateProduct = async (productId, userId, data) => {
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });
    
    if (product.userId !== userId) {
        throw forbiddenError(
            'Vous ne pouvez modifier que vos propres produits',
            ERROR_CODES.PERMISSION_NOT_OWNER
        );
    }
    
    // ...
};
```

### Exemple 5 : Stock insuffisant
```javascript
exports.createOrder = async (userId, items) => {
    for (const item of items) {
        const product = await prisma.product.findUnique({
            where: { id: item.productId }
        });
        
        if (product.stock < item.quantity) {
            throw badRequestError(
                `Stock insuffisant pour ${product.name}`,
                ERROR_CODES.PRODUCT_INSUFFICIENT_STOCK
            );
        }
    }
    
    // ...
};
```

## Format de réponse

Toutes les erreurs retournent ce format JSON :

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Produit non trouvé",
    "statusCode": 404,
    "timestamp": "2024-03-30T10:30:00.000Z",
    "path": "/api/products/123"
  }
}
```

## Fonctions disponibles

| Fonction | Status Code | Usage |
|----------|-------------|-------|
| `notFoundError()` | 404 | Ressource non trouvée |
| `validationError()` | 400 | Données invalides |
| `badRequestError()` | 400 | Requête invalide |
| `unauthorizedError()` | 401 | Non authentifié |
| `forbiddenError()` | 403 | Accès interdit |
| `conflictError()` | 409 | Ressource existante |
| `serverError()` | 500 | Erreur serveur |

## Codes d'erreur disponibles

Voir `src/errors/errorCodes.js` pour la liste complète des codes.
