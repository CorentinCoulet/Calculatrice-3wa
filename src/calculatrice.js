/**
 * Module de calculatrice pour effectuer des additions
 */

/**
 * Additionne deux nombres
 * @param {number} a - Premier nombre
 * @param {number} b - Deuxième nombre
 * @returns {number} La somme des deux nombres
 * @throws {Error} Si les paramètres ne sont pas des nombres
 */
function addition(a, b) {
    // Conversion en nombres
    const nombre1 = parseFloat(a);
    const nombre2 = parseFloat(b);
    
    // Vérification que les paramètres sont des nombres valides
    if (isNaN(nombre1) || isNaN(nombre2)) {
        throw new Error('Les paramètres doivent être des nombres valides');
    }
    
    // Calcul et retour du résultat
    return nombre1 + nombre2;
}

module.exports = {
    addition
};
