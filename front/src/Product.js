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
import StarIcon from "@mui/icons-material/Star";
import ReviewCard from "./components/UI/ReviewCard";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CarouselLastProducts from "./components/Sections/CarouselLastProducts";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        setSnackbarMessage("Le produit a été ajouté au panier !");
      } else {
        console.error("Erreur lors de l'ajout au panier :", data);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error);
    }
  };

  const addToFavorites = async (productId) => {
    const token = localStorage.getItem("token");
    const url = isFavorite
      ? `${process.env.REACT_APP_API_BASE_URL}/products/unlike`
      : `${process.env.REACT_APP_API_BASE_URL}/products/like`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsFavorite(!isFavorite);
        setOpenSnackbar(true);

        setSnackbarMessage(
          isFavorite
            ? "Produit retiré des favoris !"
            : "Produit ajouté aux favoris !"
        );

        console.log(
          isFavorite
            ? "Produit retiré des favoris :"
            : "Produit ajouté aux favoris :",
          data
        );
      } else {
        console.error("Erreur lors de l'ajout/retrait aux favoris :", data);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout/retrait aux favoris :", error);
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
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
                mb: 3,
              }}
            >
              <Typography variant="h6">Avis des clients :</Typography>
              <Button
                variant="contained"
                onClick={handleAddComment}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Ajouter un avis
              </Button>
            </Box>
            {Array.isArray(customerReviews) && customerReviews.length > 0 && (
              <Carousel
                responsive={{
                  superLargeDesktop: {
                    breakpoint: { max: 4000, min: 1536 },
                    items: 4,
                  },
                  desktop: {
                    breakpoint: { max: 1536, min: 1024 },
                    items: 3,
                  },
                  tablet: {
                    breakpoint: { max: 1024, min: 600 },
                    items: 2,
                  },
                  mobile: {
                    breakpoint: { max: 600, min: 0 },
                    items: 1,
                  },
                }}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={3000}
                keyBoardControl={true}
                customTransition="transform 300ms ease-in-out"
                transitionDuration={300}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px"
                centerMode={false}
              >
                {customerReviews.map((review) => (
                  <Box
                    key={review.id}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      p: 1,
                    }}
                  >
                    <ReviewCard
                      review={review}
                      sx={{
                        width: "100%",
                        maxWidth: "350px",
                        height: "100%",
                      }}
                    />
                  </Box>
                ))}
              </Carousel>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ mt: { xs: 2, sm: 4, md: 8 } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: { xs: 2, sm: 3, md: 4 },
          alignItems: "center",
          borderRadius: "10px",
          p: { xs: 1, sm: 2 },
          width: "100%",
          height: { xs: "auto", sm: "100px" },
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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          p: { xs: 1, sm: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 1,
            height: "270px",
            overflowY: "auto",
            mt: 2,
            width: { md: "10%" },
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
            p: { xs: 1, sm: 2 },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <img
            src={images[currentImageIndex]}
            alt={product.nom}
            style={{
              width: "100%",
              maxWidth: "500px",
              height: "auto",
              maxHeight: "420px",
              borderRadius: "10px",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", md: "60%" }, ml: { xs: 2, md: 0 } }}>
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
              mb: { xs: 4, sm: 8, md: 15 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              maxWidth: { xs: "100%", md: "400px" },
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
            <IconButton
              sx={{ border: "1px solid red" }}
              onClick={() => addToFavorites(product.id)}
            >
              <FavoriteBorderIcon
                fontSize="small"
                color={isFavorite ? "error" : "disabled"}
              />
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            "& .MuiTabs-root": {
              maxWidth: "100%",
              "& .MuiTab-root": {
                fontSize: { xs: "0.8rem", sm: "1rem" },
                minWidth: { xs: "auto", sm: "160px" },
                px: { xs: 1, sm: 2 },
              },
            },
          }}
        >
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Description" />
            <Tab label="Conseils d'utilisation" />
            <Tab label="Avis" />
          </Tabs>
        </Box>
        <Box
          sx={{
            mt: 2,
            p: { xs: 1, sm: 2 },
            px: { xs: 2, sm: 5, md: 10 },
            py: { xs: 2, sm: 3, md: 5 },
            letterSpacing: { xs: "0.5em", sm: "1em" },
            lineHeight: "1.5",
            whiteSpace: "pre-line",
            textAlign: "justify",
          }}
        >
          {renderTabPanel(tabValue)}
        </Box>
      </Box>
      <Box
        sx={{
          mt: 4,
          width: "100%",
        }}
      >
        <CarouselLastProducts />
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: isMobile ? "bottom" : "top",
          horizontal: "right",
        }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Product;
