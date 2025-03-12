const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    usuario: { type: String, required: true },
    password: { type: String, required: true },
    activo: { type: Boolean, default: true },
    perfil: { type: String, enum: ["administrativo", "propietario", "dueño"], required: true }
});

// Middleware para encriptar la contraseña antes de guardarla
UsuarioSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("Usuario", UsuarioSchema);
