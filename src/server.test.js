const request = require('supertest');
const app = require('../server');

// Messages d'erreur constants
const ERROR_MESSAGES = {
    INVALID_NUMBERS: 'Les paramètres doivent être des nombres valides',
    NULL_VALUES: 'Les valeurs null ne sont pas acceptées',
    MISSING_NUMBERS: 'Veuillez fournir deux nombres',
    EMPTY_BODY: 'Corps de requête vide',
    NULL_IN_ARRAY: 'Valeur null ou undefined détectée dans le tableau'
};

describe('API Calculatrice', () => {
    describe('GET /', () => {
        test('devrait retourner la page HTML', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);
            
            expect(response.headers['content-type']).toMatch(/html/);
        });
    });

    describe('POST /api/addition', () => {
        describe('Calculs d\'addition basiques', () => {
            test('devrait calculer l\'addition de deux nombres positifs', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: 5, nombre2: 3 })
                    .expect(200);

                expect(response.body).toEqual({ resultat: 8 });
            });

            test('devrait calculer l\'addition de deux nombres décimaux', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: 2.5, nombre2: 3.7 })
                    .expect(200);

                expect(response.body).toEqual({ resultat: 6.2 });
            });

            test('devrait calculer l\'addition de deux nombres négatifs', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: -5, nombre2: -3 })
                    .expect(200);

                expect(response.body).toEqual({ resultat: -8 });
            });
        });

        describe('Gestion des chaînes numériques', () => {
            test('devrait accepter des chaînes numériques', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: "10", nombre2: "5" })
                    .expect(200);

                expect(response.body).toEqual({ resultat: 15 });
            });

            test('devrait accepter un mélange de nombres et chaînes numériques', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: 7, nombre2: "3" })
                    .expect(200);

                expect(response.body).toEqual({ resultat: 10 });
            });
        });

        describe('Gestion des erreurs - nombres manquants', () => {
            test('devrait retourner une erreur 400 si nombre1 manque', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre2: 5 })
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.MISSING_NUMBERS);
            });

            test('devrait retourner une erreur 400 si nombre2 manque', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: 5 })
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.MISSING_NUMBERS);
            });

            test('devrait retourner une erreur 400 si aucun nombre n\'est fourni', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({})
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.EMPTY_BODY);
            });
        });

        describe('Gestion des valeurs non numériques', () => {
            test('devrait retourner une erreur 400 pour deux valeurs non numériques', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: "abc", nombre2: "def" })
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.INVALID_NUMBERS);
            });

            test('devrait retourner une erreur 400 pour une valeur non numérique', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: 5, nombre2: "abc" })
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.INVALID_NUMBERS);
            });
        });

        describe('Gestion des valeurs null', () => {
            test('devrait gérer une valeur null (nombre1)', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: null, nombre2: 5 })
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.NULL_VALUES);
            });

            test('devrait gérer deux valeurs null', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombre1: null, nombre2: null })
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.NULL_VALUES);
            });
        });

        describe('Gestion des corps de requête vides', () => {
            test('devrait gérer les corps de requête vides', async () => {
                const response = await request(app)
                    .post('/api/addition')
                    .send()
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.EMPTY_BODY);
            });
        });

        describe('Additions chaînées', () => {
            test('devrait gérer les additions chaînées de type 1+1+1+1+1+1+1+1', async () => {
                const nombres = [1, 1, 1, 1, 1, 1, 1, 1];
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombres })
                    .expect(200);

                expect(response.body).toEqual({ resultat: 8 });
            });

            test('devrait gérer les additions chaînées avec des nombres variés', async () => {
                const nombres = [2, 3, 4, 5, -2];
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombres })
                    .expect(200);

                expect(response.body).toEqual({ resultat: 12 });
            });

            test('devrait gérer les additions chaînées avec des décimaux', async () => {
                const nombres = [1.5, 2.5, 0.5, 0.5];
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombres })
                    .expect(200);

                expect(response.body).toEqual({ resultat: 5 });
            });

            test('devrait retourner une erreur pour additions chaînées avec valeur null', async () => {
                const nombres = [1, 2, null, 4];
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombres })
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.NULL_IN_ARRAY);
            });

            test('devrait retourner une erreur pour additions chaînées avec valeur non numérique', async () => {
                const nombres = [1, 2, "abc", 4];
                const response = await request(app)
                    .post('/api/addition')
                    .send({ nombres })
                    .expect(400);

                expect(response.body).toHaveProperty('erreur');
                expect(response.body.erreur).toBe(ERROR_MESSAGES.INVALID_NUMBERS);
            });
        });
    });
});
