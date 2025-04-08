import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("preferredLanguage", language);
    handleClose();
  };

  // Style pour les drapeaux
  const flagStyle = {
    width: isMobile ? "24px" : "20px",
    height: isMobile ? "18px" : "15px",
    objectFit: "cover",
    borderRadius: "2px",
  };

  const languages = [
    { code: "fr", flag: "/flags/fr.png", alt: "Français" },
    { code: "en", flag: "/flags/en.png", alt: "English" },
    { code: "es", flag: "/flags/es.png", alt: "Español" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "4px",
        padding: "1px",
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          padding: isMobile ? 1 : 0.5,
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <img
          src={`/flags/${i18n.language}.png`}
          alt={i18n.language}
          style={flagStyle}
          onError={(e) => {
            console.error("Erreur de chargement du drapeau:", e.target.src);
            e.target.style.display = "none";
          }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: isMobile ? "50px" : "50px",
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 1,
              px: 2,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <img
              src={lang.flag}
              alt={lang.alt}
              style={flagStyle}
              onError={(e) => {
                console.error("Erreur de chargement du drapeau:", e.target.src);
                e.target.style.display = "none";
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSelector;
