import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Header from "./components/Layouts/Header";
import SearchBar from "./components/UI/SearchBar";
import CardProduct from "./components/Layouts/CardProduct";
import fondImage from "./Assets/fond.png";
import { Link } from "react-router-dom";
import Banner from "./components/UI/Banner";
import FilterListIcon from "@mui/icons-material/FilterList";
import CardProductMobile from "./components/UI/CardProductMobile";
import { useTranslation } from "react-i18next";

function Shop() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/subCategories`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data.subCategories);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/products/`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Les données récupérées ne sont pas un tableau");
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.prix);
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    const matchesPrice = price >= min && price <= max;
    const matchesAvailability = onlyAvailable ? product.stock > 0 : true;
    const matchesCategory = selectedCategory
      ? product.subCategoryId === selectedCategory
      : true;

    return matchesPrice && matchesAvailability && matchesCategory;
  });

  const FilterSidebar = () => (
    <Box
      sx={{
        width: isMobile ? "100%" : 220,
        flexShrink: 0,
        borderRight: isMobile ? "none" : "1px solid #ddd",
        pr: 1,
        height: "100%",
        ml: { xs: 0, sm: 0, md: 0, lg: -10 },
        p: 2,
      }}
    >
      <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
        {t("shop.categories")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {categories.map((category) => (
          <Box
            key={category.id}
            onClick={() => {
              setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              );
              if (isMobile) setDrawerOpen(false);
            }}
            sx={{
              cursor: "pointer",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor:
                selectedCategory === category.id ? "#1976d2" : "transparent",
              color: selectedCategory === category.id ? "white" : "inherit",
              fontSize: "0.9rem",
              "&:hover": {
                backgroundColor:
                  selectedCategory === category.id ? "#1976d2" : "#f5f5f5",
              },
            }}
          >
            {category.name}
          </Box>
        ))}
      </Box>

      <Typography variant="body1" sx={{ mb: 1, mt: 3, fontWeight: "bold" }}>
        {t("shop.filters")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          label={t("shop.minPrice")}
          variant="outlined"
          size="small"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          fullWidth
        />
        <TextField
          label={t("shop.maxPrice")}
          variant="outlined"
          size="small"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
          }
          label={t("shop.onlyAvailable")}
        />
      </Box>
    </Box>
  );

  return (
    <Box>
      <Header />
      {isMobile && <SearchBar />}

      <Box
        sx={{
          backgroundImage: `url(${fondImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: isMobile ? -1 : 8,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#000",
            mb: 2,
            fontWeight: "bold",
          }}
        >
          {t("shop.products")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
              {t("shop.home")}
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>{t("shop.products")}</Typography>
        </Box>
      </Box>
      <Container
        maxWidth="lg"
        sx={{ pl: { xs: 2, sm: 2 }, pr: { xs: 2, sm: 2 } }}
      >
        {isMobile && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                backgroundColor: "#f5f5f5",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            py: 2,
            ml: isMobile ? 0 : "-8px",
          }}
        >
          {!isMobile && <FilterSidebar />}
          <Box sx={{ flexGrow: 1 }}>
            <Grid
              container
              spacing={2}
              justifyContent={{ xs: "flex-start", sm: "flex-start" }}
              sx={{
                width: "100%",
              }}
            >
              {filteredProducts.map((product) => (
                <Grid
                  item
                  xs={12} // S'assurer que chaque produit prend toute la largeur sur mobile
                  sm={6}
                  md={4}
                  lg={4}
                  key={product.id}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    "& > div": {
                      width: { xs: "100%", sm: "80%" },
                      height: { xs: "150px", sm: "auto" },
                    },
                  }}
                >
                  {/* Affichage du composant en fonction de la taille de l'écran */}
                  {isMobile ? (
                    <CardProductMobile
                      id={product.id}
                      image={
                        product.medias?.imageUrls?.[0] ||
                        "default-image-url.jpg"
                      }
                      name={product.nom}
                      status={
                        product.stock > 0 ? "En stock" : "Rupture de stock"
                      }
                      price={`${product.prix}€`}
                    />
                  ) : (
                    <CardProduct
                      id={product.id}
                      image={
                        product.medias?.imageUrls?.[0] ||
                        "default-image-url.jpg"
                      }
                      promotion={
                        product.discount ? `-${product.discount}%` : null
                      }
                      name={product.nom}
                      status={
                        product.stock > 0 ? "En stock" : "Rupture de stock"
                      }
                      price={`${product.prix}€`}
                      reduction={
                        product.newPrice ? `${product.newPrice}€` : null
                      }
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>

      {/* Drawer pour mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <FilterSidebar />
        </Box>
      </Drawer>

      <Banner />
    </Box>
  );
}

export default Shop;
