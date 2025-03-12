const mongoose = require("mongoose");

const PagoSchema = new mongoose.Schema({
  alquiler: { type: mongoose.Schema.Types.ObjectId, ref: "Alquiler", required: true, index: true },
  propietario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", index: true },
  montoTotal: { type: Number, required: true, min: [0, "El monto total debe ser positivo"] },
  montoPagado: { type: Number, default: 0, min: [0, "El monto pagado no puede ser negativo"] },
  estado: { type: String, enum: ["pendiente", "parcial", "completo"], default: "pendiente" },
  metodoPago: { type: String, enum: ["Efectivo", "Transferencia", "Tarjeta", "MercadoPago"], required: true },
  linkPago: { type: String },
  preferenceId: { type: String }, // Para vincular con Mercado Pago
  adelantos: [
    {
      monto: { type: Number, required: true, min: [0, "El adelanto debe ser positivo"] },
      fecha: { type: Date, default: Date.now }
    }
  ],
  fechaCreacion: { type: Date, default: Date.now }
});

PagoSchema.methods.actualizarEstado = function () {
  if (this.montoPagado >= this.montoTotal) {
    this.estado = "completo";
  } else if (this.montoPagado > 0) {
    this.estado = "parcial";
  } else {
    this.estado = "pendiente";
  }
};

module.exports = mongoose.model("Pago", PagoSchema);