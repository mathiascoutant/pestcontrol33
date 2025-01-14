import { app } from "./app.js";
import { connectDatabase } from "./src/config/database.js";

const PORT = 3002;

const checkServerStatus = () => {
  const currentTime = new Date().toLocaleString(); // Récupérer l'heure actuelle
  console.log(`Vérification de l'état du serveur à ${currentTime}`);
  // Vous pouvez ajouter d'autres vérifications ici, par exemple, vérifier la connexion à la base de données
};

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      const currentTime = new Date().toLocaleString(); // Récupérer l'heure actuelle
      console.log(
        `Serveur démarré sur http://https://pestcontrol33.vercel.app le ${currentTime}`
      );
      // Vérifier l'état du serveur toutes les heures (3600000 ms)
      setInterval(checkServerStatus, 3600000);
      //console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du serveur:", error);
    process.exit(1);
  }
}

startServer();
