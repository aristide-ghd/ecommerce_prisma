const { prisma } = require('../../lib/prisma');
const { notFoundError, conflictError, ERROR_CODES } = require('../errors');

// Logique metier pour ajouter un produit
exports.createProduct = async (data) => {
    const {name, description, price, stock, category, userId} = data;

    const existingProduct = await prisma.product.findFirst({
        where: {
            userId,
            category,
            name
        }
    })

    if (existingProduct) {
        throw conflictError('Ce produit existe déjà', ERROR_CODES.PRODUCT_ALREADY_EXISTS);
    }

    const registerProduct = await prisma.product.create({
        data: {
            name,
            description,
            price,
            stock,
            category,
            userId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });

    return registerProduct;
};


// Logique metier pour récupérer tous les produits
exports.getAllProducts = async () => {
    const products = await prisma.product.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    if (products.length === 0) {
        throw notFoundError('Aucun produit trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return products;
};


// Logique metier pour récupérer un produit par son ID
exports.getProductById = async (productId) => {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });

    if (!product) {
        throw notFoundError('Produit non trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return product;
};


// Logique metier pour modifier un produit par ID
exports.updateProductById = async (productId, data) => {
    const {name, description, price, stock, category} = data;

    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!existingProduct) {
        throw notFoundError('Produit non trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            name,
            description,
            price,
            stock,
            category
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            }
        }
    });

    return updatedProduct;
};


// Logique metier pour supprimer un produit
exports.deleteProductById = async (productId) => {
    // Vérifier que le produit existe
    const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!existingProduct) {
        throw notFoundError('Produit non trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    await prisma.product.delete({
        where: { id: productId }
    });

    return { message: 'Produit supprimé avec succès' };
};


// Logique métier pour récupérer la liste des produits de l'utilisateur connecté par ordre décroissant des prix
exports.getProductsByUserId = async (userId) => {

    const getProducts = await prisma.product.findMany({
        where: {
            userId
        },
        orderBy: {
            price: 'desc'
        }
    })

    if (getProducts.length === 0) {
        throw notFoundError('Aucun produit trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return getProducts;
}


// Logique metier pour récupérer la liste des produits de l'userId par catégorie
exports.getProductsByCategory = async (userId, category) => {

    const productsByCategory = await prisma.product.findMany({
        where: {
            userId,
            category: {
                equals: category,
                mode: "insensitive"
            }
        }
    })

    if (productsByCategory.length === 0) {
        throw notFoundError('Aucun produit trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return productsByCategory;
}


// Logique metier pour récupérer un produit de l'userId par catégorie et par nom
exports.getProductByCategoryAndName = async (userId, category, name) => {

    const productByCategorieAndName = await prisma.product.findFirst({
        where: {
            userId,
            category: {
                equals: category,
                mode: "insensitive"
            },
            name: {
                equals: name,
                mode: "insensitive"
            }
        }
    })

    if (!productByCategorieAndName) {
        throw notFoundError('Aucun produit trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return productByCategorieAndName;
}


// Logique metier pour récupérer la liste des produits de l'userId qui sont actifs ou inactifs
exports.getProductsByStatut = async (userId, isActive) => {
    let isActiveBoolean;

    if ( isActive === true || isActive === "true" ) {
        isActiveBoolean = true;
    }
    if ( isActive === false || isActive === "false" ){
        isActiveBoolean = false;
    }

    const productsByStatut = await prisma.product.findMany({
        where: {
            userId,
            isActive: isActiveBoolean
        }
    })

    if (productsByStatut.length === 0) {
        throw notFoundError('Aucun produit trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return productsByStatut;
}


// Logique métier pour compter le nombre de produits de l'utilisateur connecté par category
exports.countProductsByCategory = async (userId, category) => {
    const countByCategory = await prisma.product.count({
        where: {
            userId,
            category: {
                equals: category,
                mode: "insensitive"
            }
        }
    })

    if (!countByCategory) {
        throw notFoundError('Aucun produit trouvé', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    return countByCategory;
}