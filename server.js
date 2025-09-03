const express = require('express');
const path = require('path');
const calculatrice = require('./src/calculatrice');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route API pour l'addition
app.post('/api/addition', (req, res) => {
    // Vérifier si le body est vide ou null
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            erreur: 'Corps de requête vide' 
        });
    }
    
    const { nombre1, nombre2, nombres } = req.body;
    
    // Gestion des additions chainées
    if (nombres && Array.isArray(nombres)) {
        try {
            let resultat = 0;
            for (const nombre of nombres) {
                if (nombre === null || nombre === undefined) {
                    return res.status(400).json({ 
                        erreur: 'Valeur null ou undefined détectée dans le tableau' 
                    });
                }
                resultat = calculatrice.addition(resultat, nombre);
            }
            return res.json({ resultat });
        } catch (error) {
            return res.status(400).json({ 
                erreur: error.message 
            });
        }
    }
    
    // Vérifier si les nombres sont fournis
    if (nombre1 === undefined || nombre2 === undefined) {
        return res.status(400).json({ 
            erreur: 'Veuillez fournir deux nombres' 
        });
    }
    
    // Vérifier les valeurs null
    if (nombre1 === null || nombre2 === null) {
        return res.status(400).json({ 
            erreur: 'Les valeurs null ne sont pas acceptées' 
        });
    }
    
    try {
        const resultat = calculatrice.addition(nombre1, nombre2);
        res.json({ resultat });
    } catch (error) {
        res.status(400).json({ 
            erreur: error.message 
        });
    }
});

// Démarrage du serveur
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}

module.exports = app;
