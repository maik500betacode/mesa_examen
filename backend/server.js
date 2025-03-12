require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importar rutas
const usuarioRoutes = require("./routes/usuarioRoutes");
const localRoutes = require("./routes/localRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("🔥 Conectado a MongoDB Atlas"))
  .catch(err => console.error("Error de conexión a MongoDB:", err));

// Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/alquileres", require("./routes/alquilerRoutes"));
app.use("/api/pagos", require("./routes/pagoRoutes"));
app.use("/api/novedades", require("./routes/novedadRoutes"));
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/locales", localRoutes); // Eliminada la duplicación

// Ruta inicial
app.get("/", (req, res) => {
  res.send("Bienvenido al backend del sistema de alquileres.");
});

// Manejo de errores global (opcional)
app.use((err, req, res, next) => {
  console.error("Error en el servidor:", err.stack);
  res.status(500).json({ error: "Algo salió mal en el servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});