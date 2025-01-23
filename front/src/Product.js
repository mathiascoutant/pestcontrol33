import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  Breadcrumbs,
  Divider,
  Link as MuiLink,
  Card,
  CardMedia,
  IconButton,
  Grid,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, Link, useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CardProduct from "./components/Layouts/CardProduct";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import ReviewCard from "./components/UI/ReviewCard";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Product() {
  const [product, setProduct] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { id } = useParams();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const reviewsRef = useRef(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/products/${id}`
        );
        const data = await response.json();
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProductInCart = cart.find(
          (item) => item.productId === data.id
        );

        // Mettre à jour le stock en fonction de la quantité dans le panier
        if (existingProductInCart) {
          data.stock -= existingProductInCart.quantity;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const fetchSimilarProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products`
      );
      const data = await response.json();
      setSimilarProducts(data);
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
  }, []);

  useEffect(() => {
    fetchSimilarProducts();
  }, [fetchSimilarProducts]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/comment/${id}`
      );
      const data = await response.json();
      setCustomerReviews(data.comments);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = cart.filter((item) => {
        const addedTime = item.addedAt || 0;
        return Date.now() - addedTime < 24 * 60 * 60 * 1000; // 1 jour
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    };
    updateCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/shopping/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setOpenSnackbar(true);

        setProduct((prevProduct) => ({
          ...prevProduct,
          stock: prevProduct.stock - quantity,
        }));

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingProductIndex = cart.findIndex(
          (item) => item.productId === productId
        );
        if (existingProductIndex > -1) {
          cart[existingProductIndex].quantity += quantity; // Mettre à jour la quantité si le produit existe déjà
        } else {
          cart.push({ productId, quantity }); // Ajouter le produit avec la quantité
        }
        localStorage.setItem("cart", JSON.stringify(cart));
      } else {
        console.error("Erreur lors de l'ajout au panier :", data);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  if (!product) return <div>Chargement...</div>;

  const images = product.medias.imageUrls;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleAddComment = () => {
    navigate(`/addcomment/${product.id}`);
  };

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
        return <Typography>{product.conseilsUtilisation}</Typography>;
      case 2:
        return (
          <Box ref={reviewsRef}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Avis des clients :</Typography>
              <Button variant="contained" onClick={handleAddComment}>
                Ajouter un avis
              </Button>
            </Box>
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
      <Box sx={{ display: "flex", gap: 2, p: 4 }}>
        {/* Colonne des petites images */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            height: "270px",
            overflowY: "auto",
            mt: 2,
            width: "10%",
            alignItems: "center",
          }}
        >
          {images.slice(0, 3).map((image, index) => (
            <Card
              key={index}
              sx={{
                cursor: "pointer",
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "10px",
                overflow: "hidden",
              }}
              onClick={() => setCurrentImageIndex(index)}
            >
              <CardMedia
                component="img"
                image={image}
                alt={`Produit ${index}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Card>
          ))}
          <Button onClick={handleNextImage} sx={{ mt: 2, color: "black" }}>
            <ArrowForwardIosIcon fontSize="small" />
          </Button>
        </Box>

        <Box
          sx={{
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 2,
          }}
        >
          <img
            src={images[currentImageIndex]}
            alt={product.nom}
            style={{
              maxWidth: "500px",
              height: "420px",
              borderRadius: "10px",
            }}
          />
        </Box>
        <Box sx={{ width: "60%" }}>
          <Typography variant="h5" sx={{ mb: 4 }} gutterBottom>
            {product.nom.charAt(0).toUpperCase() + product.nom.slice(1)}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {product.newPrice ? product.newPrice + "€" : product.prix + "€"}
            </Typography>
            {product.discount && (
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontWeight: "light",
                  textDecoration: "line-through",
                  mt: 1,
                }}
                gutterBottom
              >
                {product.prix}€
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            {Array.isArray(customerReviews) && customerReviews.length > 0 ? (
              <>
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
                <Typography
                  component={Link}
                  onClick={() => setTabValue(2)}
                  variant="body2"
                  sx={{
                    ml: 1,
                    fontWeight: "semibold",
                    textDecoration: "none",
                    color: "black",
                    cursor: "pointer",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  ({customerReviews.length} avis)
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Pas d'avis pour le moment.
              </Typography>
            )}
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
              onChange={(e) => setQuantity(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={product.stock === 0}
              onClick={() => addToCart(product.id, quantity)}
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
              image={product.medias?.imageUrls?.[0]}
              promotion={product.promotion}
            />
          ))}
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Le produit a bien été ajouté au panier !
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Product;
