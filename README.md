# 🤖 L'Expérience Mirokaï — Landing Page PWA

Landing page **Progressive Web App** pour l'Expérience Mirokaï d'[Enchanted Tools Paris](https://enchanted-tools.com), construite avec **Next.js 15**, **Tailwind CSS v4** et **TypeScript**.

---

## ✨ Fonctionnalités

### Navigation & Hero
- Navbar desktop 3 colonnes : liens (Votre visite / Conférences / Shop) · logo centré · Louer le lieu + FR + Billetterie
- Hero plein écran fond bleu `#192c94` avec titre responsive en 2 lignes
- Sélecteur de langue (FR)

### Profil visiteur
- Deux cards glassmorphism côte à côte (Je viens en équipe / Je viens seul)
- Effet typographique : ligne 1 texte plein blanc, ligne 2 contour blanc (`-webkit-text-stroke`)

### Réservation interactive (3 étapes)
- **Calendrier** avec créneaux codés par couleur : 🟢 Grand Public · 🔵 Groupe Entreprise · 🟣 Privé (8+ pers.)
- **Formulaire** adaptatif selon le profil (champs B2B : entreprise, poste, nb personnes, code promo)
- **Validation email** en temps réel (regex + retour visuel rouge)
- **Redirection Eventbrite** avec pré-remplissage des champs via paramètres URL
- **Confirmation personnalisée** avec contacts distincts B2B / Grand Public / Privé

### Témoignages
- Carrousel auto-play (5s) de cards carrées 160×160px
- Badge entreprise coloré (initiales), citation complète affichée sous la card sélectionnée
- 5 témoignages : Renault Group, BNP Paribas, Capgemini, Accor Hotels, SNCF

### Plan & Localisation
- **Google Maps** embarqué avec point rouge — 18 Rue de la Fontaine au Roi, 75011 Paris
- Bouton itinéraire flottant (Google Maps directions)
- **Plan architectural** (PLAN -1) dans un modal avec **zones cliquables** :
  - 🤖 Mirokaï Experience
  - 🤝 Zone Partenaire Spoon
  - 🎛️ Régie
  - ⚙️ Salle de Cyclage
- Infos pratiques : Métro Goncourt (L11), Bus, Vélib', Parking

### FAQ
- Accordéon avec 6 questions techniques (RGPD, intégration, mises à jour…)
- CTA expert + téléchargement fiche produit

### Footer
- 3 colonnes : Marque (réseaux sociaux) · Informations légales · Contact
- Liens : Politique de confidentialité, Mentions légales, CGV, Cookies, RGPD

### PWA
- `manifest.json` configuré (icônes 192×192, apple-touch-icon, SVG)
- `favicon.ico` personnalisé
- Service Worker (`sw.js`)
- Installable sur mobile et desktop

---

## 🛠 Stack technique

| Outil | Version |
|---|---|
| Next.js | 15 (App Router) |
| React | 19 |
| Tailwind CSS | v4 |
| TypeScript | 5 |
| Font | Space Grotesk (Google Fonts) |

---

## 🚀 Lancer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure

```
app/
  page.tsx        # Page principale (tout le contenu)
  layout.tsx      # Layout global + métadonnées PWA
  globals.css     # Variables CSS + Tailwind
public/
  manifest.json   # Configuration PWA
  sw.js           # Service Worker
  plan-mirokai.png # Plan architectural du lieu
  icons/          # Icônes PWA (192x192, apple-touch-icon, SVG)
  logo-enchanted-tools.svg
```

---

## 🌐 Déploiement

Le projet est déployé sur **Vercel** en continu depuis la branche `main`.

```bash
npx vercel --prod
```

---

## 📍 Adresse

**18 Rue de la Fontaine au Roi, 75011 Paris**
Métro Goncourt — Ligne 11

[→ Voir sur Eventbrite](https://www.eventbrite.fr/e/lexperience-mirokai-musee-robotique-et-ia-tickets-1837425843159)
