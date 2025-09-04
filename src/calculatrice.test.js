const { addition } = require('./calculatrice');

// Messages d'erreur constants
const ERROR_MESSAGES = {
    INVALID_NUMBERS: 'Les paramètres doivent être des nombres valides'
};

describe('Module Calculatrice', () => {
    describe('addition()', () => {
        // Tests avec des nombres entiers positifs
        describe('Nombres entiers positifs', () => {
            test('devrait additionner 2 + 3 = 5', () => {
                expect(addition(2, 3)).toBe(5);
            });
            
            test('devrait additionner 10 + 20 = 30', () => {
                expect(addition(10, 20)).toBe(30);
            });
            
            test('devrait additionner 0 + 0 = 0', () => {
                expect(addition(0, 0)).toBe(0);
            });
        });
        
        // Tests avec des nombres négatifs
        describe('Nombres négatifs', () => {
            test('devrait additionner -5 + (-3) = -8', () => {
                expect(addition(-5, -3)).toBe(-8);
            });
            
            test('devrait additionner -10 + 5 = -5', () => {
                expect(addition(-10, 5)).toBe(-5);
            });
            
            test('devrait additionner 10 + (-5) = 5', () => {
                expect(addition(10, -5)).toBe(5);
            });
        });
        
        // Tests avec des nombres décimaux
        describe('Nombres décimaux', () => {
            test('devrait additionner 0.1 + 0.2 ≈ 0.3', () => {
                expect(addition(0.1, 0.2)).toBeCloseTo(0.3);
            });
            
            test('devrait additionner 2.5 + 3.7 ≈ 6.2', () => {
                expect(addition(2.5, 3.7)).toBeCloseTo(6.2);
            });
            
            test('devrait additionner -1.5 + 2.5 ≈ 1', () => {
                expect(addition(-1.5, 2.5)).toBeCloseTo(1);
            });
        });
        
        // Tests avec des chaînes de caractères
        describe('Conversion de chaînes numériques', () => {
            test('devrait convertir "5" + "3" = 8', () => {
                expect(addition('5', '3')).toBe(8);
            });
            
            test('devrait convertir "10.5" + "2.5" = 13', () => {
                expect(addition('10.5', '2.5')).toBe(13);
            });
            
            test('devrait convertir "-5" + "3" = -2', () => {
                expect(addition('-5', '3')).toBe(-2);
            });
        });
        
        // Tests avec zéro
        describe('Addition avec zéro', () => {
            test('devrait additionner 0 + 5 = 5', () => {
                expect(addition(0, 5)).toBe(5);
            });
            
            test('devrait additionner 5 + 0 = 5', () => {
                expect(addition(5, 0)).toBe(5);
            });
            
            test('devrait additionner 0 + 0 = 0 (déjà testé ci-dessus)', () => {
                expect(addition(0, 0)).toBe(0);
            });
        });
        
        // Tests de grands nombres
        describe('Grands nombres', () => {
            test('devrait additionner 1000000 + 2000000 = 3000000', () => {
                expect(addition(1000000, 2000000)).toBe(3000000);
            });
            
            test('devrait additionner 999999.99 + 0.01 ≈ 1000000', () => {
                expect(addition(999999.99, 0.01)).toBeCloseTo(1000000);
            });
        });
        
        // Tests d'erreurs - Valeurs non numériques
        describe('Gestion des erreurs - Valeurs non numériques', () => {
            test('devrait lever une erreur pour "abc" + 5', () => {
                expect(() => addition('abc', 5)).toThrow(ERROR_MESSAGES.INVALID_NUMBERS);
            });
            
            test('devrait lever une erreur pour 5 + "xyz"', () => {
                expect(() => addition(5, 'xyz')).toThrow(ERROR_MESSAGES.INVALID_NUMBERS);
            });
            
            test('devrait lever une erreur pour "hello" + "world"', () => {
                expect(() => addition('hello', 'world')).toThrow(ERROR_MESSAGES.INVALID_NUMBERS);
            });
        });
        
        // Tests d'erreurs - Valeurs non définies
        describe('Gestion des erreurs - Valeurs non définies', () => {
            test('devrait lever une erreur pour undefined + 5', () => {
                expect(() => addition(undefined, 5)).toThrow(ERROR_MESSAGES.INVALID_NUMBERS);
            });
            
            test('devrait lever une erreur pour 5 + undefined', () => {
                expect(() => addition(5, undefined)).toThrow(ERROR_MESSAGES.INVALID_NUMBERS);
            });
            
            test('devrait lever une erreur pour null + null', () => {
                expect(() => addition(null, null)).toThrow(ERROR_MESSAGES.INVALID_NUMBERS);
            });
        });
        
        // Tests d'erreurs - NaN
        describe('Gestion des erreurs - NaN', () => {
            test('devrait lever une erreur pour NaN + 5', () => {
                expect(() => addition(NaN, 5)).toThrow(ERROR_MESSAGES.INVALID_NUMBERS);
            });
            
            test('devrait lever une erreur pour 5 + NaN', () => {
                expect(() => addition(5, NaN)).toThrow(ERROR_MESSAGES.INVALID_NUMBERS);
            });
        });
        
        // Tests avec des espaces
        describe('Gestion des espaces dans les chaînes', () => {
            test('devrait gérer " 5 " + " 3 " = 8', () => {
                expect(addition(' 5 ', ' 3 ')).toBe(8);
            });
            
            test('devrait gérer "  10.5  " + "  2.5  " = 13', () => {
                expect(addition('  10.5  ', '  2.5  ')).toBe(13);
            });
        });
    });
});
