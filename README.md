# Digital Car Garage – Projet Portfolio Holberton – Alexandre DANIEL

Ce projet est une application web complète conçue pour aider les propriétaires de véhicules à gérer et suivre efficacement l'entretien de leurs automobiles. Il inclut des fonctionnalités telles que l'authentification utilisateur, la gestion des véhicules, le suivi des réparations, l'historique des services et des tableaux de bord de reporting détaillés. Le projet a été développé dans le cadre du Projet Portfolio Holberton School [C#25] en utilisant des pratiques modernes de développement web.

## Architecture

Ci-dessous le diagramme d'architecture système montrant la structure globale du projet :

```
+------------------------+          HTTP                   +----------------------+
|                        |   <--------------------------> |                      |
|    Frontend            |                                | Backend              |
|   HTML/CSS/JavaScript  |                                |  Node.js + Express   |
|     (Fichiers statiques)|                                |    (port 3000)       |
+------------------------+                                +----------------------+
                                                                    |
                                                                    |
                                    +----------------+              |
                                    | Système de     |              |
                                    | fichiers JSON  | <-----------+
                                    |                |
                                    +----------------+
```

*Voir le diagramme d'architecture détaillé en pièce jointe*

## Diagramme Entité-Relation (ER)

*Voir le diagramme ER complet en pièce jointe montrant les relations entre les entités : Utilisateur, Véhicule, Réparation, et leurs attributs*

## Structure du projet

```
Digital_Car_Garage/
├── index.html                  # Page d'accueil
├── style.css                   # Styles CSS principaux
├── frontend/                   # Application côté client
│   ├── login/                  # Pages d'authentification
│   ├── garage/                 # Interface garage principale
│   ├── client/                 # Tableau de bord client
│   ├── create/                 # Création de compte
│   └── editAccount/            # Gestion de compte
├── backend/                    # Application côté serveur
│   ├── app.js                  # Application Express
│   ├── serveur.js              # Point d'entrée du serveur
│   ├── controllers/            # Logique métier
│   ├── middleware/             # Authentification et validation
│   ├── models/                 # Modèles de données
│   ├── routes/                 # Points d'accès API
│   ├── tests/                  # Tests unitaires
│   └── uploads/                # Stockage de fichiers
├── images/                     # Captures d'écran et assets
└── README.md
```

## Technologies utilisées

**Front-end :** HTML5, CSS3, JavaScript (Vanilla)
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
**API :** http://localhost:3000/api/v1/

## Configuration

Créer un fichier `.env` dans le répertoire `backend/` avec la structure suivante :

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=votre_clé_secrète_jwt_super_sécurisée
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5000000
```

## Fonctionnalités

### Authentification
Système de connexion/déconnexion sécurisé avec authentification basée sur les tokens JWT et gestion des sessions.

### Gestion des véhicules
Ajouter, modifier et gérer plusieurs véhicules avec des informations complètes (marque, modèle, année, kilométrage, VIN).

### Suivi des réparations
Créer et suivre les dossiers de réparation avec des informations détaillées incluant les coûts, dates et descriptions de service.

### Historique des services
Maintenir un historique de service complet pour chaque véhicule avec suivi chronologique.

### Tableau de bord de reporting
Voir des statistiques détaillées et des rapports sur les coûts de maintenance, la fréquence des services et la santé des véhicules.

### Gestion des fichiers
Télécharger et gérer les documents des véhicules, reçus de service et photos de maintenance.

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
- `PUT /api/v1/vehicles/:id` - Mettre à jour un véhicule
- `DELETE /api/v1/vehicles/:id` - Supprimer un véhicule

### Réparations
- `GET /api/v1/repairs` - Récupérer toutes les réparations
- `POST /api/v1/repairs` - Créer une nouvelle réparation
- `PUT /api/v1/repairs/:id` - Mettre à jour une réparation
- `DELETE /api/v1/repairs/:id` - Supprimer une réparation

## Tests

Exécuter la suite de tests :
```bash
cd backend
npm test
```

Des tests manuels ont été effectués en utilisant Postman pour les points d'accès API et des tests navigateur pour l'interface frontend.

## Améliorations futures

### Intégration de base de données
Migrer du stockage de fichiers JSON vers un système de base de données approprié (SQLite/PostgreSQL).

### Application mobile
Développer une version d'application mobile en utilisant React Native ou Flutter.

### Analyses avancées
Implémenter des suggestions de maintenance prédictive basées sur les données historiques.

### Stockage cloud
Intégrer des services de stockage cloud (AWS S3, Google Cloud) pour la gestion des documents.

### Système de notifications
Ajouter des notifications email/SMS pour les rappels de maintenance à venir.

### Support multilingue
Ajouter le support d'internationalisation pour plusieurs langues.

### Limitation du taux API
Implémenter la limitation du taux API et des mesures de sécurité renforcées.

### Mises à jour en temps réel
Ajouter le support WebSocket pour les mises à jour en temps réel sur plusieurs sessions.

## Méthodologie de développement

Ce projet a été développé en utilisant des pratiques modernes de développement web :
- **Contrôle de version :** Git avec branches de fonctionnalités
- **Organisation du code :** Architecture modulaire avec séparation des préoccupations
- **Tests :** Tests unitaires avec le framework Jest
- **Documentation :** Commentaires de code complets et documentation API
- **Sécurité :** Authentification JWT, validation des entrées et uploads de fichiers sécurisés

## Considérations de performance

- **Frontend :** CSS et JavaScript optimisés pour un chargement rapide
- **Backend :** Implémentation efficace du routage et des middlewares
- **Gestion des fichiers :** Limites de taille de fichier appropriées et validation des types
- **Sécurité :** Assainissement des entrées et middleware d'authentification

## Contact

Pour toute question ou contribution, contactez :

**Alexandre DANIEL**  
📧 alexandre.daniel@holbertonschool.com  
🔗 LinkedIn : [alexandre-daniel-0a0435200](https://www.linkedin.com/in/alexandre-daniel-0a0435200/)  
🐙 GitHub : [@DANDEV2433](https://github.com/DANDEV2433)

---

*Développé dans le cadre du Projet Portfolio Holberton School - Décembre 2024*