const { prisma } = require('../../lib/prisma');
const { notFoundError, badRequestError, ERROR_CODES } = require('../errors');


// Fonction pour générer un numéro de commande unique
const generateOrderNumber = () => {
    // Récupère le timestamp actuel (nombre de millisecondes depuis 1970)
    const timestamp = Date.now();
    
    // Génère un code aléatoire de 4 caractères
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `CMD-${timestamp}-${random}`;
};


// Logique métier pour créer une commande
exports.createOrder = async (userId, items) => {
    // Générer le numéro de commande
    const numeroCommande = generateOrderNumber();

    // Récupérer les IDs des produits
    const productIds = items.map(item => item.productId);

    // On cherche tous les produits avec ces IDs dans la base de données
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds },  // Cherche les produits dont l'ID est dans la liste
            isActive: true           // Et qui sont actifs
        }
    });
    
    // Si on ne trouve pas tous les produits, on arrête
    // Si items a 2 produits, mais products n'en a trouvé qu'un
    if (products.length !== items.length) {
        throw notFoundError('Un ou plusieurs produits sont introuvables ou inactifs', ERROR_CODES.PRODUCT_NOT_FOUND);
    }

    // Vérifier le stock et calculer les prix
    let montantTotal = 0;
    
    // Utilise .map() pour transformer chaque item en ligne de commande
    const bonDeCommandesData = items.map(item => {
        // Trouver le produit correspondant
        const product = products.find(p => p.id === item.productId);
        
        // Si le produit n'existe pas
        if (!product) {
            throw notFoundError(`Produit ${item.productId} introuvable`, ERROR_CODES.PRODUCT_NOT_FOUND);
        }
        
        // Vérifier le stock
        if (product.stock < item.quantite) {
            throw badRequestError(
                `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}, Demandé: ${item.quantite}`,
                ERROR_CODES.PRODUCT_INSUFFICIENT_STOCK
            );
        }
        
        // Calculer les prix
        const prixUnitaire = product.price;
        const prixTotal = prixUnitaire * item.quantite;
        montantTotal += Number(prixTotal);
        
        // Retourner les données de la ligne de commande
        return {
            productId: product.id,
            nomProduit: product.name,
            quantite: item.quantite,
            prixUnitaire: prixUnitaire,
            prixTotal: prixTotal
        };
    });

    // $transaction : Garantit que toutes les opérations réussissent ou échouent ensemble (atomicité)
    // Si une erreur survient, toutes les modifications sont annulées (rollback)
    const commande = await prisma.$transaction(async (tx) => {
        // tx : Instance Prisma temporaire pour cette transaction
        // Toutes les opérations doivent utiliser "tx" au lieu de "prisma"
        
        // Créer la commande principale
        const newCommande = await tx.commande.create({
            data: {
                numeroCommande,
                userId,
                montantTotal,
                statut: 'EN_ATTENTE',
                statutPaiement: 'EN_ATTENTE',
                bonDeCommandes: {
                    create: bonDeCommandesData  // Créer toutes les lignes en même temps
                }
            },
            include: {
                bonDeCommandes: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                category: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        
        // Décrémenter le stock de chaque produit
        // Promise.all() : Exécute toutes les mises à jour en parallèle (plus rapide)
        // tx.product.update() : Utilise "tx" pour que l'opération fasse partie de la transaction
        await Promise.all(
            items.map(item =>
                tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantite
                        }
                    }
                })
            )
        );
        
        // Retourner la commande créée
        return newCommande;
    });


    return commande;
};


// Logique métier pour récupérer les commandes d'un utilisateur
exports.getUserOrders = async (userId) => {
    const commandes = await prisma.commande.findMany({
        where: { userId },
        include: {
            bonDeCommandes: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            category: true
                        }
                    }
                }
            }
        },
        orderBy: {
            dateCommande: 'desc'
        }
    });

    if (!commandes.length) {
        throw notFoundError('Aucune commande trouvée', ERROR_CODES.ORDER_NOT_FOUND);
    }
    
    return commandes;
};


// Logique métier pour récupérer une commande par ID
exports.getOrderById = async (orderId) => {
    const commande = await prisma.commande.findUnique({
        where: { id: orderId },
        include: {
            bonDeCommandes: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            category: true
                        }
                    }
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    
    if (!commande) {
        throw notFoundError('Commande non trouvée', ERROR_CODES.ORDER_NOT_FOUND);
    }
    
    return commande;
};


// Logique métier pour mettre à jour le statut de la commande
exports.updateOrderStatus = async (orderId, statut) => {

    const existingOrder = await prisma.commande.findUnique({
        where: { id: orderId },
    })

    if (!existingOrder) {
        throw notFoundError('Commande non trouvée', ERROR_CODES.ORDER_NOT_FOUND);
    }

    const commande = await prisma.commande.update({
        where: { id: orderId },
        data: { statut }
    });

    return commande;
};


// Logique métier pour mettre à jour le statut de paiement
exports.updatePaymentStatus = async (orderId, statutPaiement) => {

    const existingOrder = await prisma.commande.findUnique({
        where: { id: orderId },
    })

    if (!existingOrder) {
        throw notFoundError('Commande non trouvée', ERROR_CODES.ORDER_NOT_FOUND);
    }

    const commande = await prisma.commande.update({
        where: { id: orderId },
        data: { statutPaiement }
    });
    
    return commande;
};


// Logique métier pour annuler une commande
exports.cancelOrder = async (orderId) => {

    const commande = await prisma.commande.findUnique({
        where: { id: orderId },
        include: {
            bonDeCommandes: true
        }
    });
    
    if (!commande) {
        throw notFoundError('Commande non trouvée', ERROR_CODES.ORDER_NOT_FOUND);
    }
    
    if (commande.statut === 'LIVREE') {
        throw badRequestError('Impossible d\'annuler une commande déjà livrée', ERROR_CODES.ORDER_ALREADY_DELIVERED);
    }
    
    if (commande.statut === 'ANNULEE') {
        throw badRequestError('Cette commande est déjà annulée', ERROR_CODES.ORDER_ALREADY_CANCELLED);
    }
    
    // $transaction : Garantit que l'annulation et la remise en stock se font ensemble
    // Si une opération échoue, tout est annulé (rollback)
    const updatedCommande = await prisma.$transaction(async (tx) => {
        // tx : Instance Prisma temporaire pour cette transaction
        
        // Mettre à jour le statut
        const cancelled = await tx.commande.update({
            where: { id: orderId },
            data: { statut: 'ANNULEE' }
        });
        
        // Remettre le stock des produits
        // Promise.all() : Exécute toutes les mises à jour en parallèle
        // tx.product.update() : Utilise "tx" pour que l'opération fasse partie de la transaction
        await Promise.all(
            commande.bonDeCommandes.map(item =>
                tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantite
                        }
                    }
                })
            )
        );
        
        return cancelled;
    });
    
    return updatedCommande;
};


//Logique métier pour supprimer une commande
exports.deleteOrder = async(orderId) => {
    const commande = await prisma.commande.findUnique({
        where: {
            id: orderId
        }
    })

    if (!commande) {
        throw notFoundError('Commande non trouvée', ERROR_CODES.ORDER_NOT_FOUND)
    }

    await prisma.commande.delete({
        where: { id: orderId }
    })

    return { message: "Commande supprimée avec succès" }
}