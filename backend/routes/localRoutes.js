const express = require("express");
const router = express.Router();
const localController = require("../controllers/localController");

router.get("/", localController.obtenerLocales);
router.post("/", localController.crearLocal);
router.put("/:id", localController.actualizarLocal);
router.delete("/:id", localController.eliminarLocal);

module.exports = router;
