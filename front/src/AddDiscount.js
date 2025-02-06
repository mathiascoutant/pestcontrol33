import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Modal,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fondImage from "./Assets/fond.png";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function AddDiscount() {
  const [discountCodes, setDiscountCodes] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openModal, setOpenModal] = useState(false);
  const [currentCode, setCurrentCode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDiscountCodes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://pestcontrol33.com/api/v1/discountShopping",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDiscountCodes(data.discountCodes || []);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchDiscountCodes();
  }, []);

  const handleOpenEditModal = (code) => {
    setCurrentCode(code);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentCode(null);
  };

  const handleOpenCreateModal = () => {
    setCurrentCode({
      code: "",
      discount: "",
      startDate: "",
      endDate: "",
      status: "",
    });
    setIsEditing(false);
    setOpenModal(true);
  };

  const handleUpdateCode = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage(
          "Vous devez être connecté pour modifier un code promo."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // Vérification des champs requis
      if (
        !currentCode.id ||
        !currentCode.code ||
        !currentCode.discount ||
        !currentCode.startDate ||
        !currentCode.endDate
      ) {
        setSnackbarMessage("Tous les champs sont obligatoires.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const body = {
        id: currentCode.id,
        code: currentCode.code,
        discount: currentCode.discount,
        startDate: currentCode.startDate,
        endDate: currentCode.endDate,
        fonction: currentCode.fonction, // Ajoutez d'autres champs si nécessaire
        multiUsage: currentCode.multiUsage,
        nbrAutorisationUsage: currentCode.nbrAutorisationUsage,
      };

      const response = await fetch(
        `https://pestcontrol33.com/api/v1/discountShopping`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erreur ${response.status}: ${
            errorData.message || response.statusText
          }`
        );
      }

      const updatedCode = await response.json();

      setDiscountCodes(
        discountCodes.map((code) =>
          code.id === updatedCode.discountCode.id
            ? updatedCode.discountCode
            : code
        )
      );
      setSnackbarMessage("Code promo mis à jour avec succès !");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseModal();
    } catch (error) {
      setSnackbarMessage("Erreur lors de la mise à jour : " + error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage(
          "Vous devez être connecté pour supprimer un code promo."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(
        `https://pestcontrol33.com/api/v1/discountShopping/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      setDiscountCodes(discountCodes.filter((code) => code.id !== id));
      setSnackbarMessage("Code promo supprimé avec succès !");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Erreur lors de la suppression : " + error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ mt: 8 }}>
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
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#000",
            mb: 2,
            fontWeight: "bold",
          }}
        >
          Mes code promo
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link
              to="/dashboard"
              style={{ textDecoration: "none", color: "#000" }}
            >
              Dashboard
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>Mes code promo</Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        onClick={handleOpenCreateModal}
        sx={{ mb: 2 }}
      >
        Créer un code
      </Button>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "95%", mt: 2, ml: 4.5 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Code
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Discount
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Date de création
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Date de fin
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Statut
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(discountCodes) &&
              discountCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell align="center">{code.code}</TableCell>
                  <TableCell align="center">
                    {code.discount} {code.fonction}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(code.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(code.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">{code.status}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenEditModal(code)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(code.id)}>
                      <DeleteIcon sx={{ color: "#B88E2F" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {isEditing ? "Modifier le Code Promo" : "Créer un Code Promo"}
          </Typography>
          {currentCode && (
            <>
              <TextField
                label="Code"
                value={currentCode.code || ""}
                onChange={(e) =>
                  setCurrentCode({ ...currentCode, code: e.target.value })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Réduction (%)"
                type="number"
                value={currentCode.discount || ""}
                onChange={(e) =>
                  setCurrentCode({
                    ...currentCode,
                    discount: Number(e.target.value),
                  })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Fonction"
                select
                value={currentCode.fonction || ""}
                onChange={(e) =>
                  setCurrentCode({ ...currentCode, fonction: e.target.value })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="%">%</MenuItem>
                <MenuItem value="€">€</MenuItem>
              </TextField>
              <TextField
                label="Date de début"
                type="datetime-local"
                value={currentCode.startDate || ""}
                onChange={(e) =>
                  setCurrentCode({ ...currentCode, startDate: e.target.value })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Date de fin"
                type="datetime-local"
                value={currentCode.endDate || ""}
                onChange={(e) =>
                  setCurrentCode({ ...currentCode, endDate: e.target.value })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Statut"
                select
                value={currentCode.status || ""}
                onChange={(e) =>
                  setCurrentCode({ ...currentCode, status: e.target.value })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="Actif">Actif</MenuItem>
                <MenuItem value="Expiré">Expiré</MenuItem>
              </TextField>
              <TextField
                label="Nombre d'utilisations autorisées"
                type="number"
                value={currentCode.nbrAutorisationUsage || ""}
                onChange={(e) =>
                  setCurrentCode({
                    ...currentCode,
                    nbrAutorisationUsage: Number(e.target.value),
                  })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Button
                onClick={handleUpdateCode}
                variant="contained"
                sx={{ mt: 2 }}
              >
                Enregistrer
              </Button>
            </>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddDiscount;
