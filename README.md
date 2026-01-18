# CloudSync

**CloudSync** est une plateforme moderne de collaboration et de synchronisation de données en temps réel, conçue pour transformer la façon dont les équipes travaillent ensemble.

![CloudSync Banner](/public/window.svg)

## 🌟 Fonctionnalités Clés

### 🔐 Authentification & Sécurité
- **Inscription Intelligente** : Création de compte fluide avec attribution automatique d'un plan **Gratuit** dès l'inscription.
- **Sécurité Maximale** : Mots de passe chiffrés avec **Argon2** et sessions gérées via des tokens **JWT** en cookies HTTP-only sécurisés.
- **Protection des Routes** : Middleware robuste protégeant les pages sensibles et l'API.

### 💳 Gestion des Abonnements
- **Plans Flexibles** : Support natif pour plusieurs niveaux de service (Starter, Pro, Enterprise).
- **Intégration Stripe** : Paiements sécurisés et gestion du cycle de vie des abonnements via **Stripe Checkout**.
- **Portal Client** : Redirection vers le portail client Stripe pour la gestion des moyens de paiement et les changements de plan.

### 🧾 Facturation et Transparence
- **Espace Factures** : Une page dédiée (`/invoices`) centralisant tout l'historique des paiements.
- **Téléchargement PDF** : Accès instantané aux factures officielles générées par Stripe.
- **Suivi en Temps Réel** : État des paiements (payé, en attente) mis à jour via webhooks.

### ⚡️ Expérience Utilisateur
- **Interface Moderne** : UI soignée avec **Tailwind CSS 4** et **Shadcn UI**.
- **Mode Sombre** : Support natif du thème clair/sombre.
- **Synchronisation** : Architecture prête pour la synchronisation de données en temps réel.

## 🛠 Stack Technique

Ce projet utilise les dernières technologies du développement web moderne :

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Base de Données** : [Neon](https://neon.tech/) avec [Prisma ORM](https://www.prisma.io/)
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com/)
- **Paiement** : [Stripe](https://stripe.com/)
- **Email** : [Resend](https://resend.com/)
- **Validation** : [Zod](https://zod.dev/)

## 📦 Installation

Suivez ces étapes pour lancer le projet localement :

1. **Cloner le dépôt**

```bash
git clone https://github.com/votre-username/tp-next-2026.git
cd tp-next-2026
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet et ajoutez les clés nécessaires (voir `.env.example` si disponible ou baser sur la configuration Prisma/NextAuth).

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="votre_secret_jwt"
STRIPE_SECRET_KEY="sk_test_..."
# ... autres variables
```

4. **Configurer la base de données**

```bash
npx prisma migrate dev
```

5. **Lancer le serveur de développement**

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## 📂 Structure du Projet

- `app/` : Pages et routes de l'application (Next.js App Router).
- `components/` : Composants UI réutilisables (Boutons, Inputs, etc.).
- `lib/` : Utilitaires, configuration de la base de données (`db.ts`) et authentification (`auth.ts`).
- `prisma/` : Schéma de la base de données et migrations.
- `public/` : Fichiers statiques (images, polices).

