import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton, Snackbar, Alert } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";

function CardProduct({ promotion, name, status, price, reduction, id }) {
  const navigate = useNavigate();

  const [isInCart, setIsInCart] = React.useState(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    return cart.some((item) => item.id === id);
  });

  const [isFavorited, setIsFavorited] = React.useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.some((item) => item.id === id);
  });

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const handleAddToCart = () => {
    if (status === "Rupture de stock") {
      setSnackbarMessage("Ce produit est en rupture de stock");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (isInCart) {
      const newCart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(newCart));
      setIsInCart(false);
      setSnackbarMessage("Produit retiré du panier");
      setSnackbarSeverity("success");
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
      setSnackbarMessage("Produit ajouté au panier");
      setSnackbarSeverity("success");
    }
    setSnackbarOpen(true);
  };

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorited) {
      const newFavorites = favorites.filter((item) => item.id !== id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorited(false);
      setSnackbarMessage("Produit retiré des favoris");
    } else {
      const newFavorites = [
        ...favorites,
        {
          id,
          name,
          price,
        },
      ];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorited(true);
      setSnackbarMessage("Produit ajouté aux favoris");
    }
    setSnackbarOpen(true);
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
        height: "auto",
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
          paddingTop: "100%",
        }}
      >
        <img
          src="https://i.ebayimg.com/images/g/lnIAAOSwrudm12oS/s-l1600.webp"
          loading="lazy"
          alt="Termidor anti termite"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 5,
          }}
        />
      </Box>
      <Typography
        level="h6"
        gutterBottom
        sx={{ fontWeight: "bold", fontSize: "19px", mb: 2, mt: 1.5 }}
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
          mb: 3,
        }}
        gutterBottom
      >
        {status}
      </Typography>

      <Box
        sx={{
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
