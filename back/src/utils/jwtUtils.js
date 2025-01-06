import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d", // Le token expire après 1 jour
    algorithm: "HS256",
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error.message);
    return null;
  }
};

export { JWT_SECRET, generateToken, verifyToken };
