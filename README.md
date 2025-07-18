# Digital Car Garage – Projet Portfolio Holberton – Alexandre DANIEL

Ce projet est une application web complète conçue pour aider les propriétaires de véhicules à gérer et suivre efficacement l'entretien de leurs véhicules. Il inclut des fonctionnalités telles que l'authentification utilisateur, la gestion des véhicules, le suivi des réparations, l'historique des services et des tableaux de bord utilisateurs. Le projet a été développé dans le cadre du Projet Portfolio Holberton School [C#25] en utilisant des pratiques modernes de développement web.

## Architecture

<img width="1291" height="1447" alt="Capture d'écran 2025-07-16 212750" src="https://github.com/user-attachments/assets/8c511b21-300e-4f5b-82fc-ee8eef5bf261" />

## Diagramme Entité-Relation (ER)

<img width="2124" height="1163" alt="Capture d'écran 2025-07-16 212807" src="https://github.com/user-attachments/assets/4e521b30-2de7-438d-930d-c719a9db0c56" />

## Structure du projet

```
├── index.html                       # Page d'accueil principale (landing page)
├── style.css                        # Styles CSS (landing page)
├── package.json                     # Configuration npm racine
├── package-lock.json                # Verrouillage des dépendances
├── .gitignore                       # Fichiers à ignorer par Git
├── README.md                        # Documentation du projet
├── Capture d'écran addrepair.png    # Capture d'écran ajout réparation
├── Capture d'écran client.png       # Capture d'écran interface client
├── Capture d'écran garage.png       # Capture d'écran interface garage
├── frontend/                        # Application côté client
│   ├── login/                       # Pages d'authentification
│   │   ├── login.html
│   │   ├── login.js
│   │   ├── style.css
│   │   └── mecanique-generale-min-scaled.jpg.webp
│   ├── create/                      # Création de compte
│   │   ├── create-account.html
│   │   ├── create-account.js
│   │   └── style.css
│   ├── garage/                      # Interface garage principale
│   │   ├── garage.html
│   │   ├── garage.js
│   │   └── style.css
│   ├── client/                      # Tableau de bord client
│   │   ├── client.html
│   │   ├── client.js
│   │   └── style.css
│   ├── editAccount/                 # Modification de compte
│   │   ├── edit-account.html
│   │   ├── edit-account.js
│   │   └── style.css
│               
└── backend/                         # Application côté serveur
    ├── app.js                       # Application Express principale
    ├── serveur.js                   # Point d'entrée du serveur
    ├── package.json                 # Dépendances backend
    ├── package-lock.json            # Verrouillage des dépendances backend
    ├── .env                         # Variables d'environnement
    ├── .env.example                 # Exemple de configuration
    ├── .gitignore                   # Fichiers backend à ignorer
    ├── controllers/                 # Logique métier
    │   ├── auth.controller.js       # Contrôleur d'authentification
    │   ├── vehicle.controller.js    # Contrôleur des véhicules
    │   └── repair.controller.js     # Contrôleur des réparations
    ├── middleware/                  # Middlewares personnalisés
    │   ├── authenticateUser.js      # Middleware d'authentification
    │   └── verifyToken.middleware.js # Middleware de vérification JWT
    ├── models/                      # Modèles de données
    │   └── db.js                    # Configuration base de données
    ├── routes/                      # Points d'accès API
    │   ├── auth.routes.js           # Routes d'authentification
    │   ├── user.routes.js           # Routes utilisateur
    │   ├── vehicle.routes.js        # Routes véhicules
    │   └── repair.routes.js         # Routes réparations
    └── tests/                       # Tests unitaires
        └── auth.test.js             # Tests d'authentification
```

## Technologies utilisées

**Front-end :** HTML5, CSS3, JavaScript
**Back-end :** Node.js avec framework Express.js
**Authentification :** JWT (JSON Web Tokens)
**Stockage de fichiers :** Multer pour les uploads
**Base de données :** Stockage basé sur fichiers JSON (implémentation actuelle)
**Outils :** Jest (tests), Postman (tests API), Git, VS Code

## Installation

Cloner le dépôt et installer les dépendances :

```bash
git clone https://github.com/DANDEV2433/Digital_Car_Garage.git
cd Digital_Car_Garage
```

Installer les dépendances racine :
```bash
npm install
```

Installer les dépendances backend :
```bash
cd backend
npm install
```

Démarrer le serveur :
```bash
npm start
```

L'application sera accessible à :
**Frontend :** http://localhost:3000/

## Configuration

Créer un fichier `.env` dans le répertoire `backend/` avec la structure suivante :

```env
DB_HOST=localhost
DB_USER=...
DB_PASSWORD=...
DB_DATABASE=dcg_db
DB_PORT=3306
JWT_SECRET=...
REFRESH_TOKEN_SECRET=...
JWT_EXPIRATION=20m
REFRESH_TOKEN_EXPIRATION=7d
```

## Fonctionnalités

### Authentification
Système de connexion/déconnexion sécurisé avec authentification basée sur les tokens JWT et gestion des sessions.

### Gestion des véhicules
Ajouter, modifier et gérer plusieurs véhicules avec des informations complètes (marque, modèle, année, kilométrage...).

### Suivi des réparations
Créer et suivre les dossiers de réparation avec des informations détaillées incluant les coûts, dates et descriptions de service.

### Historique des services
Maintenir un historique de service complet pour chaque véhicule avec suivi chronologique.

### Tableau de bord de reporting
Voir des statistiques détaillées et des rapports sur les coûts de maintenance, la fréquence des services et la santé des véhicules.

## Captures d'écran

### Interface principale du garage
![Interface Garage](Capture%20d'écran%20garage.png)

### Tableau de bord client
![Tableau de bord Client](Capture%20d'écran%20client.png)

### Formulaire d'ajout de réparation
![Ajout Réparation](Capture%20d'écran%20addrepair.png)

## Points d'accès API

### Authentification
- `POST /api/v1/auth/register` - Inscription utilisateur
- `POST /api/v1/auth/login` - Connexion utilisateur
- `POST /api/v1/auth/logout` - Déconnexion utilisateur

### Véhicules
- `GET /api/v1/vehicles` - Récupérer tous les véhicules utilisateur
- `POST /api/v1/vehicles` - Créer un nouveau véhicule

### Réparations
- `GET /api/v1/vehicles/:vehicleId/repairs` - Récupérer toutes les réparations
- `POST /api/v1/vehicles/:vehicleId/repairs` - Créer une nouvelle réparation
- `PUT /api/v1/repairs/:repairId` - Mettre à jour une réparation
- `DELETE /api/v1/repairs/:repairId` - Supprimer une réparation

## Tests

Exécuter la suite de tests :
```bash
cd backend
npm test
```

Des tests manuels ont été effectués en utilisant Postman pour les points d'accès API et des tests navigateur pour l'interface frontend.

## Améliorations futures

### Application mobile
Développer une version d'application mobile en utilisant Vue.js et Vuetify.

### Système de notifications
Ajouter des notifications email/SMS pour les rappels de maintenance à venir.

### Support multilingue
Ajouter le support d'internationalisation pour plusieurs langues.

### Ajout de factures
Ajouter des factures côté garage (PDF) pour que le client puisse les télécharger.

## Méthodologie de développement

Ce projet a été développé en utilisant des pratiques modernes de développement web :
- **Organisation du code :** Architecture modulaire avec séparation des préoccupations
- **Tests :** Tests unitaires avec le framework Jest
- **Documentation :** Commentaires de code complets et documentation API
- **Sécurité :** Authentification JWT, tokens stockés dans les cookies (httpOnly), access et refresh tokens

## Considérations de performance

- **Frontend :** CSS et JavaScript optimisés pour un chargement rapide
- **Backend :** Implémentation efficace du routage et des middlewares
- **Sécurité :** controllers et middlewares d'authentification

## Contact

Pour toute question ou contribution, contactez :

**Alexandre DANIEL**  
📧 alexdani3344@gmail.com  
🔗 LinkedIn : [alexandre-daniel-0a0435200](https://www.linkedin.com/in/alexandre-daniel-0a0435200/)  
🐙 GitHub : [@DANDEV2433](https://github.com/DANDEV2433)

---

*Développé dans le cadre du Projet Portfolio Holberton School - 2025*
