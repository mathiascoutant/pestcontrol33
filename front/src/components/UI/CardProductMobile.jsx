import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IconButton, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTranslation } from "react-i18next";

function CardProduct({ promotion, name, status, price, reduction, id, image }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  return (
    <Card
      sx={{
        width: 300,
        height: 180,
        display: "flex",
        flexDirection: "row",
        gap: 2,
        bgcolor: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
        },
        mx: "auto",
        my: 1.5,
      }}
    >
      {promotion && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            bgcolor: "#E97171",
            borderRadius: "4px",
            color: "white",
            padding: "4px 8px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {promotion}
        </Box>
      )}

      <Box
        sx={{
          position: "relative",
          width: "40%",
          height: "100%",
          backgroundColor: "#f8f8f8",
          overflow: "hidden",
          borderRight: "1px solid #f0f0f0",
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
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Typography
          level="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "16px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textAlign: "left",
            textTransform: "capitalize",
            color: "#333",
            lineHeight: 1.2,
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
            py: 0.5,
            borderRadius: 1,
            textAlign: "center",
            fontSize: "11px",
            fontWeight: "500",
            letterSpacing: "0.2px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {status === "En stock"
            ? t("CardProductMobile.inStock")
            : t("CardProductMobile.outOfStock")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: reduction ? "#E97171" : "#333",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {reduction || price}
            </Typography>
            {reduction && (
              <Typography
                sx={{
                  textDecoration: "line-through",
                  color: "#999",
                  fontSize: "14px",
                  marginTop: "-4px",
                }}
              >
                {price}
              </Typography>
            )}
          </Box>

          <IconButton
            size="small"
            onClick={() => navigate(`/product/${id}`)}
            sx={{
              bgcolor: "#f8f8f8",
              borderRadius: "50%",
              padding: 0.75,
              "&:hover": {
                bgcolor: "#e0e0e0",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
              zIndex: 5,
            }}
          >
            <ArrowForwardIcon fontSize="small" />
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
