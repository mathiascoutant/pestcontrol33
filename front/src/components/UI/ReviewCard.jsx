import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const ReviewCard = ({ review }) => {
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
          {review.user.pseudo}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: "#555" }}>
          {review.comment}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          {Array.from({ length: 5 }, (_, index) => (
            <StarIcon
              key={index}
              sx={{ color: index < review.notation ? "#FFC700" : "#E0E0E0" }}
            />
          ))}
          <Typography variant="body2" sx={{ ml: 1, color: "#777" }}>
            {review.notation} / 5
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "#999" }}>
          Créé le: {new Date(review.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
