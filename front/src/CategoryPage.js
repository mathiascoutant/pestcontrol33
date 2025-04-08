import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Grid } from "@mui/material";
import CardProduct from "./components/Layouts/CardProduct";
import { useTranslation } from "react-i18next";

function CategoryPage() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  // Fonction pour obtenir la clé de traduction standardisée
  const getCategoryTranslationKey = (categoryName) => {
    // Convertir le nom de la catégorie en minuscules et sans accents
    const normalizedName = categoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Mapper les noms de catégories aux clés de traduction
    const categoryMap = {
      fourmis: "ant",
      guepe: "wasp",
      taupe: "mole",
      termite: "termite",
      rat: "rat",
      souris: "mouse",
      cafard: "cockroach",
    };

    return categoryMap[normalizedName] || normalizedName;
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://pestcontrol33.com/api/v1/subCategories`
        );

        // Filtrer la catégorie en fonction de l'ID
        const categoryData = response.data.subCategories.find(
          (category) => category.id === Number(categoryId)
        );

        if (categoryData) {
          setCategory(categoryData);
        } else {
          console.error("Catégorie non trouvée");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la catégorie:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://pestcontrol33.com/api/v1/products`
        );

        // Filtrer les produits correspondant à la catégorie sélectionnée
        const filteredProducts = response.data.filter(
          (product) => product.subCategoryId === Number(categoryId)
        );

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
    fetchProducts();
  }, [categoryId]);

  if (loading) return <Typography>Chargement...</Typography>;
  if (!category) return <Typography>Aucune catégorie trouvée</Typography>;

  return (
    <Box sx={{ textAlign: "center", px: 3, py: 18 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          mb: 3,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {category
          ? t(`categories.${getCategoryTranslationKey(category.name)}`)
          : "Nom de catégorie non disponible"}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ mb: 5, maxWidth: "800px", mx: "auto" }}
      >
        {t(category.description) ||
          "Découvrez nos produits disponibles dans cette catégorie."}
      </Typography>
      {products.length === 0 ? (
        <Typography>
          {t("Aucun produit trouvé pour cette catégorie.")}
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={9} sm={6} md={3} key={product.id}>
              <CardProduct
                id={product.id}
                image={
                  product.medias?.imageUrls?.[0] || "default-image-url.jpg"
                }
                promotion={product.discount ? `-${product.discount}%` : null}
                name={product.nom}
                status={
                  product.stock > 0 ? t("En stock") : t("Rupture de stock")
                }
                price={`${product.prix}€`}
                reduction={product.newPrice ? `${product.newPrice}€` : null}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default CategoryPage;
