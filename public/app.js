// Éléments du DOM
const expressionInput = document.getElementById('expression');
const btnCalculer = document.getElementById('btnCalculer');
const btnEffacer = document.getElementById('btnEffacer');
const btnRetour = document.getElementById('btnRetour');
const resultatDiv = document.getElementById('resultat');
const historiqueList = document.getElementById('historiqueList');

// Tous les boutons du clavier virtuel
const boutonsNum = document.querySelectorAll('.btn-num');
const boutonsOp = document.querySelectorAll('.btn-op');

// Historique des calculs
let historique = [];

// Événements
btnCalculer.addEventListener('click', calculer);
btnEffacer.addEventListener('click', effacer);
btnRetour.addEventListener('click', retourArriere);

// Permettre le calcul avec la touche Entrée
expressionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        calculer();
    }
});

// Filtrer les caractères non autorisés (seulement nombres, +, ., et espaces)
expressionInput.addEventListener('input', (e) => {
    let value = e.target.value;
    // Remplacer tous les caractères non autorisés
    value = value.replace(/[^0-9+.\s-]/g, '');
    e.target.value = value;
});

// Événements pour les boutons du clavier virtuel
boutonsNum.forEach(btn => {
    btn.addEventListener('click', () => {
        ajouterCaractere(btn.dataset.value);
    });
});

boutonsOp.forEach(btn => {
    btn.addEventListener('click', () => {
        ajouterCaractere(' ' + btn.dataset.value + ' ');
    });
});

// Fonction pour ajouter un caractère à l'expression
function ajouterCaractere(caractere) {
    expressionInput.value += caractere;
    expressionInput.focus();
}

// Fonction pour effacer un caractère
function retourArriere() {
    expressionInput.value = expressionInput.value.slice(0, -1);
    expressionInput.focus();
}

// Fonction pour parser l'expression et extraire les nombres
function parserExpression(expression) {
    // Nettoyer l'expression
    expression = expression.trim();
    
    if (!expression) {
        throw new Error('Veuillez entrer une expression');
    }
    
    // Rechercher le pattern: nombre + nombre
    const match = expression.match(/^([+-]?\d*\.?\d+)\s*\+\s*([+-]?\d*\.?\d+)$/);
    
    if (!match) {
        throw new Error('Format invalide. Utilisez: nombre + nombre');
    }
    
    const nombre1 = parseFloat(match[1]);
    const nombre2 = parseFloat(match[2]);
    
    if (isNaN(nombre1) || isNaN(nombre2)) {
        throw new Error('Les valeurs doivent être des nombres valides');
    }
    
    return { nombre1, nombre2 };
}

// Fonction pour calculer l'addition
async function calculer() {
    const expression = expressionInput.value;
    
    try {
        // Parser l'expression
        const { nombre1, nombre2 } = parserExpression(expression);
        
        // Appel à l'API
        const response = await fetch('/api/addition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre1: nombre1,
                nombre2: nombre2
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Afficher le résultat
            resultatDiv.textContent = data.resultat;
            resultatDiv.style.color = '#667eea';
            
            // Ajouter à l'historique avec l'expression complète
            ajouterHistorique(expression, data.resultat);
            
            // Animation de succès
            resultatDiv.classList.add('shake');
            setTimeout(() => resultatDiv.classList.remove('shake'), 300);
        } else {
            afficherErreur(data.erreur || 'Erreur lors du calcul');
        }
    } catch (error) {
        afficherErreur(error.message);
    }
}

// Fonction pour effacer
function effacer() {
    expressionInput.value = '';
    resultatDiv.textContent = '0';
    resultatDiv.style.color = '#667eea';
    expressionInput.focus();
}

// Fonction pour afficher une erreur
function afficherErreur(message) {
    resultatDiv.textContent = message;
    resultatDiv.style.color = '#e53e3e';
    resultatDiv.classList.add('shake');
    setTimeout(() => resultatDiv.classList.remove('shake'), 300);
}

// Fonction pour ajouter à l'historique
function ajouterHistorique(expression, resultat) {
    const item = {
        expression: expression,
        resultat: resultat,
        timestamp: new Date().toLocaleTimeString('fr-FR')
    };
    
    // Ajouter au début de l'historique
    historique.unshift(item);
    
    // Limiter l'historique à 10 éléments
    if (historique.length > 10) {
        historique.pop();
    }
    
    // Mettre à jour l'affichage
    afficherHistorique();
}

// Fonction pour afficher l'historique
function afficherHistorique() {
    historiqueList.innerHTML = '';
    
    if (historique.length === 0) {
        historiqueList.innerHTML = '<p style="color: #718096; text-align: center;">Aucun calcul effectué</p>';
        return;
    }
    
    historique.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'historique-item';
        div.innerHTML = `
            <span>${item.expression} = <span class="resultat-historique">${item.resultat}</span></span>
            <span style="font-size: 12px; color: #a0aec0;">${item.timestamp}</span>
        `;
        
        // Permettre de cliquer sur un élément de l'historique pour le réutiliser
        div.style.cursor = 'pointer';
        div.addEventListener('click', () => {
            expressionInput.value = item.expression;
            expressionInput.focus();
        });
        
        historiqueList.appendChild(div);
    });
}

// Support du clavier physique pour les touches numériques
document.addEventListener('keydown', (e) => {
    // Si l'input n'est pas focus, gérer les touches du clavier
    if (document.activeElement !== expressionInput) {
        if (e.key >= '0' && e.key <= '9') {
            ajouterCaractere(e.key);
            e.preventDefault();
        } else if (e.key === '+') {
            ajouterCaractere(' + ');
            e.preventDefault();
        } else if (e.key === '.') {
            ajouterCaractere('.');
            e.preventDefault();
        } else if (e.key === 'Enter' || e.key === '=') {
            calculer();
            e.preventDefault();
        } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            effacer();
            e.preventDefault();
        } else if (e.key === 'Backspace') {
            retourArriere();
            e.preventDefault();
        }
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    expressionInput.focus();
    afficherHistorique();
});