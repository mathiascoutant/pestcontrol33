import Comment from "../models/commentModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const addComment = async ({ userId, notation, comment, productId }) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Produit non trouvé.");
  }
  const newComment = await Comment.create({
    userId,
    notation,
    comment,
    productId,
  });

  return newComment;
};

export const getAllCommentsByProductId = async (productId) => {
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error("Produit non trouvé.");
  }

  const comments = await Comment.findAll({
    where: { productId },
  });

  return comments;
};

export const deleteComment = async (commentId, userId, isAdmin) => {
  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    throw new Error("Commentaire non trouvé.");
  }

  if (comment.userId !== userId && isAdmin !== 1) {
    throw new Error(
      "Vous n'avez pas l'autorisation de supprimer ce commentaire."
    );
  }

  await Comment.destroy({ where: { id: commentId } });
  return { message: "Commentaire supprimé avec succès." };
};

export const getTenLatestComments = async () => {
  const comments = await Comment.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
  });

  const commentsWithUserInfo = await Promise.all(
    comments.map(async (comment) => {
      const user = await User.findByPk(comment.userId, {
        attributes: ["id", "pseudo"],
      });
      return {
        ...comment.toJSON(),
        user: user ? user.toJSON() : null,
      };
    })
  );

  return commentsWithUserInfo;
};
