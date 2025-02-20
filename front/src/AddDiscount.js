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
  Card,
  CardContent,
  Grid,
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
  const [currentCode, setCurrentCode] = useState({
    code: "",
    discount: "",
    startDate: "",
    endDate: "",
    status: "Actif",
    fonction: "%",
    multiUsage: false,
    nbrAutorisationUsage: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    upcoming: 0,
  });

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
        setStats(
          data.stats || { total: 0, active: 0, expired: 0, upcoming: 0 }
        );
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
    setCurrentCode({
      code: "",
      discount: "",
      startDate: "",
      endDate: "",
      status: "Actif",
      fonction: "%",
      multiUsage: false,
      nbrAutorisationUsage: "",
    });
  };

  const handleOpenCreateModal = () => {
    setCurrentCode({
      code: "",
      discount: "",
      startDate: "",
      endDate: "",
      status: "Actif",
      fonction: "%",
      multiUsage: false,
      nbrAutorisationUsage: "",
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

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "Actif":
        return "#4CAF50";
      case "Expiré":
        return "#F44336";
      case "À venir":
        return "#2196F3";
      default:
        return "#757575";
    }
  };

  const handleCreateCode = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage(
          "Vous devez être connecté pour créer un code promo."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // Vérification des champs requis
      if (
        !currentCode.code ||
        !currentCode.discount ||
        !currentCode.startDate ||
        !currentCode.endDate ||
        !currentCode.fonction ||
        !currentCode.nbrAutorisationUsage
      ) {
        setSnackbarMessage("Tous les champs sont obligatoires.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      const body = {
        code: currentCode.code,
        discount: Number(currentCode.discount),
        startDate: currentCode.startDate,
        endDate: currentCode.endDate,
        fonction: currentCode.fonction,
        multiUsage: Boolean(currentCode.multiUsage),
        nbrAutorisationUsage: Number(currentCode.nbrAutorisationUsage),
      };

      const response = await fetch(
        "https://pestcontrol33.com/api/v1/discountShopping/add",
        {
          method: "POST",
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

      const data = await response.json();
      setDiscountCodes([...discountCodes, data.discountCode]);
      setSnackbarMessage("Code promo créé avec succès !");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      handleCloseModal();
    } catch (error) {
      setSnackbarMessage("Erreur lors de la création : " + error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ mt: { xs: 4, sm: 8 } }}>
      <Box
        sx={{
          backgroundImage: `url(${fondImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "200px", sm: "300px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: { xs: 3, sm: 5 },
          mt: { xs: 4, sm: 8 },
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#000",
            mb: 2,
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            textAlign: "center",
          }}
        >
          Mes codes promo
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
      <Box sx={{ px: { xs: 2, sm: 4 }, mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: "100%", bgcolor: "#f5f5f5" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Total
                </Typography>
                <Typography variant="h4">{stats.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: "100%", bgcolor: "#e8f5e9" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Actifs
                </Typography>
                <Typography variant="h4" sx={{ color: "#4CAF50" }}>
                  {stats.active}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: "100%", bgcolor: "#ffebee" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Expirés
                </Typography>
                <Typography variant="h4" sx={{ color: "#F44336" }}>
                  {stats.expired}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ height: "100%", bgcolor: "#e3f2fd" }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  À venir
                </Typography>
                <Typography variant="h4" sx={{ color: "#2196F3" }}>
                  {stats.upcoming}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleOpenCreateModal}
          sx={{ mb: 2, width: { xs: "100%", sm: "auto" } }}
        >
          Créer un code
        </Button>

        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            overflowX: "auto",
            mt: 2,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
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
                    <TableCell
                      align="center"
                      sx={{
                        display: { xs: "none", sm: "table-cell" },
                      }}
                    >
                      {code.code}
                    </TableCell>
                    <Box
                      sx={{
                        display: { xs: "flex", sm: "none" },
                        flexDirection: "column",
                        p: 2,
                        gap: 1,
                        borderLeft: 3,
                        borderColor: getStatusColor(code.status),
                      }}
                    >
                      <Typography>
                        <strong>Code:</strong> {code.code}
                      </Typography>
                      <Typography>
                        <strong>Réduction:</strong> {code.discount}
                        {code.fonction}
                      </Typography>
                      <Typography>
                        <strong>Utilisations:</strong> {code.nbrUsed}/
                        {code.nbrAutorisationUsage}
                      </Typography>
                      <Typography>
                        <strong>Date début:</strong>{" "}
                        {new Date(code.startDate).toLocaleDateString()}
                      </Typography>
                      <Typography>
                        <strong>Date fin:</strong>{" "}
                        {new Date(code.endDate).toLocaleDateString()}
                      </Typography>
                      <Typography>
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            bgcolor: getStatusColor(code.status),
                            color: "white",
                            fontSize: "0.875rem",
                          }}
                        >
                          {code.status}
                        </Box>
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <IconButton onClick={() => handleOpenEditModal(code)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(code.id)}>
                          <DeleteIcon sx={{ color: "#B88E2F" }} />
                        </IconButton>
                      </Box>
                    </Box>
                    <TableCell align="center">
                      {code.discount}
                      {code.fonction}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(code.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(code.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: getStatusColor(code.status),
                          color: "white",
                          display: "inline-block",
                        }}
                      >
                        {code.status}
                      </Box>
                    </TableCell>
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
      </Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxHeight: { xs: "90vh", sm: "80vh" },
            overflow: "auto",
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
                <MenuItem value="À venir">À venir</MenuItem>
              </TextField>
              <TextField
                label="Multi-usage"
                select
                value={currentCode.multiUsage || false}
                onChange={(e) =>
                  setCurrentCode({ ...currentCode, multiUsage: e.target.value })
                }
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value={true}>Oui</MenuItem>
                <MenuItem value={false}>Non</MenuItem>
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
                onClick={isEditing ? handleUpdateCode : handleCreateCode}
                variant="contained"
                sx={{ mt: 2 }}
              >
                {isEditing ? "Modifier" : "Créer"}
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
