import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import mongoose from "mongoose";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { JWT_SECRET, generateToken } from "../utils/jwtUtils.js";

export const register = async (req, res) => {
  try {
    const { nom, prenom, pseudo, email, password } = req.body;

    if (!nom || !prenom || !pseudo || !email || !password) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ pseudo }, { email }] },
    });
    if (existingUser) {
      return res.status(400).json({
        message:
          "Un utilisateur avec ce nom d'utilisateur ou cet email existe déjà.",
      });
    }

    const createdPassword = await hashPassword(password);
    if (!createdPassword) {
      return res
        .status(400)
        .json({ message: "Erreur lors de la création du mot de passe" });
    }

    const newUser = await User.create({
      nom,
      prenom,
      pseudo,
      email,
      password: createdPassword,
      admin: 0,
    });

    const token = generateToken({ userId: newUser.id, admin: newUser.admin });

    res.status(201).json({
      token,
      message: "Utilisateur enregistré avec succès",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("Erreur détaillée lors de l'inscription:", error);
    console.error(
      "État de la connexion MongoDB:",
      mongoose.connection.readyState
    );
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Email incorrect" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Utiliser generateToken pour créer le token
    const token = generateToken({ userId: user.id, admin: user.admin });

    // Construire l'objet utilisateur sans dataValues
    const userResponse = {
      nom: user.nom,
      prenom: user.prenom,
      pseudo: user.pseudo,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      admin: user.admin,
    };

    // Envoyer le token et les informations de l'utilisateur au client
    return res.status(200).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

export const protect = async (req, res, next) => {
  try {
    // Vérifier si le token est présent
    const token =
      req.headers.authorization?.startsWith("Bearer") &&
      req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message:
          "Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à cette ressource.",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "L'utilisateur associé à ce token n'existe plus." });
    }

    // Accorder l'accès à la route protégée
    req.user = currentUser;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Token invalide ou expiré", error: error.message });
  }
};

export const restrictTo = async (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Vous n'avez pas la permission d'effectuer cette action",
      });
    }
    next();
  };
};
