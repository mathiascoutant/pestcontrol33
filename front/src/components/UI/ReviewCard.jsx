import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";

const ReviewCard = ({ review }) => {
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        mb: 2,
        mt: 2,
        width: 250,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        padding: 2,
        bgcolor: "#FFFFFF",
        boxShadow: 3,
        borderRadius: 2,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {t("reviewCard.pseudo", { defaultValue: "Pseudo" })}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: "#555" }}>
          {t("reviewCard.comment", { defaultValue: "Commentaire" })}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              sx={{ color: index < review.notation ? "#FFC700" : "#E0E0E0" }}
            />
          ))}
          <Typography variant="body2" sx={{ ml: 1, color: "#777" }}>
            {t("reviewCard.notation", { defaultValue: "Notation" })} / 5
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "#999" }}>
          {t("reviewCard.createdAt", { defaultValue: "Créé le" })}{" "}
          {new Date(review.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
