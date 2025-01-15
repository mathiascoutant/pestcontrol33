import { Box, Typography, Grid, Card, Container } from "@mui/material";
import React from "react";
import fondImage from "./Assets/fond.png";

function About() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Section d'introduction */}
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
          mb: 5,
          mt: 8,
          color: "black",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "2rem" }}>
          Qui sommes-nous ?
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 2, maxWidth: "600px", mx: "auto" }}
        >
          Experts en solutions de lutte contre les nuisibles, nous vous aidons à
          protéger vos espaces tout en respectant l’environnement.
        </Typography>
      </Box>

      {/* Mission, Vision, Valeurs */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                Notre Mission
              </Typography>
              <Typography sx={{ mt: 2, color: "black" }}>
                Proposer des produits efficaces et sûrs pour protéger vos
                maisons et jardins contre les nuisibles.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                Notre Vision
              </Typography>
              <Typography sx={{ mt: 2, color: "black" }}>
                Devenir la référence en matière de solutions anti-nuisibles
                respectueuses de l’environnement.
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                p: 3,
                textAlign: "center",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "black" }}
              >
                Nos Valeurs
              </Typography>
              <Typography sx={{ mt: 2, color: "black" }}>
                Innovation, durabilité et satisfaction client sont au cœur de
                notre démarche.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Section Équipe */}
      <Box
        sx={{
          py: 8,
          mt: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#333",
              mb: 4,
            }}
          >
            Notre Équipe
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#555",
              maxWidth: "800px",
              mx: "auto",
              mb: 6,
            }}
          >
            Une équipe passionnée et expérimentée, dédiée à vous offrir des
            solutions de qualité et un service irréprochable.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  Marc Dupont
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "black" }}>
                  Responsable des produits
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  Anne Leclerc
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "black" }}>
                  Experte en solutions durables
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  Lucas Martin
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "black" }}>
                  Responsable service client
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section Contact */}
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "black", mb: 2 }}
        >
          Une question ? Contactez-nous !
        </Typography>
        <Typography sx={{ mt: 2, color: "black", textAlign: "center" }}>
          Nous sommes disponibles pour répondre à toutes vos questions.
          Écrivez-nous à{" "}
          <a
            href="mailto:pestcontrol33@gmail.com"
            style={{ color: "#ba9b73", textDecoration: "none" }}
          >
            pestcontrol33@gmail.com
          </a>
        </Typography>
      </Box>
    </Box>
  );
}

export default About;
