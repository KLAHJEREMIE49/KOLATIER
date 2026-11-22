export const metadata = { title: 'Conditions générales de vente' };

export default function CgvPage() {
  return (
    <article className="conteneur prose prose-slate max-w-3xl py-10">
      <h1 className="titre">Conditions générales de vente</h1>
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Ce document décrit le parcours de commande d’un projet pédagogique. Kolatier n’est pas un vendeur opérationnel : aucune commande n’entraîne de vente ou de paiement réel.</p>
      <h2>1. Produits et prix</h2>
      <p>Les articles, leur origine et leur disponibilité sont présentés à titre de démonstration. Les prix sont exprimés en francs CFA (XOF), sans centimes.</p>
      <h2>2. Commandes et paiement</h2>
      <p>Une commande enregistrée dans le prototype sert à illustrer le suivi de panier et de stock. Orange Money, MTN MoMo, Moov Money, Wave et le paiement à la livraison sont simulés ; aucune information de paiement ne doit être saisie.</p>
      <h2>3. Livraison</h2>
      <p>Les délais affichés sont indicatifs : environ 24 h dans les communes d’Abidjan et 48 à 72 h à l’intérieur du pays. Les frais simulés sont de 2 000 FCFA, offerts dès 50 000 FCFA.</p>
      <h2>4. Retours et réclamations</h2>
      <p>Dans un contexte commercial réel, toute demande relative à un produit ou une livraison devrait être examinée par le vendeur. Pour le prototype, utilisez le formulaire de contact à des fins de démonstration.</p>
      <h2>5. Données de démonstration</h2>
      <p>Les comptes et commandes créés sont des données de projet. Ne renseignez pas de données personnelles sensibles.</p>
      <p>Ces conditions ne constituent pas un contrat de vente. Pour toute exploitation commerciale en Côte d’Ivoire, des conditions conformes au droit ivoirien et au service réellement proposé devront être établies.</p>
    </article>
  );
}
