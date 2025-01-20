import React from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import fondImage from "./Assets/fond.png";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";

function About() {
  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `url(${fondImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 8,
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", fontSize: "2rem", color: "black" }}
        >
          Qui sommes-nous ?
        </Typography>
      </Box>
      <Box sx={{ my: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          À Propos de Nous
        </Typography>
        <Typography variant="body1" sx={{ color: "gray", mb: 4 }}>
          Nous sommes une entreprise dédiée à fournir des solutions innovantes
          et durables pour améliorer votre qualité de vie.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <Card
            sx={{
              maxWidth: 300,
              m: 2,
              boxShadow: 3,
              borderRadius: 2,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <VisibilityOutlinedIcon
                sx={{ fontSize: 40, color: "#72cc77", my: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Notre Vision
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Créer un avenir où chaque espace est respectueux de
                l'environnement.
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              maxWidth: 300,
              m: 2,
              boxShadow: 3,
              borderRadius: 2,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <AssignmentOutlinedIcon
                sx={{ fontSize: 40, color: "#89b8f8", my: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Notre Mission
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Offrir des solutions efficaces et durables pour tous.
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              maxWidth: 300,
              m: 2,
              boxShadow: 3,
              borderRadius: 2,
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardContent>
              <StarBorderPurple500OutlinedIcon
                sx={{ fontSize: 40, color: "#f3f56f", mb: 1 }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Nos Valeurs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intégrité, Innovation, et Engagement envers nos clients.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default About;
