const express = require("express");
const router = express.Router();
const pagoController = require("../controllers/pagoController");
const { verificarToken, verificarRol } = require("../middlewares/authMiddleware");

router.get("/", verificarToken, pagoController.obtenerPagos);
router.post("/", verificarToken, verificarRol(["administrativo", "dueño"]), pagoController.crearPago);
router.post("/adelanto", verificarToken, verificarRol(["administrativo", "dueño"]), pagoController.registrarAdelanto);
router.put("/:id", verificarToken, verificarRol(["administrativo", "dueño"]), pagoController.actualizarPago);
router.delete("/:id", verificarToken, verificarRol(["administrativo", "dueño"]), pagoController.eliminarPago);
router.post('/crear', pagoController.crearPago);
router.post("/generar-pago", verificarToken, pagoController.generarPago);
router.get("/success", pagoController.success);
router.get("/failure", pagoController.failure);
router.get("/pending", pagoController.pending);

module.exports = router;