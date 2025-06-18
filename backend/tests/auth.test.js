// tests/auth.test.js
const request = require("supertest");
const app = require("../app");
const db = require("../models/db");

describe("Tests Authentification simples", () => {
  const email = `test${Date.now()}@mail.com`;
  const password = "Test123!";

  it("Inscription d’un nouvel utilisateur", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        role: "client",
        nom: "Testeur",
        prenom: "Exemple",
        email,
        password,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Utilisateur créé avec succès");
  });

  it("Connexion avec l’utilisateur inscrit", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Connexion réussie");
    expect(res.body.user_id).toBeDefined();
  });

  it("Déconnexion de l’utilisateur", async () => {
    const res = await request(app).post("/api/v1/auth/logout");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Déconnexion réussie");
  });

  describe("Cas d'erreurs", () => {
    it("Échec d'inscription avec un email déjà utilisé", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          role: "client",
          nom: "Testeur",
          prenom: "Exemple",
          email,
          password,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email déjà utilisé");
    });

    it("Échec de connexion avec un mauvais mot de passe", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email, password: "MauvaisMotDePasse123!" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Mot de passe incorrect");
    });

    it("Échec de connexion avec un email inexistant", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "inconnu@mail.com", password: "Test123!" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Email incorrect");
    });

    it("Échec d'inscription sans mot de passe", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          role: "client",
          nom: "Testeur",
          prenom: "Exemple",
          email,
          // password manquant
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Tous les champs requis doivent être fournis");
    });
  });

  afterAll(async () => {
    await db.end();
  });
});
