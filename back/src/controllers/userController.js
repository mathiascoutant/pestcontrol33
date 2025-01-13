import { UserService } from "../services/userService.js";
import { verifyToken } from "../utils/jwtUtils.js";
import User from "../models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", userId: user._id });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erreur lors de la création de l'utilisateur" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);
    const userId = decoded.userId;

    const { nom, prenom, pseudo, email } = req.body;

    const currentUser = await UserService.getUserById(userId);
    if (!currentUser)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    let updatedFields = {};
    let hasChanges = false;

    if (pseudo) {
      if (pseudo !== currentUser.pseudo) {
        const existingUser = await UserService.getUserByPseudo(pseudo);
        if (existingUser)
          return res
            .status(400)
            .json({ message: "Ce pseudo est déjà utilisé" });
        updatedFields.pseudo = pseudo;
        hasChanges = true;
      }
    }
    if (nom && nom !== currentUser.nom) {
      updatedFields.nom = nom;
      hasChanges = true;
    }
    if (prenom && prenom !== currentUser.prenom) {
      updatedFields.prenom = prenom;
      hasChanges = true;
    }
    if (email && email !== currentUser.email) {
      const existingUser = await UserService.getUserByEmail(email);
      if (existingUser)
        return res
          .status(400)
          .json({ message: "Cette adresse mail est déjà utilisée" });
      updatedFields.email = email;
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(200).json([]);
    }

    await UserService.updateUser(userId, updatedFields);

    const updatedUser = await UserService.getUserById(userId);

    // Formater la réponse
    const responseUser = {
      nom: updatedUser.nom,
      prenom: updatedUser.prenom,
      pseudo: updatedUser.pseudo,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user: responseUser,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour de l'utilisateur",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decodedToken = verifyToken(token);
    const userId = decodedToken.id || decodedToken.userId;

    const existingUser = await UserService.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await UserService.deleteUser(userId);

    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
};

export const getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const userResponse = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      pseudo: user.pseudo,
      email: user.email,
      date_de_naissance: user.date_de_naissance,
      pays_id: user.pays_id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json({
      user: userResponse,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil de l'utilisateur:",
      error
    );
    return res.status(500).json({
      message:
        "Erreur serveur lors de la récupération du profil de l'utilisateur",
      error: error.message,
    });
  }
};

export const getUserStatus = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decodedToken = verifyToken(token);
    const userId = decodedToken.userId;

    const userInfo = await UserService.getUserById(userId);
    if (!userInfo) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    return res.status(200).json({ userInfo });
  } catch (error) {
    console.error("Erreur lors de la récupération des statuts:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des statuts",
      error: error.message,
    });
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des utilisateurs",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération des utilisateurs",
      error: error.message,
    });
  }
};

export const deleteUserAdmin = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token);

  if (!verified) {
    return res.status(401).json({ message: "Token invalide ou manquant" });
  }

  if (verified.admin !== 1) {
    return res.status(403).json({
      message: "Vous n'avez pas l'autorisation de supprimer des utilisateurs.",
    });
  }

  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ message: "L'ID de l'utilisateur est requis." });
  }

  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    await UserService.deleteUserById(userId);
    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
