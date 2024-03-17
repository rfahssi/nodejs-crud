const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Paramètres de connexion à la base de données
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Route pour récupérer toutes les personnes
app.get('/personnes', (req, res) => {
    pool.query('SELECT * FROM personnes', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

// Route pour récupérer une personne par son ID
app.get('/personnes/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM personnes WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

// Route pour créer une nouvelle personne
app.post('/personnes', (req, res) => {
    const data = req.body;
    pool.query('INSERT INTO personnes SET ?', data, (error, results) => {
        if (error) throw error;
        res.status(201).send(`Personne ajoutée avec l'ID: ${results.insertId}`);
    });
});

// Route pour mettre à jour une personne
app.put('/personnes/:id', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    pool.query('UPDATE personnes SET ? WHERE id = ?', [data, id], (error, results) => {
        if (error) throw error;
        res.send(`Personne avec l'ID: ${id} mise à jour.`);
    });
});

// Route pour supprimer une personne
app.delete('/personnes/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM personnes WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        res.send(`Personne avec l'ID: ${id} supprimée.`);
    });
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
