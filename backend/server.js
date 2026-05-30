const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let utilisateurs = [
    { id: 1, nom: "Salma Majri", email: "salma.majri@gmail.com" },
    { id: 2, nom: "Ali Oumidi", email: "ali.oumidi@gmail.com" },
    { id: 3, nom: "Fatima Zahra", email: "fatima.zahra@gmail.com" },
    { id: 4, nom: "Youssef Benali", email: "youssef.benali@gmail.com" },
    { id: 5, nom: "Khadija Tazi", email: "khadija.tazi@gmail.com" },
    { id: 6, nom: "Mohammed Amine", email: "mohammed.amine@gmail.com" },
    { id: 7, nom: "Imane El Fassi", email: "imane.elfassi@gmail.com" }
];

// GET 
app.get('/api/utilisateurs', (req, res) => {
    res.json(utilisateurs);
});

// POST
app.post('/api/utilisateurs', (req, res) => {
    const { nom, email } = req.body;
    if (!nom || !email) {
        return res.status(400).json({ message: "Le nom et l'email sont requis" });
    }
    const nouvelUtilisateur = {
        id: utilisateurs.length > 0 ? utilisateurs[utilisateurs.length - 1].id + 1 : 1,
        nom: nom.trim(),
        email: email.trim()
    };
    utilisateurs.push(nouvelUtilisateur);
    res.status(201).json(nouvelUtilisateur);
});

// PUT 
app.put('/api/utilisateurs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nom, email } = req.body;
    if (!nom || !email) {
        return res.status(400).json({ message: "Le nom et l'email sont requis" });
    }
    const index = utilisateurs.findIndex(user => user.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    utilisateurs[index] = { ...utilisateurs[index], nom: nom.trim(), email: email.trim() };
    res.json(utilisateurs[index]);
});

// DELETE 
app.delete('/api/utilisateurs/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = utilisateurs.findIndex(user => user.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    utilisateurs.splice(index, 1);
    res.json({ message: "Utilisateur supprimé avec succès" });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});