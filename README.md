# Kolatier — Plateforme E-Commerce (TypeScript · Next.js · Prisma · PostgreSQL)

Projet réalisé à partir du cahier des charges « Projet E-Commerce ».
**Un seul langage de programmation** est utilisé pour tout le projet : **TypeScript**, du frontend
(React / Next.js App Router) jusqu'au backend (API Routes + Prisma + PostgreSQL).

---

## 1. Stack technique

| Couche | Technologie |
|--------|-------------|
| Langage unique | **TypeScript** (strict) |
| Frontend | **Next.js 14 (App Router)**, React 18, **Tailwind CSS** |
| Backend | **API Routes** Next.js (Node) |
| ORM / BDD | **Prisma 5** + **PostgreSQL** |
| Authentification | JWT signé (`jose`) en cookie **httpOnly** + **bcrypt** pour les mots de passe |
| Panier | **Zustand** + `persist` (localStorage) |

---

## 2. Prérequis

- Node.js **18.17+** (testé sur Node 22)
- PostgreSQL **13+** (testé sur PostgreSQL 16)
- npm

---

## 3. Configuration de la base de données

Le cahier des charges impose : **port `2020`** et **mot de passe `papa`**.

```bash
# Créer la base (adaptez le nom d'utilisateur si besoin)
psql -h localhost -p 2020 -U postgres -c "CREATE DATABASE ecommerce;"
```

Le fichier `.env` (déjà fourni, identique à `.env.example`) contient :

```env
JWT_SECRET="changez-moi-en-une-chaine-aleatoire-de-32-caracteres-minimum"
DATABASE_URL="postgresql://postgres:papa@localhost:2020/ecommerce"
```

> **Hypothèses à ajuster si nécessaire** : l'utilisateur PostgreSQL `postgres` et le nom de base
> `ecommerce` sont des choix par défaut. Si votre serveur utilise un autre utilisateur
> (ex. `monuser`) ou un autre nom de base, modifiez simplement `DATABASE_URL`.
> Si votre serveur PostgreSQL n'écoute pas sur le port 2020 : `postgres -D <datadir> -p 2020`
> ou dans `postgresql.conf` → `port = 2020`.

---

## 4. Installation & démarrage

```bash
npm install                 # dépendances
npx prisma generate         # client Prisma typé
npx prisma db push          # crée les tables dans la base
npm run db:seed             # données de test (catégories, produits, comptes, commandes)
npm run db:ajouter-produits # ajoute uniquement les références absentes
npm run dev -- --port 2020  # http://localhost:2020
```

Le seed est incrémental : il ajoute uniquement les catégories, produits et comptes de démonstration
absents. Les catégories, produits, stocks, comptes et commandes déjà présents ne sont pas modifiés.
Pour ajouter uniquement les nouvelles références au catalogue, privilégiez
`npm run db:ajouter-produits`.

> `prisma/sql/donnees-test.sql` est un jeu de données de test destructif (il commence par un `TRUNCATE`).
> Ne l’exécutez jamais sur une base contenant des données à conserver.

Production :

```bash
npm run build
npm start -- --port 2020
```

### Scripts utiles

| Script | Description |
|--------|-------------|
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (génère le client Prisma puis compile) |
| `npm start -- --port 2020` | serveur de production sur le port 2020 |
| `npm run db:push` | synchronise le schéma Prisma vers PostgreSQL |
| `npm run db:migrate` | crée une migration versionnée |
| `npm run db:seed` | insère les données de démonstration |
| `npm run db:ajouter-produits` | ajoute les produits complémentaires absents sans modifier les références présentes |
| `npm run db:reset` | remise à zéro complète + seed |
| `npm run db:studio` | explorateur de base Prisma Studio |

---

## 5. Comptes de démonstration

| Rôle | E-mail | Mot de passe |
|------|--------|--------------|
| **Administrateur** | `admin@kolatier.ci` | `Admin123!` |
| **Client** | `client@kolatier.ci` | `Client123!` |
| Client (2ᵉ) | `koffi@kolatier.ci` | `Koffi123!` |

Les mots de passe sont stockés **hachés en bcrypt (10 rounds)** — jamais en clair, y compris
dans le script de seed.

---

## 6. Fonctionnalités livrées

### 6.1 Côté Client / Visiteur (cahier des charges §4.1)

- **Accueil dynamique** : produits récents, articles les plus commandés selon les commandes enregistrées,
  sélections thématiques issues des catégories et raccourcis vers les origines présentes au catalogue.
  Les carrousels de produits et de catégories utilisent les données actives de la base, se commandent au
  clavier, au toucher ou avec leurs boutons et respectent la préférence de réduction des animations.
- **Catalogue** : filtres par catégorie, origine/ville et disponibilité, page détail par produit (slug),
  recommandations selon la catégorie et l’origine.
- **Recherche & filtres** : nom, description, artisan, origine et matière (insensibles à la casse),
  catégorie, disponibilité, prix min/max et tri
  (nouveautés, prix croissant/décroissant, A-Z) — tout est construit en `where` Prisma.
- **Panier** : ajout, modification de quantité (bornée au stock), suppression, vidage,
  persistance locale, livraison offerte dès 50 000 FCFA (sinon 2 000 FCFA).
- **Inscription / Connexion / Déconnexion** : validation serveur, e-mail unique,
  hash bcrypt, message d'erreur identique pour e-mail inconnu et mauvais mot de passe.
- **Commande** : formulaire d'adresse de livraison, récapitulatif, création transactionnelle.
- **Paiement simulé** : choix Orange Money, MTN MoMo, Moov Money, Wave ou paiement à la livraison.
  La confirmation de démonstration ne demande ni ne transmet de coordonnées Mobile Money ou de données bancaires.
- **Historique des commandes** : liste + détail avec suivi visuel du statut.
- **Informations** : pages À propos, Livraison & Paiement, Contact, FAQ, mentions légales et CGV.
- **Contact** : formulaire enregistré dans `MessageContact`, consultable depuis l'administration.
- **Avis clients** : note et commentaire réservés aux clients ayant une commande livrée contenant le produit.
- **États d’interface** : chargement du catalogue, erreurs avec possibilité de réessayer, résultats vides
  explicites et repérage des articles indisponibles ou à stock limité.
- **Profil utilisateur** : modification du nom, de l'e-mail et du mot de passe
  (l'ancien mot de passe est exigé).

### 6.2 Côté Administrateur (cahier des charges §4.2)

- **Tableau de bord** : chiffre d'affaires (hors annulées), nombre de commandes,
  commandes en attente, produits actifs, clients, ventes par ville, meilleures ventes, dernières commandes et alertes de stock.
- **Produits** : création, lecture, modification, suppression (CRUD complet) + image, origine, artisan, matière, prix, stock et activation.
- **Messages de contact** : lecture des formulaires envoyés depuis la boutique.
- **Catégories** : création, renommage, suppression (refusée si des produits y sont rattachés).
- **Commandes** : liste filtrable par statut, changement de statut en un clic
  (`EN_ATTENTE → EXPEDIEE → LIVREE` ou `ANNULEE`).
- **Utilisateurs** : liste, activation/désactivation (blocage) — un admin ne peut ni se bloquer
  lui-même ni bloquer un autre admin.
- **Stocks** : édition directe depuis la fiche produit + tableau de bord « stocks à surveiller ».

### 6.3 Règles métier & sécurité

- Mot de passe : **bcrypt** (coût 10). Session : **JWT HS256**, 7 jours, cookie `httpOnly`, `sameSite=lax`.
- **Middleware Edge** protégeant `/admin/**` (rôle ADMIN), `/compte`, `/commandes`, `/commande`.
- **Double contrôle serveur** : `getCurrentUser()` relit l'utilisateur en base à chaque requête →
  un compte bloqué perd immédiatement sa session, même avec un JWT valide.
- **Anti-fraude sur les prix** : le client n'envoie que `produitId` + `quantite`, les prix et les
  stocks sont relus en base. Le total est calculé côté serveur.
- **Transaction Prisma** à la commande : décrémentation du stock + création de la commande,
  ou rien du tout. Stock insuffisant → erreur explicite, aucun débit.
- **Intégrité de l'historique** : `LigneCommande` fige `nomProduit` et `prixUnitaire`.
  Un produit déjà commandé est **archivé** (`actif = false`) au lieu d'être supprimé.
- **Annulation** : remet les quantités en stock, une seule fois (garde `statut !== ANNULEE`).
- Champs validés côté serveur (nom, e-mail, prix entier en FCFA, stock ≥ 0, statut et mode de paiement dans les énumérations).

### Mise à jour du schéma

Après modification de `prisma/schema.prisma`, synchroniser la base puis recharger les données de démonstration :

```bash
npx prisma db push
npm run db:seed
```

---

## 7. Structure du projet

```
ecommerce/
├── prisma/
│   ├── schema.prisma            # modèles : Utilisateur, Categorie, Produit, Commande, LigneCommande, Avis, MessageContact
│   ├── seed.ts                  # données de test (6 catégories, 44 produits, 3 comptes, 4 commandes)
│   └── sql/
│       ├── creation.sql         # script SQL brut de création du schéma (sans Prisma)
│       └── donnees-test.sql     # jeu de données de test en SQL brut
├── public/produits/*.svg        # visuels produits (aucune dépendance externe)
├── docs/SOURCES-IMAGES.md       # attributions et licences des photos
├── middleware.ts                # protection Edge des routes privées
├── src/
│   ├── app/
│   │   ├── layout.tsx  page.tsx  globals.css
│   │   ├── produits/page.tsx            # catalogue + filtres
│   │   ├── produits/[slug]/page.tsx     # fiche produit
│   │   ├── panier/page.tsx              # panier (client)
│   │   ├── commande/page.tsx            # checkout
│   │   ├── commandes/page.tsx           # historique
│   │   ├── commandes/[id]/page.tsx      # détail commande
│   │   ├── compte/page.tsx              # profil
│   │   ├── connexion/ inscription/
│   │   ├── admin/                       # back-office (layout protégé)
│   │   │   ├── page.tsx                 # tableau de bord
│   │   │   ├── produits/  categories/  commandes/  utilisateurs/
│   │   └── api/
│   │       ├── auth/{inscription,connexion,deconnexion}/route.ts
│   │       ├── compte/route.ts
│   │       ├── commande/route.ts
│   │       └── admin/{produits,categories,commandes,utilisateurs}/…
│   ├── components/              # Navbar, Footer, cartes, formulaires, composants admin
│   ├── lib/{prisma,auth,utils}.ts
│   └── store/cart.ts            # panier Zustand
└── …
```

---

## 8. Modèle de données

```
Utilisateur (1) ──< Commande (1) ──< LigneCommande >── (1) Produit >── (1) Categorie
```

| Modèle | Champs principaux |
|--------|-------------------|
| `Utilisateur` | id, nom, email (unique), motDePasse (hash), role (CLIENT/ADMIN), bloque, creeLe |
| `Categorie` | id, nom (unique), slug (unique) |
| `Produit` | id, nom, slug (unique), description, prix Decimal(10,2), stock, image, actif, categorieId |
| `Commande` | id, reference (unique), statut, total, adresseLivraison, ville, codePostal, telephone, creeLe, utilisateurId |
| `LigneCommande` | id, quantite, prixUnitaire, nomProduit (snapshot), commandeId, produitId |

Énumérations : `Role { CLIENT, ADMIN }`, `StatutCommande { EN_ATTENTE, EXPEDIEE, LIVREE, ANNULEE }`.

---

## 9. Livrable SQL brut

Si vous ne voulez pas utiliser Prisma pour créer les tables :

```bash
psql -h localhost -p 2020 -U postgres -d ecommerce -f prisma/sql/creation.sql
psql -h localhost -p 2020 -U postgres -d ecommerce -f prisma/sql/donnees-test.sql
```

> **Attention :** `donnees-test.sql` contient un `TRUNCATE` et réinitialise les tables de démonstration. Ne l’exécutez pas sur une base contenant des données à conserver. Pour ajouter les références manquantes sans effacer ni modifier les produits, comptes et commandes présents, utilisez `npm run db:ajouter-produits`.

`creation.sql` est généré depuis le schéma Prisma (`prisma migrate diff`), donc strictement
équivalent au schéma réel (types, contraintes, index, clés étrangères).

---

## 10. Démonstration rapide

1. `npm run dev -- --port 2020` → ouvrir http://localhost:2020
2. Ajouter 2-3 produits au panier → `/panier` → « Passer la commande »
3. Se connecter en client (`client@kolatier.ci` / `Client123!`) → valider l'adresse → commande créée
4. Vérifier `Mes commandes` (statut **En attente**) et le stock décrémenté sur la fiche produit
5. Se connecter en admin (`admin@kolatier.ci` / `Admin123!`) → `/admin`
6. Changer le statut de la commande en **Expédiée** puis **Livrée** ; tester **Annulée** → le stock est restitué
7. Tester le blocage d'un client → sa session est immédiatement invalide

---

## 11. Limites assumées (projet pédagogique)

- Aucun paiement réel (pas d'intégration Stripe) : la commande est validée puis livrée « à la main ».
- Les nouveaux produits ont des photos sous licence, avec attributions dans `docs/SOURCES-IMAGES.md`. Ces photos sont explicitement présentées comme illustratives et ne certifient pas l’origine ivoirienne d’un lot ou d’un artisan ; les références sans photo appropriée gardent leur illustration locale.
- Pas de pagination serveur du catalogue (jeu de données réduit) ; la structure Prisma le permet (`skip`/`take`).
- Aucun test automatisé fourni ; la validation a été faite par build de production + parcours manuel.
