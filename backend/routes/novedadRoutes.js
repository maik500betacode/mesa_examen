const express = require("express");
const router = express.Router();
const novedadController = require("../controllers/novedadController");

router.get("/", novedadController.obtenerNovedades);
router.post("/", novedadController.crearNovedad);
router.put("/:id", novedadController.actualizarNovedad);
router.delete("/:id", novedadController.eliminarNovedad);

module.exports = router;
