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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${fondImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 8,
          color: "white",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: "3rem",
            color: "white",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            mb: 2,
          }}
        >
          Qui sommes-nous ?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            maxWidth: "600px",
            color: "white",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          Découvrez notre engagement pour un avenir durable et innovant
        </Typography>
      </Box>
      <Box sx={{ my: 8, textAlign: "center", px: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            position: "relative",
            display: "inline-block",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60px",
              height: "3px",
              backgroundColor: "#72cc77",
            },
          }}
        >
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
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              borderRadius: 4,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
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
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              borderRadius: 4,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
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
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              borderRadius: 4,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
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
