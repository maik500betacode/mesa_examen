const mongoose = require("mongoose");

const AlquilerSchema = new mongoose.Schema({
    propietario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    local: { type: mongoose.Schema.Types.ObjectId, ref: "Local", required: true },
    plazomes: { type: Number, required: true },
    costoalquiler: { type: Number, required: true },
    fechaAlquiler: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Alquiler", AlquilerSchema);
