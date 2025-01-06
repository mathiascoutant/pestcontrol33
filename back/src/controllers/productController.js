import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/productService.js";
import Product from "../models/productModel.js"; 
import { verifyToken } from "../utils/jwtUtils.js"; 

export const addProduct = async (req, res) => {
  // Vérifier le token JWT
  const token = req.headers.authorization?.split(" ")[1]; 
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ message: "Token invalide ou manquant" });
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
    const products = await getAllProducts(); 
    res.status(200).json(products);
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
