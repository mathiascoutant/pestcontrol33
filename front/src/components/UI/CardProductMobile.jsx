import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

function CardProduct({ promotion, name, status, price, reduction, id, image }) {
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const handleCardClick = (event) => {
    if (!event.target.closest(".overlay")) {
      navigate(`/product/${id}`);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: 300, // Ajuster la largeur de la carte
        height: 350, // Ajuster la hauteur de la carte
        display: "flex",
        flexDirection: "row",
        gap: 2,
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
          width: "150px", // Ajuster la taille de l'image
          height: "100%",
          backgroundColor: "#fff",
          overflow: "hidden",
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
              objectFit: "cover",
            }}
          >
            <source src={image} type="video/mp4" />
          </video>
        ) : (
          <img
            src={image || "https://via.placeholder.com/120"}
            loading="lazy"
            alt={name || "Produit"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingLeft: 2,
        }}
      >
        <Typography
          level="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "left",
            textTransform: "capitalize",
            mt: 2,
          }}
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
            fontSize: "10px",
          }}
        >
          {status}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "flex-start",
            marginTop: "auto",
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
            sx={{
              mt: 2,
              color: "white",
              height: "55px",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
              padding: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            <Link to={`/product/${id}`}>
              <ArrowForwardIcon sx={{ color: "white" }} />
            </Link>
          </IconButton>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
