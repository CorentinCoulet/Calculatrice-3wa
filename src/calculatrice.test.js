const { addition } = require('./calculatrice');

describe('Module Calculatrice', () => {
    describe('addition()', () => {
        // Tests avec des nombres entiers
        test('devrait additionner deux nombres entiers positifs', () => {
            expect(addition(2, 3)).toBe(5);
            expect(addition(10, 20)).toBe(30);
            expect(addition(0, 0)).toBe(0);
        });
        
        test('devrait additionner des nombres négatifs', () => {
            expect(addition(-5, -3)).toBe(-8);
            expect(addition(-10, 5)).toBe(-5);
            expect(addition(10, -5)).toBe(5);
        });
        
        // Tests avec des nombres décimaux
        test('devrait additionner des nombres décimaux', () => {
            expect(addition(0.1, 0.2)).toBeCloseTo(0.3);
            expect(addition(2.5, 3.7)).toBeCloseTo(6.2);
            expect(addition(-1.5, 2.5)).toBeCloseTo(1);
        });
        
        // Tests avec des chaînes de caractères
        test('devrait convertir et additionner des chaînes numériques', () => {
            expect(addition('5', '3')).toBe(8);
            expect(addition('10.5', '2.5')).toBe(13);
            expect(addition('-5', '3')).toBe(-2);
        });
        
        // Tests avec zéro
        test('devrait gérer l\'addition avec zéro', () => {
            expect(addition(0, 5)).toBe(5);
            expect(addition(5, 0)).toBe(5);
            expect(addition(0, 0)).toBe(0);
        });
        
        // Tests de grands nombres
        test('devrait additionner de grands nombres', () => {
            expect(addition(1000000, 2000000)).toBe(3000000);
            expect(addition(999999.99, 0.01)).toBeCloseTo(1000000);
        });
        
        // Tests d'erreurs
        test('devrait lever une erreur pour des entrées non numériques', () => {
            expect(() => addition('abc', 5)).toThrow('Les paramètres doivent être des nombres valides');
            expect(() => addition(5, 'xyz')).toThrow('Les paramètres doivent être des nombres valides');
            expect(() => addition('hello', 'world')).toThrow('Les paramètres doivent être des nombres valides');
        });
        
        test('devrait lever une erreur pour des valeurs non définies', () => {
            expect(() => addition(undefined, 5)).toThrow('Les paramètres doivent être des nombres valides');
            expect(() => addition(5, undefined)).toThrow('Les paramètres doivent être des nombres valides');
            expect(() => addition(null, null)).toThrow('Les paramètres doivent être des nombres valides');
        });
        
        test('devrait lever une erreur pour NaN', () => {
            expect(() => addition(NaN, 5)).toThrow('Les paramètres doivent être des nombres valides');
            expect(() => addition(5, NaN)).toThrow('Les paramètres doivent être des nombres valides');
        });
        
        // Tests avec des espaces
        test('devrait gérer les chaînes avec des espaces', () => {
            expect(addition(' 5 ', ' 3 ')).toBe(8);
            expect(addition('  10.5  ', '  2.5  ')).toBe(13);
        });
    });
});
