import { verifyToken } from "../utils/jwtUtils.js";
import * as discountService from "../services/discountService.js";
import Product from "../models/productModel.js";

export const addDiscount = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token);

  if (!verified || verified.admin !== 1) {
    return res
      .status(403)
      .json({ message: "Accès refusé : vous devez être un administrateur." });
  }

  const { productId, discount, startDate, endDate } = req.body;

  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return res
      .status(400)
      .json({ message: "Les dates de début et de fin doivent être valides." });
  }

  if (start < today) {
    return res
      .status(400)
      .json({ message: "La date de début doit être au moins aujourd'hui." });
  }

  if (end < today) {
    return res
      .status(400)
      .json({ message: "La date de fin doit être au moins aujourd'hui." });
  }

  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).json({ message: "Produit non trouvé." });
  }

  const basePrice = product.prix;
  const newPrice = basePrice - basePrice * (discount / 100);

  try {
    const newDiscount = await discountService.createDiscount({
      productId,
      discount,
      newPrice,
      startDate: start,
      endDate: end,
    });
    return res.status(201).json(newDiscount);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de l'ajout de la réduction",
      error: error.message,
    });
  }
};

export const updateDiscount = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token);

  if (!verified || verified.admin !== 1) {
    return res
      .status(403)
      .json({ message: "Accès refusé : vous devez être un administrateur." });
  }

  const { productId, discount, startDate, endDate, discountId } = req.body;

  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return res
      .status(400)
      .json({ message: "Les dates de début et de fin doivent être valides." });
  }

  if (start < today) {
    return res
      .status(400)
      .json({ message: "La date de début doit être au moins aujourd'hui." });
  }

  if (end < today) {
    return res
      .status(400)
      .json({ message: "La date de fin doit être au moins aujourd'hui." });
  }

  try {
    const updatedDiscount = await discountService.updateDiscount({
      discountId,
      productId,
      discount,
      startDate: start,
      endDate: end,
    });

    return res.status(200).json({
      message: "Confirmation de la mise à jour de la réduction.",
      discount: updatedDiscount,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteDiscount = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const verified = verifyToken(token);

  if (!verified || verified.admin !== 1) {
    return res
      .status(403)
      .json({ message: "Accès refusé : vous devez être un administrateur." });
  }

  const { discountId } = req.body;

  if (!discountId) {
    return res
      .status(400)
      .json({ message: "L'ID de la réduction est requis." });
  }

  try {
    const result = await discountService.deleteDiscount(discountId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
