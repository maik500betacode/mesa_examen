// controllers/pagoController.js
// controllers/pagoController.js
const Pago = require("../models/Pago");
const Alquiler = require("../models/Alquiler");
const { MercadoPagoConfig, Preference } = require("mercadopago");


// Configuración de Mercado Pago
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-7939043468077040-030813-8558da8cc54662b28ce9b3fa64f26173-2302895069' });
const preference = new Preference(client);

console.log("🔑 Access Token MP:", 'APP_USR-7939043468077040-030813-8558da8cc54662b28ce9b3fa64f26173-2302895069'.substring(0, 8) + "...");
const { User } = require("mercadopago");
const user = new User(client);
user.get()
  .then(data => console.log("✅ Información del usuario:", data))
  .catch(error => console.error("❌ Error al obtener usuario:", error));
/**
 * Obtener todos los pagos
 */
exports.obtenerPagos = async (req, res) => {
  try {
    const pagos = await Pago.find().populate("alquiler").populate("propietario");
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener pagos" });
  }
};

/**
 * Crear un nuevo pago vinculado a un Alquiler
 */
exports.crearPago = async (req, res) => {
  try {
    const { alquilerId, montoTotal, metodoPago } = req.body;

    const alquilerExistente = await Alquiler.findById(alquilerId);
    if (!alquilerExistente) {
      return res.status(404).json({ message: "Alquiler no encontrado" });
    }

    let linkPago;
    const nuevoPago = new Pago({ alquilerId, monto: montoTotal, metodoPago });

    if (metodoPago === "MercadoPago") {
      const preferenceData = {
        items: [
          {
            title: `Pago de alquiler - ${alquilerExistente._id}`,
            quantity: 1,
            currency_id: "ARS",
            unit_price: parseFloat(montoTotal),
          },
        ],
        payer: { email: "test_user_123456@testuser.com" },
        back_urls: {
          success: "https://e4a8-2803-9800-9506-86cd-50be-5cf1-ca-9b83.ngrok-free.app/api/pagos/success",
          failure: "https://e4a8-2803-9800-9506-86cd-50be-5cf1-ca-9b83.ngrok-free.app/api/pagos/failure",
          pending: "https://e4a8-2803-9800-9506-86cd-50be-5cf1-ca-9b83.ngrok-free.app/api/pagos/pending",
        },
        auto_return: "approved",
      };

      const response = await preference.create({ body: preferenceData });
      linkPago = response.body.init_point; // Usar init_point en lugar de sandbox_init_point
      nuevoPago.linkPago = linkPago;
      nuevoPago.preferenceId = response.body.id;
    }

    await nuevoPago.save();
    res.json({ linkPago });
  } catch (error) {
    console.error("Error en crearPago:", error);
    res.status(500).json({ message: "Error al crear el pago" });
  }
};

/**
 * Registrar un adelanto (pago parcial)
 */
exports.registrarAdelanto = async (req, res) => {
  try {
    const { pagoId, monto } = req.body;
    if (!monto || monto <= 0) return res.status(400).json({ error: "Monto inválido" });
    const pago = await Pago.findById(pagoId);
    if (!pago) return res.status(404).json({ error: "Pago no encontrado" });

    pago.adelantos.push({ monto });
    pago.montoPagado += monto;
    pago.actualizarEstado();
    await pago.save();

    res.json({ mensaje: "Adelanto registrado", pago });
  } catch (error) {
    console.error("Error al registrar adelanto:", error);
    res.status(500).json({ error: "Error al registrar adelanto" });
  }
};

/**
 * Actualizar un pago
 */
exports.actualizarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findById(id);
    if (!pago) return res.status(404).json({ error: "Pago no encontrado" });

    const { montoTotal, metodoPago, estado } = req.body;
    if (montoTotal !== undefined) pago.montoTotal = montoTotal;
    if (metodoPago !== undefined) pago.metodoPago = metodoPago;
    if (estado !== undefined) pago.estado = estado;
    pago.actualizarEstado();
    await pago.save();

    res.json(pago);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el pago" });
  }
};

/**
 * Eliminar un pago
 */
exports.eliminarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findById(id);
    if (!pago) return res.status(404).json({ error: "Pago no encontrado" });
    if (pago.estado === "completo") return res.status(400).json({ error: "No se puede eliminar un pago completado" });

    await Pago.findByIdAndDelete(id);
    res.json({ mensaje: "Pago eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el pago" });
  }
};

/**
 * Generar link de pago rápido sin BD
 */
exports.generarPago = async (req, res) => {
    try {
      const { descripcion, monto } = req.body;
  
      // Validaciones de entrada
      if (!descripcion || typeof descripcion !== "string" || descripcion.trim() === "") {
        return res.status(400).json({ message: "La descripción es obligatoria y debe ser una cadena válida" });
      }
      if (isNaN(monto) || parseFloat(monto) <= 0) {
        return res.status(400).json({ message: "El monto debe ser un número mayor a 0" });
      }
  
      // Datos de la preferencia
      const preferenceData = {
        items: [
          {
            title: descripcion,
            quantity: 1,
            currency_id: "ARS",
            unit_price: parseFloat(monto),
          },
        ],
        payer: { email: "test_user_123456@testuser.com" },
        back_urls: {
          success: "https://e4a8-2803-9800-9506-86cd-50be-5cf1-ca-9b83.ngrok-free.app/api/pagos/success",
          failure: "https://e4a8-2803-9800-9506-86cd-50be-5cf1-ca-9b83.ngrok-free.app/api/pagos/failure",
          pending: "https://e4a8-2803-9800-9506-86cd-50be-5cf1-ca-9b83.ngrok-free.app/api/pagos/pending",
        },
        auto_return: "approved",
      };
  
      // Crear la preferencia en Mercado Pago
      const response = await preference.create({ body: preferenceData });
      console.log("✅ Respuesta de Mercado Pago:", response);
  
      // Acceder directamente a init_point
      const linkPago = response.init_point;
  
      // Enviar el enlace de pago como respuesta
      res.json({ linkPago });
    } catch (error) {
      console.error("❌ Error en generarPago:", error);
      res.status(500).json({ message: "Error al generar el pago", detalles: error.message });
    }
  };
/**
 * Manejar respuestas de Mercado Pago
 */
exports.success = async (req, res) => {
  try {
    const { payment_id, status, external_reference, merchant_order_id } = req.query;
    console.log("Pago exitoso:", { payment_id, status, external_reference, merchant_order_id });
    // Actualiza el estado del pago en tu base de datos si es necesario
    res.send("Pago realizado con éxito. Redirigiendo...");
  } catch (error) {
    console.error("Error en success:", error);
    res.status(500).send("Error procesando el éxito del pago");
  }
};

exports.failure = async (req, res) => {
  try {
    const { payment_id, status } = req.query;
    console.log("Pago fallido:", { payment_id, status });
    res.send("El pago no pudo procesarse.");
  } catch (error) {
    console.error("Error en failure:", error);
    res.status(500).send("Error procesando el fallo del pago");
  }
};

exports.pending = async (req, res) => {
  try {
    const { payment_id, status } = req.query;
    console.log("Pago pendiente:", { payment_id, status });
    res.send("El pago está pendiente de aprobación.");
  } catch (error) {
    console.error("Error en pending:", error);
    res.status(500).send("Error procesando el estado pendiente");
  }
};