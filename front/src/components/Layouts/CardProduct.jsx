import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton, Snackbar, Alert } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

function CardProduct({ promotion, name, status, price, reduction, id, image }) {
  const navigate = useNavigate();

  const [isInCart, setIsInCart] = React.useState(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.some((item) => item.id === id);
  });

  const [isFavorited, setIsFavorited] = React.useState(false);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const checkFavoriteStatus = React.useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsFavorited(false);
      return;
    }

    try {
      const response = await fetch(
        "http://37.187.225.41:3002/api/v1/products/like",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          credentials: "omit",
        }
      );
      const data = await response.json();

      if (data.message === "Produit non trouvé.") {
        setIsFavorited(false);
        return;
      }

      if (Array.isArray(data)) {
        const isLiked = data.some(
          (favorite) => favorite.productId === String(id)
        );
        setIsFavorited(isLiked);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
      setIsFavorited(false);
    }
  }, [id]);

  React.useEffect(() => {
    checkFavoriteStatus();
  }, [checkFavoriteStatus]);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const handleAddToCart = () => {
    if (status === "Rupture de stock") {
      showSnackbar("Ce produit est en rupture de stock", "error");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (isInCart) {
      const newCart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(newCart));
      setIsInCart(false);
      showSnackbar("Produit retiré du panier", "success");
    } else {
      const newCart = [
        ...cart,
        {
          id,
          name,
          price,
          quantity: 1,
        },
      ];
      localStorage.setItem("cart", JSON.stringify(newCart));
      setIsInCart(true);
      showSnackbar("Produit ajouté au panier", "success");
    }
  };

  const handleToggleFavorite = async (event) => {
    event.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("Veuillez vous connecter pour ajouter aux favoris", "error");
      return;
    }

    try {
      const endpoint = isFavorited ? "unlike" : "like";

      const response = await fetch(
        `http://37.187.225.41:3002/api/v1/products/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            productId: id,
          }),
          credentials: "omit",
        }
      );

      const data = await response.json();

      if (data.message === "Produit ajouté aux favoris avec succès") {
        setIsFavorited(true);
        showSnackbar("Produit ajouté aux favoris", "success");
      } else if (data.message === "Produit retiré des favoris avec succès") {
        setIsFavorited(false);
        showSnackbar("Produit retiré des favoris", "success");
      } else if (
        data.message ===
        "Vous ne pouvez pas liker plusieurs fois le même article."
      ) {
        setIsFavorited(true);
        showSnackbar("Ce produit est déjà dans vos favoris", "info");
      } else {
        throw new Error(data.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      showSnackbar(
        error.message || "Erreur lors de la mise à jour des favoris",
        "error"
      );
    }
  };

  const handleCardClick = (event) => {
    if (!event.target.closest(".overlay")) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: 250,
        height: 450,
        display: "flex",
        flexDirection: "column",
        padding: 2,
        gap: 1,
        bgcolor: "#F4F5F7",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "rgba(0, 0, 0, 0.1)",
          "& .overlay": {
            display: "flex",
          },
        },
      }}
    >
      {promotion && (
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            bgcolor: "#E97171",
            borderRadius: 25,
            color: "white",
            padding: 1,
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 2,
          }}
        >
          {promotion}
        </Box>
      )}

      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "250px",
          backgroundColor: "#fff",
        }}
      >
        {image && image.endsWith(".mp4") ? (
          <video
            autoPlay
            loop
            muted
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: 5,
              padding: "10px",
            }}
          >
            <source src={image} type="video/mp4" />
          </video>
        ) : (
          <img
            src={image || "https://via.placeholder.com/250"}
            loading="lazy"
            alt={name || "Produit"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: 5,
              padding: "10px",
            }}
          />
        )}
      </Box>
      <Typography
        level="h6"
        sx={{
          fontWeight: "bold",
          fontSize: "19px",
          mb: 2,
          mt: 1.5,
          height: "48px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
          whiteSpace: "normal",
          lineHeight: "24px",
          textAlign: "left",
        }}
        gutterBottom
      >
        {name}
      </Typography>
      <Typography
        level="body-sm"
        sx={{
          bgcolor: status === "En stock" ? "#2EC1AC" : "#E97171",
          color: "white",
          width: "fit-content",
          px: 1.5,
          py: 0.1,
          borderRadius: 2.5,
          textAlign: "center",
          mb: 1,
        }}
      >
        {status}
      </Typography>

      <Box
        sx={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "black", fontSize: "20px" }}
        >
          {price}
        </Typography>
        {reduction && (
          <Typography
            sx={{
              textDecoration: "line-through",
              color: "text.secondary",
              fontSize: "14px",
            }}
          >
            {reduction}
          </Typography>
        )}
      </Box>
      <Box
        className="overlay"
        sx={{
          display: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(5px)",
          color: "white",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        <IconButton
          onClick={handleAddToCart}
          sx={{
            color: "white",
            backgroundColor: isInCart
              ? "rgba(46, 193, 172, 0.7)"
              : "rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            padding: 2,
            marginBottom: 2,
            "&:hover": {
              backgroundColor: isInCart
                ? "rgba(46, 193, 172, 0.9)"
                : "rgba(255, 255, 255, 0.5)",
            },
          }}
        >
          <ShoppingCartIcon />
        </IconButton>
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            color: "white",
            backgroundColor: isFavorited
              ? "rgba(233, 113, 113, 0.7)"
              : "rgba(255, 255, 255, 0.3)",
            borderRadius: "50%",
            padding: 2,
            "&:hover": {
              backgroundColor: isFavorited
                ? "rgba(233, 113, 113, 0.9)"
                : "rgba(255, 255, 255, 0.5)",
            },
          }}
        >
          <FavoriteIcon color={isFavorited ? "error" : "inherit"} />
        </IconButton>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default CardProduct;
