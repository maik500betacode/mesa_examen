const mongoose = require("mongoose");

const NovedadSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    texto: { type: String, required: true },
    estado: { type: String, enum: ["Pendiente", "Procesado"], default: "Pendiente" }
}, { timestamps: true });

module.exports = mongoose.model("Novedad", NovedadSchema);
