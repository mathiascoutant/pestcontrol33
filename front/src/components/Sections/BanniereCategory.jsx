import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Avatar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";

const CircularAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  cursor: "pointer",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
  },
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
  },
  [theme.breakpoints.down("md")]: {
    width: 80,
    height: 80,
  },
}));

const CategoryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0.5),
  },
}));

function BanniereCategory() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fonction pour obtenir la clé de traduction standardisée
  const getCategoryTranslationKey = (categoryName) => {
    // Convertir le nom de la catégorie en minuscules et sans accents
    const normalizedName = categoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Mapper les noms de catégories aux clés de traduction
    const categoryMap = {
      fourmis: "ant",
      guepe: "wasp",
      taupe: "mole",
      termite: "termite",
      rat: "rat",
      souris: "mouse",
      cafard: "cockroach",
    };

    return categoryMap[normalizedName] || normalizedName;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://pestcontrol33.com/api/v1/subCategories"
        );
        setCategories(response.data.subCategories);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
          centerMode: false,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        mt: { xs: 8, sm: 10, md: 10 },
        px: { xs: 1, sm: 2 },
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Slider {...settings}>
        {categories.map((category) => (
          <Box key={category.id} sx={{ px: 1 }}>
            <CategoryItem onClick={() => handleCategoryClick(category.id)}>
              <CircularAvatar
                src={category.picture}
                alt={t(
                  `categories.${getCategoryTranslationKey(category.name)}`
                )}
                sx={{
                  bgcolor: "grey.300",
                  width: { xs: 60, sm: 70, md: 80 },
                  height: { xs: 60, sm: 70, md: 80 },
                }}
              />
              <Typography
                variant="subtitle1"
                align="center"
                sx={{
                  fontWeight: 500,
                  mt: 0.5,
                  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                }}
              >
                {t(`categories.${getCategoryTranslationKey(category.name)}`)}
              </Typography>
            </CategoryItem>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default BanniereCategory;
