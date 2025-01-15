import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Breadcrumbs,
  Divider,
  Link as MuiLink,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CardProduct from "./components/Layouts/CardProduct";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import ReviewCard from "./components/UI/ReviewCard";
import Banner from "./components/UI/Banner";

function Product() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const [similarProducts, setSimilarProducts] = useState([]);

  const [tabValue, setTabValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");

  const [customerReviews, setCustomerReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    fetch(`http://37.187.225.41:3002/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Product data received:", data);
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);
  useEffect(() => {
    fetch(`http://37.187.225.41:3002/api/v1/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("All products data received:", data);
        setSimilarProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching all products:", error);
      });
  }, [id]);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.notation, 0);
    return (total / reviews.length).toFixed(1);
  };

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(
        `http://37.187.225.41:3002/api/v1/comment/${id}`
      );
      const reviews = await response.json();
      setCustomerReviews(reviews);
      setAverageRating(calculateAverageRating(reviews));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const renderTabPanel = (value) => {
    switch (value) {
      case 0:
        return (
          <Typography>
            {product.description.charAt(0).toUpperCase() +
              product.description.slice(1)}
          </Typography>
        );
      case 1:
        return <Typography>Conseils d'utilisation ici.</Typography>;
      case 2:
        return (
          <Box>
            <Typography variant="h6">Avis des clients :</Typography>
            <Grid container spacing={2}>
              {Array.isArray(customerReviews) &&
                customerReviews.map((review) => (
                  <Grid item xs={12} sm={6} md={3} key={review.id}>
                    <ReviewCard review={review} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  if (!product) return <div>Chargement...</div>;

  return (
    <Box sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 4,
          alignItems: "center",
          bgcolor: "#F9F1E7",
          borderRadius: "10px",
          p: 2,
          width: "100%",
          height: "100px",
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            color="inherit"
            key="home"
            component={Link}
            to="/"
            sx={{ textTransform: "capitalize" }}
          >
            Accueil
          </MuiLink>
          <MuiLink
            key="shop"
            component={Link}
            to="/shop"
            color="inherit"
            sx={{ textTransform: "capitalize" }}
          >
            Nos produits
          </MuiLink>
          <Typography color="text.primary" sx={{ textTransform: "capitalize" }}>
            {product.nom}
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ display: "flex", gap: 4, p: 4 }}>
        <Box
          sx={{
            width: "40%",
            ml: 4,
            bgcolor: "#F9F1E7",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
          }}
        >
          {product.images && product.images.length > 0 && (
            <Typography variant="caption" sx={{ mb: 1 }}>
              {product.images.length} images disponibles
            </Typography>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {product.images &&
              product.images.map((image, index) => (
                <Card
                  key={index}
                  sx={{ cursor: "pointer" }}
                  onClick={() => setSelectedImage(image)}
                >
                  <CardMedia
                    component="img"
                    image={image}
                    alt={product.nom}
                    sx={{ height: "100px", objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Image {index + 1}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Box>
          <img
            src={selectedImage || product.image || "/default-product-image.jpg"}
            alt={product.nom}
            style={{ width: "90%", marginBottom: "1rem", borderRadius: "10px" }}
          />
        </Box>
        <Box sx={{ width: "60%" }}>
          <Typography variant="h5" sx={{ mb: 4 }} gutterBottom>
            {product.nom.charAt(0).toUpperCase() + product.nom.slice(1)}
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ fontWeight: "light" }}
            gutterBottom
          >
            {product.newPrice || product.prix}€
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {Array.from({ length: 5 }, (_, index) => {
              if (index < Math.floor(averageRating)) {
                return <StarIcon key={index} sx={{ color: "#FFC700" }} />;
              } else if (
                index === Math.floor(averageRating) &&
                averageRating % 1 !== 0
              ) {
                return (
                  <StarIcon
                    key={index}
                    sx={{ color: "#FFC700" }}
                    style={{ opacity: 0.5 }}
                  />
                );
              } else {
                return <StarIcon key={index} sx={{ color: "disabled" }} />;
              }
            })}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {averageRating} / 5
            </Typography>
          </Box>

          {product.discount && (
            <Typography variant="body2" color="error">
              -{product.discount}% de réduction
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              mb: 15,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              maxWidth: "400px",
            }}
            color="text.secondary"
          >
            {product.description.charAt(0).toUpperCase() +
              product.description.slice(1)}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, my: 3 }}>
            <TextField
              type="number"
              defaultValue={1}
              InputProps={{ inputProps: { min: 1, max: product.stock } }}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={product.stock === 0}
            >
              Ajouter au panier
            </Button>
            <IconButton sx={{ border: "1px solid red" }}>
              <FavoriteBorderIcon fontSize="small" color="error" />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="body2">
              Stock disponible: {product.stock}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ width: "100%", mt: 2 }} />
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Description" />
            <Tab label="Conseils d'utilisation" />
            <Tab label="Avis" />
          </Tabs>
        </Box>
        <Box
          sx={{
            mt: 2,
            p: 2,
            px: 10,
            py: 5,
            letterSpacing: "1em",
            lineHeight: "1.5",
            whiteSpace: "pre-line",
            textAlign: "justify",
          }}
        >
          {renderTabPanel(tabValue)}
        </Box>
      </Box>
      <Box sx={{ mt: 4, p: 2, px: 10, py: 5 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          Nos produits
          <IconButton component={Link} to="/shop" sx={{ ml: 1 }}>
            <ArrowForwardIcon />
          </IconButton>
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 2,
          }}
        >
          {similarProducts.slice(0, 4).map((product) => (
            <CardProduct
              key={product.id}
              id={product.id}
              name={product.nom}
              price={product.newPrice || product.prix}
              reduction={product.discount ? `-${product.discount}%` : null}
              status={product.stock > 0 ? "En stock" : "Rupture de stock"}
              image={product.image}
              promotion={product.promotion}
            />
          ))}
        </Box>
      </Box>
      <Banner />
    </Box>
  );
}

export default Product;
