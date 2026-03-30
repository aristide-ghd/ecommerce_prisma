-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('EN_ATTENTE', 'CONFIRMEE', 'LIVREE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('EN_ATTENTE', 'PAYEE');

-- CreateTable
CREATE TABLE "commandes" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "numeroCommande" TEXT NOT NULL,
    "montantTotal" DECIMAL(10,2) NOT NULL,
    "statut" "StatutCommande" NOT NULL DEFAULT 'EN_ATTENTE',
    "statutPaiement" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bon_de_commandes" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "nomProduit" TEXT NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prixUnitaire" DECIMAL(10,2) NOT NULL,
    "prixTotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commandeId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "bon_de_commandes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commandes_numeroCommande_key" ON "commandes"("numeroCommande");

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bon_de_commandes" ADD CONSTRAINT "bon_de_commandes_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "commandes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bon_de_commandes" ADD CONSTRAINT "bon_de_commandes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
