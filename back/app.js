import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import productsRoutes from "./src/routes/productsRoutes.js";

const app = express();

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

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

export { app };
