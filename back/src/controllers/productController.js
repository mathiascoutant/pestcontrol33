import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/productService.js";
import Product from "../models/productModel.js";
import { verifyToken } from "../utils/jwtUtils.js";
import Favorite from "../models/favoritesModel.js";

export const addProduct = async (req, res) => {
  // Vérifier le token JWT
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ message: "Token invalide ou manquant" });
  }

  if (verified.admin != 1) {
    return res.status(403).json({
      message: "Vous n'avez pas l'autorisation pour créer un atricle",
    });
  }

  try {
    const { nom, description, stock, status, prix } = req.body;

    if (
      !nom ||
      !description ||
      stock === undefined ||
      status === undefined ||
      prix === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    const existingProduct = await Product.findOne({ where: { nom } });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Un produit avec ce nom existe déjà." });
    }

    const newProduct = await createProduct({
      nom,
      description,
      stock,
      status,
      prix,
      favorites: 0,
    });
    res.status(201).json({
      message: "Produit créé avec succès",
      product: newProduct,
    });
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    res.status(500).json({
      message: "Erreur lors de la création du produit",
      error: error.message,
    });
  }
};

export const fetchAllProducts = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const verified = verifyToken(token); // Vérifier le token
    const userId = verified ? verified.userId : null; // Récupérer l'ID de l'utilisateur si le token est valide

    const products = await getAllProducts();

    // Si l'utilisateur est authentifié, vérifier les likes
    if (userId) {
      // Récupérer tous les likes de l'utilisateur pour les produits
      const userFavorites = await Favorite.findAll({
        where: { userId: userId },
      });

      // Créer un ensemble d'IDs de produits que l'utilisateur a likés
      const likedProductIds = new Set(
        userFavorites.map((favorite) => favorite.productId)
      );

      // Ajouter la propriété 'like' à chaque produit
      const productsWithLikes = products.map((product) => ({
        ...product.toJSON(), // Convertir le produit en JSON
        like: likedProductIds.has(product.id) ? 1 : 0, // Vérifier si le produit est liké
      }));

      return res.status(200).json(productsWithLikes);
    }

    // Si l'utilisateur n'est pas authentifié, renvoyer les produits sans la propriété 'like'
    return res.status(200).json(
      products.map((product) => ({
        ...product.toJSON(),
        // Ne pas ajouter 'like' pour les utilisateurs non authentifiés
      }))
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des produits",
      error: error.message,
    });
  }
};

export const fetchProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    return res.status(200).json(product); // Renvoyer le produit trouvé
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la récupération du produit",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  // Vérifier le token JWT
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token); // Vérifier le token
  if (!verified) {
    return res.status(401).json({ message: "Token invalide ou manquant" });
  }
  if (verified.admin != 1) {
    return res.status(403).json({
      message: "Vous n'avez pas l'autorisation pour créer un atricle",
    });
  }

  try {
    const productId = req.params.id;
    const { nom, description, stock, status, prix } = req.body;

    // Vérifier si le produit existe
    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Mettre à jour le produit
    const updatedProduct = await updateProductService(productId, {
      nom,
      description,
      stock,
      status,
      prix,
    });

    return res.status(200).json({
      message: "Produit mis à jour avec succès",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la mise à jour du produit",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  // Vérifier le token JWT
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token); // Vérifier le token
  if (!verified) {
    return res.status(401).json({ message: "Token invalide ou manquant" });
  }

  if (verified.admin != 1) {
    return res.status(403).json({
      message: "Vous n'avez pas l'autorisation pour créer un atricle",
    });
  }

  try {
    const productId = req.params.id;

    // Vérifier si le produit existe
    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Supprimer le produit
    await deleteProductService(productId);

    return res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de la suppression du produit",
      error: error.message,
    });
  }
};

export const likeProduct = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ message: "Token invalide ou manquant" });
  }

  const userId = verified.userId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Le productId est requis" });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    const existingFavorite = await Favorite.findOne({
      where: { userId: userId, productId: productId },
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: "Vous ne pouvez pas liker plusieurs fois le même article.",
      });
    }

    const favorite = await Favorite.create({
      userId: userId,
      productId: productId,
    });

    await Product.update(
      { favorites: product.favorites + 1 },
      { where: { id: productId } }
    );

    return res.status(201).json({
      message: "Produit ajouté aux favoris avec succès",
      favorite: favorite,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    return res.status(500).json({
      message: "Erreur serveur lors de l'ajout aux favoris",
      error: error.message,
    });
  }
};

export const unlikeProduct = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ message: "Token invalide ou manquant" });
  }

  const userId = verified.userId;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Le productId est requis" });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    const existingFavorite = await Favorite.findOne({
      where: { userId: userId, productId: productId },
    });

    if (!existingFavorite) {
      return res
        .status(400)
        .json({ message: "Vous n'avez pas encore liké ce produit." });
    }

    await Favorite.destroy({
      where: { userId: userId, productId: productId },
    });

    await Product.update(
      { favorites: product.favorites - 1 },
      { where: { id: productId } }
    );

    return res.status(200).json({
      message: "Produit retiré des favoris avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du retrait des favoris:", error);
    return res.status(500).json({
      message: "Erreur serveur lors du retrait des favoris",
      error: error.message,
    });
  }
};
