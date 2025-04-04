import React from "react";
import { useTranslation } from "react-i18next";
import { Box, MenuItem, Select, FormControl } from "@mui/material";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (event) => {
    const language = event.target.value;
    i18n.changeLanguage(language);

    // Optionally save the selected language in localStorage
    localStorage.setItem("preferredLanguage", language);
  };

  // Styles pour le select
  const selectStyles = {
    height: "32px",
    minWidth: "110px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.1)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#B6DEDD",
    },
  };

  // Style pour les éléments du menu
  const menuItemStyles = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
  };

  // Style pour les drapeaux
  const flagStyle = {
    width: "20px",
    height: "15px",
    objectFit: "cover",
    borderRadius: "2px",
    marginRight: "5px",
  };

  return (
    <Box>
      <FormControl fullWidth size="small">
        <Select
          value={i18n.language}
          onChange={changeLanguage}
          sx={selectStyles}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={`/flags/${selected}.png`}
                alt={selected}
                style={flagStyle}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {t(`language.${selected}`)}
            </Box>
          )}
        >
          <MenuItem value="fr" sx={menuItemStyles}>
            <img
              src="/flags/fr.png"
              alt="Français"
              style={flagStyle}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {t("language.fr")}
          </MenuItem>
          <MenuItem value="en" sx={menuItemStyles}>
            <img
              src="/flags/en.png"
              alt="English"
              style={flagStyle}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {t("language.en")}
          </MenuItem>
          <MenuItem value="es" sx={menuItemStyles}>
            <img
              src="/flags/es.png"
              alt="Español"
              style={flagStyle}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {t("language.es")}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
