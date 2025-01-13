import { UserRepository } from "../repositories/userRepository.js";
import { hashPassword } from "../utils/passwordUtils.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

export const UserService = {
  getUserById: async (id) => {
    return await User.findByPk(id);
  },

  createUser: async ({ pseudo, email, password }) => {
    const hashedPassword = await hashPassword(password);
    return await UserRepository.saveUser({
      pseudo,
      email,
      password: hashedPassword,
    });
  },

  updateUser: async (userId, updatedData) => {
    try {
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        throw new Error("Utilisateur non trouvé.");
      }

      if (updatedData.pseudo) {
        if (updatedData.pseudo !== currentUser.pseudo) {
          const existingUser = await User.findOne({
            where: {
              pseudo: updatedData.pseudo,
              id: { [Op.ne]: userId },
            },
          });
          if (existingUser) {
            throw new Error("Ce pseudo est déjà utilisé.");
          }
        }
      }

      if (updatedData.email) {
        if (updatedData.email !== currentUser.email) {
          const existingUser = await User.findOne({
            where: {
              email: updatedData.email,
              id: { [Op.ne]: userId },
            },
          });
          if (existingUser) {
            throw new Error("Cette adresse mail est déjà utilisée.");
          }
        }
      }

      const updatedUser = await User.update(updatedData, {
        where: { id: userId },
      });
      return updatedUser;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      throw new Error(
        `Erreur lors de la mise à jour de l'utilisateur : ${error.message}`
      );
    }
  },

  deleteUser: async (id) => {
    try {
      const deletedRowsCount = await User.destroy({
        where: { id: id },
      });

      if (deletedRowsCount === 0) {
        throw new Error("Aucun utilisateur trouvé pour supprimer");
      }
    } catch (error) {
      throw new Error(
        "Erreur lors de la suppression de l'utilisateur: " + error.message
      );
    }
  },

  getUserProfile: async (token) => {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id || decodedToken.userId;
    return await UserRepository.findById(userId);
  },

  getUserByPseudo: async (pseudo) => {
    return await User.findOne({
      where: { pseudo: pseudo },
    });
  },

  getUserByEmail: async (email) => {
    return await User.findOne({
      where: { email: email },
    });
  },

  getAllUsers: async () => {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération des utilisateurs: " + error.message
      );
    }
  },

  deleteUserById: async (userId) => {
    try {
      await User.destroy({ where: { id: userId } });
    } catch (error) {
      throw new Error(
        "Erreur lors de la suppression de l'utilisateur: " + error.message
      );
    }
  },
};
