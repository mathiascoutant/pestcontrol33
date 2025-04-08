import React from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

const UnderConstructionBanner = () => {
  const [open, setOpen] = React.useState(true);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!open) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#FFF9E6",
        py: isMobile ? 1 : 1.5,
        px: isMobile ? 1 : 2,
        position: "relative",
        borderBottom: "1px solid #FFE0B2",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          maxWidth: "800px",
          width: "100%",
          justifyContent: "center",
          flexDirection: isMobile ? "column" : "row",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <ConstructionIcon
          sx={{
            color: "#FF9800",
            mr: isMobile ? 0 : 1.5,
            mb: isMobile ? 0.5 : 0,
            fontSize: isMobile ? "1.2rem" : "1.5rem",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#795548",
              fontWeight: 500,
              textAlign: isMobile ? "center" : "left",
              fontSize: { xs: "0.85rem", sm: "1rem" },
            }}
          >
            {t(
              "banner.underConstruction",
              "Notre site est en cours d'amélioration"
            )}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: "#795548",
              fontWeight: 400,
              ml: isMobile ? 0 : 0.5,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              mt: isMobile ? 0.5 : 0,
            }}
          >
            {t(
              "banner.paymentNotWorking",
              "• La fonctionnalité de paiement sera bientôt disponible"
            )}
          </Typography>
        </Box>
      </Box>
      <IconButton
        size="small"
        onClick={() => setOpen(false)}
        sx={{
          position: "absolute",
          right: isMobile ? 4 : 8,
          top: isMobile ? 4 : "auto",
          color: "#9E9E9E",
          "&:hover": {
            color: "#616161",
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default UnderConstructionBanner;
