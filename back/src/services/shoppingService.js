import ShoppingCart from "../models/shoppingModel.js";
import Product from "../models/productModel.js";

export const addShoppingItem = async (userId, productId, quantity) => {

    const product = await Product.findOne({ where: { id: productId } });
  if (!product) {
    throw new Error("Produit non trouvé");
  }

  if (product.stock < quantity) {
    throw new Error("Quantité demandée supérieure au stock disponible");
  }

  const existingItem = await ShoppingCart.findOne({
    where: { userId, productId },
  });

  if (existingItem) {
    const totalQuantity = existingItem.quantity + quantity;
    if (product.stock < totalQuantity) {
      throw new Error(
        "Quantité totale demandée supérieure au stock disponible"
      );
    }
    existingItem.quantity = totalQuantity;
    await existingItem.save();
    return { message: "Quantité mise à jour avec succès" };
  } else {
    await ShoppingCart.create({ userId, productId, quantity });
    return { message: "Article ajouté avec succès" };
  }
};

export const getShoppingItemsByUserId = async (userId) => {
  const shoppingItems = await ShoppingCart.findAll({ where: { userId } });
  if (!shoppingItems.length) {
    throw new Error("Aucun article trouvé dans le panier.");
  }

  const productIds = shoppingItems.map((item) => item.productId);
  const products = await Product.findAll({ where: { id: productIds } });

  return shoppingItems.map((item) => {
    const product = products.find((prod) => prod.id === item.productId);
    return {
      ...item.toJSON(),
      productName: product ? product.nom : null,
      productDescription: product ? product.description : null,
      productPrice: product ? product.prix : null,
      productStock: product ? product.stock : null,
    };
  });
};

export const removeShoppingItem = async (userId, productId, quantity) => {

  const existingItem = await ShoppingCart.findOne({
    where: { userId, productId },
  });

  if (!existingItem) {
    throw new Error("L'article n'est pas dans le panier.");
  }

  if (quantity > existingItem.quantity) {
    throw new Error(
      "La quantité à supprimer est supérieure à la quantité dans le panier."
    );
  }

  existingItem.quantity -= quantity;

  if (existingItem.quantity <= 0) {
    await ShoppingCart.destroy({ where: { userId, productId } });
    return { message: "Article supprimé du panier." };
  } else {
    await existingItem.save();
    return { message: "Quantité mise à jour avec succès." };
  }
};
