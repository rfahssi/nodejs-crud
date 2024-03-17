const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Création d'un pool de connexions MySQL en utilisant la bibliothèque `mysql`.
const pool = mysql.createPool({
    // `connectionLimit` définit le nombre maximum de connexions simultanées que le pool peut gérer.
    // Ici, il est défini à 10, ce qui signifie que le pool ne dépassera pas 10 connexions ouvertes en même temps.
    connectionLimit: 10,

    // `host` spécifie l'adresse du serveur de base de données auquel se connecter.
    // La valeur est tirée de la variable d'environnement `DB_HOST`.
    host: process.env.DB_HOST,

    // `user` définit l'utilisateur de la base de données pour l'authentification.
    // La valeur est tirée de la variable d'environnement `DB_USER`.
    user: process.env.DB_USER,

    // `password` définit le mot de passe de l'utilisateur de la base de données pour l'authentification.
    // La valeur est tirée de la variable d'environnement `DB_PASSWORD`.
    password: process.env.DB_PASSWORD,

    // `database` spécifie le nom de la base de données à laquelle se connecter.
    // La valeur est tirée de la variable d'environnement `DB_NAME`.
    database: process.env.DB_NAME
});

// Route pour récupérer toutes les personnes
app.get('/personnes', (req, res) => {
    // Exécution d'une requête SQL pour sélectionner toutes les entrées de la table 'personnes'
    pool.query('SELECT * FROM personnes', (error, results) => {
        // Gestion d'une éventuelle erreur durant l'exécution de la requête
        if (error) throw error; // Si une erreur survient, l'erreur est levée et le traitement est interrompu

        // Envoi des résultats de la requête au client qui a fait la demande
        res.send(results);
    });
});

// Route pour récupérer une personne par son ID
app.get('/personnes/:id', (req, res) => {
    // Extraction de l'identifiant ('id') à partir des paramètres de la requête
    const { id } = req.params;

    // Exécution d'une requête SQL avec un paramètre de substitution pour sélectionner une entrée spécifique
    // basée sur l'identifiant fourni
    pool.query('SELECT * FROM personnes WHERE id = ?', [id], (error, results) => {
        // Gestion d'une éventuelle erreur durant l'exécution de la requête
        if (error) throw error; // Si une erreur survient, l'erreur est levée et le traitement est interrompu

        // Envoi des résultats de la requête au client qui a fait la demande
        res.send(results);
    });
});

// Route pour créer une nouvelle personne
app.post('/personnes', (req, res) => {// Récupération des données envoyées par le client dans le corps de la requête
    const data = req.body;

    // Exécution d'une requête SQL pour insérer les données reçues dans la table 'personnes'
    pool.query('INSERT INTO personnes SET ?', data, (error, results) => {
        // Gestion d'une éventuelle erreur durant l'exécution de la requête
        if (error) throw error; // Si une erreur survient, l'erreur est levée et le traitement est interrompu

        // Envoi d'une réponse au client avec le statut 201 (Created) et un message incluant l'ID de la nouvelle entrée
        res.status(201).send(`Personne ajoutée avec l'ID: ${results.insertId}`);
    });
});

// Route pour mettre à jour une personne
app.put('/personnes/:id', (req, res) => {
    // Extraction de l'ID de la personne à partir des paramètres de l'URL
    const { id } = req.params;
    // Récupération des données envoyées dans le corps de la requête
    const data = req.body;

    // Exécution d'une requête SQL pour mettre à jour l'entrée correspondante à l'ID spécifié
    // dans la table 'personnes' avec les nouvelles données fournies
    pool.query('UPDATE personnes SET ? WHERE id = ?', [data, id], (error, results) => {
        // Gestion des erreurs potentielles lors de l'exécution de la requête
        if (error) throw error; // Si une erreur survient, elle est levée et le traitement est interrompu

        // Envoi d'une réponse au client confirmant la mise à jour de l'entrée
        res.send(`Personne avec l'ID: ${id} mise à jour.`);
    });
});

// Route pour supprimer une personne
app.delete('/personnes/:id', (req, res) => {
    // Récupère l'ID de la personne à supprimer depuis les paramètres de l'URL
    const { id } = req.params;

    // Exécute une requête SQL pour supprimer la personne correspondant à l'ID spécifié
    pool.query('DELETE FROM personnes WHERE id = ?', [id], (error, results) => {
        // Gère les erreurs potentielles lors de l'exécution de la requête
        if (error) throw error; // Si une erreur survient, l'erreur est levée et le traitement est interrompu

        // Envoie une réponse au client indiquant que la personne a été supprimée
        res.send(`Personne avec l'ID: ${id} supprimée.`);
    });
});

// Démarrage du serveur Express pour écouter les requêtes entrantes sur un port spécifique.
app.listen(port, () => {
    // Affiche un message dans la console une fois que le serveur est démarré et écoute sur le port donné.
    console.log(`Serveur lancé sur http://localhost:${port}`);
});

