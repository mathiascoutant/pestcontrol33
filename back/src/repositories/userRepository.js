import User from '../models/userModel.js';

export const UserRepository = {
  findBy: async (id) => await User.findById(id).select('-password'),
  saveUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },
  async updateUser(userId, updatedData) {
    try {
      const [updatedRowsCount] = await User.update(updatedData, {
        where: { id: userId },
      });

      
      if (updatedRowsCount === 0) {
        throw new Error("Aucun utilisateur trouvé pour mettre à jour");
      }

      const updatedUser = await User.findByPk(userId);
      
      if (!updatedUser) {
        throw new Error("Utilisateur non trouvé après la mise à jour");
      }

      return updatedUser;
    } catch (error) {
      console.error('Erreur dans la mise à jour de l\'utilisateur :', error);
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur : ${error.message}`);
    }
  },

  deleteUser: async (id) => await User.findByIdAndDelete(id),
};
