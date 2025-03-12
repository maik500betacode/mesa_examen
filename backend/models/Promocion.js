const mongoose = require("mongoose");

const PromocionSchema = new mongoose.Schema({
    propietario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    imagen: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model("Promocion", PromocionSchema);
