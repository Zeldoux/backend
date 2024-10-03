# Projet 6 du parcours de Développeur Web d'OpenClassrooms

## Développez le back-end d'un site de notation de livres

Ce projet consiste à développer une API pour un site de notation de livres. L'objectif est de permettre aux utilisateurs de consulter,
  noter et ajouter des livres tout en sécurisant les données via une authentification utilisateur et une base de données MongoDB.

### Technologies utilisées

- **JavaScript**
- **Node.js** : Pour la gestion du serveur backend.
- **MongoDB** : Base de données NoSQL pour stocker les informations des utilisateurs et des livres.
- **Express** : Framework pour simplifier le routage et la gestion des requêtes HTTP.
- **Mongoose** : Pour interagir avec MongoDB et créer des schémas de données.
- **Multer** : Pour la gestion des fichiers (comme les images des livres).
- **Sharp** : Pour l'optimisation des images lors de l'upload.

---

### Prérequis

- [Node.js](https://nodejs.org/) installé sur votre machine.
- Une instance MongoDB. Vous pouvez en utiliser une localement ou via un service comme [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- mettre en place l'adresse vers la DB a partir du app.js : mongoose.connect('DB_URL')

---
### Installation

1. Clonez ce dépôt sur votre machine :
       
       git clone https://github.com/zeldoux/backend.git
   
2.Accédez au dossier du projet :
   
       cd backend
     
3.Installez les dépendances :
   
       npm install


### Scripts Backend Disponibles

Dans le dossier du projet, vous pouvez utiliser le script suivant pour démarrer le serveur en mode développement :

    nodemon start

Cela démarrera le serveur et surveillera les modifications dans les fichiers, redémarrant automatiquement l'application en cas de changement.


Dépendances installées et utilisées

    Mongoose : Pour la création de schémas de données et la gestion de la base de données MongoDB.
        Site officiel : https://mongoosejs.com/

    Sharp : Utilisé pour l'optimisation des images lors de l'upload. Cela permet de compresser les images afin de réduire la taille des fichiers stockés.
        Site officiel : https://sharp.pixelplumbing.com/

    Multer : Middleware pour gérer l'upload des fichiers dans les requêtes HTTP.
        Site officiel : https://github.com/expressjs/multer

    Bcrypt : Pour le hachage sécurisé des mots de passe des utilisateurs.

    JsonWebToken (JWT) : Pour la gestion de l'authentification utilisateur via des tokens JWT.
