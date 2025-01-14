import express from "express";
import cors from "cors";
import { connectDatabase } from "./src/config/database.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import productsRoutes from "./src/routes/productsRoutes.js";
import shoppingRoutes from "./src/routes/shoppingRoutes.js";
import discountRoutes from "./src/routes/discountRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";

const app = express();

// Connexion à la base de données
connectDatabase()
  .then(() => console.log("Base de données connectée avec succès"))
  .catch((err) =>
    console.error("Erreur de connexion à la base de données:", err)
  );

// Configuration de CORS
app.use(
  cors({
    origin: "*",
  })
);

const api = "api/v1";
// Middleware pour parser le JSON
app.use(express.json());

// Utilisation des routes
app.use(`/${api}/auth`, authRoutes);
app.use(`/${api}/users`, userRoutes);
app.use(`/${api}/products`, productsRoutes);
app.use(`/${api}/shopping`, shoppingRoutes);
app.use(`/${api}/discount`, discountRoutes);
app.use(`/${api}/comment`, commentRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

export { app };
