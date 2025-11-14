# Mini CRM TypeScript

## Description
Ce projet est un Mini CRM (Customer Relationship Management) développé en TypeScript. Il permet de gérer une liste de contacts avec des fonctionnalités d'ajout, de suppression et d'affichage des contacts via une interface utilisateur simple.

## Structure du projet
```
mini-crm-typescript
├── src
│   ├── index.ts               # Point d'entrée de l'application
│   ├── app
│   │   ├── models
│   │   │   └── Contact.ts      # Modèle de données pour un contact
│   │   ├── services
│   │   │   └── ContactService.ts # Logique métier pour la gestion des contacts
│   │   ├── ui
│   │   │   ├── dom.ts          # Manipulation du DOM
│   │   │   └── events.ts       # Gestion des événements de l'interface utilisateur
│   │   └── types
│   │       └── index.ts        # Types et interfaces utilisés dans l'application
│   ├── public
│   │   ├── index.html          # Page HTML principale
│   │   └── styles.css          # Styles CSS pour l'interface utilisateur
├── package.json                # Configuration npm
├── tsconfig.json               # Configuration TypeScript
└── README.md                   # Documentation du projet
```

## Installation
1. Clonez le dépôt ou téléchargez les fichiers du projet.
2. Ouvrez un terminal et naviguez jusqu'au répertoire du projet.
3. Exécutez `npm install` pour installer les dépendances.

## Utilisation
1. Pour Build `npm run build`.
2. Pour démarrer le projet, exécutez `npm run start`.
3. Ouvrez votre navigateur et accédez à `http://localhost:3000` pour utiliser le Mini CRM.

## Fonctionnalités
- Ajouter des contacts avec nom, email et téléphone.
- Supprimer des contacts de la liste.
- Afficher tous les contacts dans une interface utilisateur conviviale.

## Contribuer
Les contributions sont les bienvenues ! N'hésitez pas à soumettre des demandes de tirage ou à signaler des problèmes.