const mongoose = require("mongoose");

const LocalSchema = new mongoose.Schema({
    superficie: { type: Number, required: true },
    habilitado: { type: Boolean, default: true },
    costomes: { type: Number, required: true },
    pathimagen: { type: String, required: false },
    alquilado: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Local", LocalSchema);
