export const metadata = { title: 'Mentions légales' };

export default function MentionsLegalesPage() {
  return (
    <article className="conteneur prose prose-slate max-w-3xl py-10">
      <h1 className="titre">Mentions légales</h1>
      <p><strong>Kolatier</strong> est une boutique en ligne fictive conçue comme projet pédagogique de Génie Logiciel en Licence 3. Elle n’est pas une entreprise commerciale et ne réalise aucune vente ni transaction financière réelle.</p>
      <h2>Édition du site</h2>
      <p>Le site est un prototype académique de démonstration. Les coordonnées et contenus illustratifs ne constituent pas une offre commerciale.</p>
      <h2>Hébergement et données</h2>
      <p>Les données saisies servent uniquement à démontrer le fonctionnement de l’application et de sa base de données. N’y transmettez aucune donnée bancaire ni information sensible.</p>
      <p>En cas de mise en service commerciale en Côte d’Ivoire, les informations sur l’éditeur, l’hébergement et le traitement des données devraient être complétées et vérifiées au regard des règles ivoiriennes applicables.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les textes et illustrations créés pour la démonstration sont présentés à des fins pédagogiques. Les noms de services de paiement cités appartiennent à leurs titulaires respectifs.</p>
    </article>
  );
}
