import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Product = sequelize.define(
  "produits",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    favorites: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "produits",
    timestamps: false,
  }
);

Product.findById = async function (id) {
  return await this.findOne({
    where: { id: id },
  });
};

export default Product;
