import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { referenceCommande, fraisLivraison } from '@/lib/utils';

type ArticleRecu = { produitId: number; quantite: number };

/**
 * POST /api/commande — création d'une commande.
 *
 * Sécurité : les prix et les stocks sont relus EN BASE, jamais pris du panier local.
 * Tout se fait dans une transaction : soit la commande et la décrémentation du stock
 * passent ensemble, soit rien n'est enregistré.
 */
export async function POST(req: Request) {
  const garde = await requireUser();
  if ('error' in garde) return NextResponse.json({ erreur: garde.error }, { status: garde.status });

  const { articles, adresseLivraison, ville, codePostal, telephone, modePaiement } = await req.json();
  const modesPaiement = ['ORANGE_MONEY', 'MTN_MOMO', 'MOOV_MONEY', 'WAVE', 'LIVRAISON'];

  if (!Array.isArray(articles) || articles.length === 0) {
    return NextResponse.json({ erreur: 'Votre panier est vide.' }, { status: 400 });
  }
  if (!adresseLivraison?.trim() || !ville?.trim() || !codePostal?.trim() || !telephone?.trim()) {
    return NextResponse.json({ erreur: "Tous les champs de livraison sont obligatoires." }, { status: 400 });
  }
  if (modePaiement !== undefined && !modesPaiement.includes(modePaiement)) {
    return NextResponse.json({ erreur: 'Mode de paiement invalide.' }, { status: 400 });
  }

  const utilisateurId = Number(garde.session.sub);

  try {
    const commande = await prisma.$transaction(async (tx) => {
      const lignes: { produitId: number; quantite: number; prixUnitaire: number; nomProduit: string }[] = [];
      let total = 0;

      for (const a of articles as ArticleRecu[]) {
        const produit = await tx.produit.findUnique({ where: { id: Number(a.produitId) } });
        if (!produit || !produit.actif) throw new Error(`Produit #${a.produitId} indisponible.`);

        const quantite = Math.max(1, Math.floor(Number(a.quantite)));
        if (produit.stock < quantite) {
          throw new Error(`Stock insuffisant pour « ${produit.nom} » (reste ${produit.stock}).`);
        }

        const prixUnitaire = Math.round(Number(produit.prix));
        total += prixUnitaire * quantite;

        lignes.push({
          produitId: produit.id,
          quantite,
          prixUnitaire,
          nomProduit: produit.nom, // snapshot du nom au moment de l'achat
        });

        // Décrémentation du stock dans la même transaction
        await tx.produit.update({
          where: { id: produit.id },
          data: { stock: { decrement: quantite } },
        });
      }

      // Frais de livraison (règle métier : offerts dès 50 000 FCFA)
      const fraisPort = fraisLivraison(total);

      return tx.commande.create({
        data: {
          reference: referenceCommande(),
          statut: 'EN_ATTENTE',
          total: total + fraisPort,
          adresseLivraison: adresseLivraison.trim(),
          ville: ville.trim(),
          codePostal: codePostal.trim(),
          telephone: telephone.trim(),
          modePaiement: modePaiement ?? 'LIVRAISON',
          utilisateurId,
          lignes: { create: lignes },
        },
      });
    });

    return NextResponse.json({ ok: true, id: commande.id, reference: commande.reference });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erreur lors de la création de la commande.';
    return NextResponse.json({ erreur: message }, { status: 400 });
  }
}
