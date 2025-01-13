import { Sequelize } from "sequelize";
// Configuration de la connexion à la base de données
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "sql7.freesqldatabase.com",
  username: "sql7757369",
  password: "gZfzpZcU2i",
  database: "sql7757369",
  logging: false,
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Tester la connexion
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    return false;
  }
};

// Vérifier périodiquement la connexion
const checkDatabaseConnection = async () => {
  const isConnected = await connectDatabase();
  if (isConnected) {
    console.log("La connexion à la base de données est fonctionnelle");
  } else {
    console.error("La connexion à la base de données a échoué");
  }
};

// Vérifier la connexion toutes les 5 minutes
setInterval(checkDatabaseConnection, 5 * 60 * 1000);

// Vérifier la connexion au démarrage
checkDatabaseConnection();

export { sequelize, connectDatabase, checkDatabaseConnection };
