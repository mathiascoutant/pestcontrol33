import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Avatar, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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

  return (
    <Box
      sx={{
        mt: { xs: 8, sm: 10, md: 10 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Grid container spacing={{ xs: 1, sm: 2 }} justifyContent="center">
        {categories.map((category) => (
          <Grid item key={category.id} xs={4} sm={4} md={3} lg={2}>
            <CategoryItem onClick={() => handleCategoryClick(category.id)}>
              <CircularAvatar
                src={category.picture}
                alt={category.name}
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
                {category.name}
              </Typography>
            </CategoryItem>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default BanniereCategory;
