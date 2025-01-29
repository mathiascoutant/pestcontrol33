import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Card, CardContent, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarIcon from "@mui/icons-material/Star";

const LatestComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/comment/latest`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };

    fetchComments();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <Box sx={{ mx: 4, mb: 10, mt: 10 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 5,
          textAlign: "center",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "1.7rem" },
        }}
      >
        Nos derniers avis
      </Typography>

      <Slider {...settings}>
        {comments.length > 0
          ? comments.map((review) => (
              <Box
                key={review.id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: { xs: 190, sm: 280, md: 310 },
                    boxShadow: 3,
                    borderRadius: 2,
                    mx: 2,
                    mb: 2,
                    bgcolor: "#FFFFFF",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarIcon
                          key={index}
                          sx={{
                            color:
                              index < review.notation ? "#FFC700" : "#E0E0E0",
                          }}
                        />
                      ))}
                      <Typography variant="body2" sx={{ ml: 1, color: "#777" }}>
                        {review.notation} / 5
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold", mb: 0.5 }}
                    >
                      {review.user.pseudo}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, color: "#555" }}>
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      Créé le: {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))
          : null}
      </Slider>
      {comments.length === 0 && (
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Aucun avis disponible pour le moment.
        </Typography>
      )}
    </Box>
  );
};

export default LatestComments;
