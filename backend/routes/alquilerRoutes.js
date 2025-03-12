const express = require("express");
const router = express.Router();
const alquilerController = require("../controllers/alquilerController");
const { verificarToken, verificarRol } = require("../middlewares/authMiddleware");

router.get("/", verificarToken, alquilerController.obtenerAlquileres);
router.post("/", verificarToken, verificarRol(["administrativo", "dueño"]), alquilerController.crearAlquiler);
router.put("/:id", verificarToken, verificarRol(["administrativo", "dueño"]), alquilerController.actualizarAlquiler);
router.delete("/:id", verificarToken, verificarRol(["administrativo", "dueño"]), alquilerController.eliminarAlquiler);


module.exports = router;
