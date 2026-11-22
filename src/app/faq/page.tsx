const questions = [
  ['Quels produits propose Kolatier ?', 'Une sélection d’articles inspirés des savoir-faire, de l’artisanat et des produits du terroir ivoirien.'],
  ['Quels sont les délais de livraison ?', 'Comptez environ 24 h dans les communes d’Abidjan et 48 à 72 h pour l’intérieur du pays. Ces délais sont indicatifs.'],
  ['Combien coûte la livraison ?', 'Elle coûte 2 000 FCFA et devient gratuite dès 50 000 FCFA d’achat.'],
  ['Quels moyens de paiement sont proposés ?', 'Orange Money, MTN MoMo, Moov Money, Wave et le paiement à la livraison sont présentés. Ils sont tous simulés dans cette démonstration.'],
  ['Puis-je retourner un article ?', 'Pour toute demande concernant un article reçu, contactez-nous via le formulaire ou WhatsApp en précisant la référence de commande. Les retours sont décrits dans les CGV du projet.'],
  ['Comment Kolatier lutte-t-il contre la contrefaçon ?', 'Nous privilégions les partenaires locaux et décrivons l’origine, l’artisan et les matières lorsque ces informations sont disponibles.'],
  ['Comment suivre ma commande ?', 'Connectez-vous puis ouvrez « Mes commandes » pour consulter le statut de chaque commande.'],
  ['Puis-je laisser un avis ?', 'Oui. Un client connecté peut déposer un avis après la livraison d’une commande contenant le produit concerné.'],
];

export const metadata = { title: 'Questions fréquentes' };

export default function FaqPage() {
  return (
    <div className="conteneur py-10">
      <h1 className="titre text-3xl font-bold">Questions fréquentes</h1>
      <p className="mt-2 text-slate-600">Les réponses aux questions les plus courantes sur Kolatier.</p>
      <div className="mt-6 space-y-3">
        {questions.map(([question, reponse]) => (
          <details key={question} className="carte group p-5">
            <summary className="cursor-pointer font-semibold text-terre">{question}</summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{reponse}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
