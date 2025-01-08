import Product from "../models/productModel.js";

export const createProduct = async (productData) => {
  try {
    const newProduct = await Product.create(productData);
    return newProduct;
  } catch (error) {
    throw new Error("Erreur lors de la création du produit: " + error.message);
  }
};

export const getAllProducts = async () => {
  try {
    const products = await Product.findAll();
    return products;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération des produits: " + error.message
    );
  }
};

export const getProductById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    return product;
  } catch (error) {
    throw new Error(
      "Erreur lors de la récupération du produit: " + error.message
    );
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const [updatedRowsCount] = await Product.update(productData, {
      where: { id: id },
    });

    if (updatedRowsCount === 0) {
      throw new Error("Aucun produit trouvé pour mettre à jour");
    }

    const updatedProduct = await getProductById(id);
    return updatedProduct;
  } catch (error) {
    throw new Error(
      "Erreur lors de la mise à jour du produit: " + error.message
    );
  }
};

export const deleteProduct = async (id) => {
  try {
    const deletedRowsCount = await Product.destroy({
      where: { id: id },
    });

    if (deletedRowsCount === 0) {
      throw new Error("Aucun produit trouvé pour supprimer");
    }
  } catch (error) {
    throw new Error(
      "Erreur lors de la suppression du produit: " + error.message
    );
  }
};
