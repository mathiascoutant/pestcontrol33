import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import CustomButton from "./components/UI/CustomButton";

function Home() {
  return (
    <Box>
      <Typography variant="h4" sx={{ textAlign: "center", mt: 5 }} gutterBottom>
        Bienvenue sur Pestcontroll33
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Button>
          <Link style={{ textDecoration: "none", color: "black" }} to="/about">
            A propos
          </Link>
        </Button>
        <Button>
          <Link style={{ textDecoration: "none", color: "black" }} to="/shop">
            Les produits
          </Link>
        </Button>
        <Button>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/product"
          >
            Page produit
          </Link>
        </Button>
        <Button>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/contact"
          >
            Contact
          </Link>
        </Button>
        <Button>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/shopping"
          >
            Panier
          </Link>
        </Button>
        <Button>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/register"
          >
            S'inscrire
          </Link>
        </Button>
        <Button>
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to="/connexion"
          >
            Connexion
          </Link>
        </Button>
      </Box>
      <Box>
        <CustomButton
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => alert("Bouton cliqué !")}
        >
          Hello
        </CustomButton>
      </Box>
    </Box>
  );
}

export default Home;
