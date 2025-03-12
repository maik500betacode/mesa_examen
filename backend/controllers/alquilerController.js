const Alquiler = require("../models/Alquiler");

// Obtener todos los alquileres
exports.obtenerAlquileres = async (req, res) => {
    try {
        const alquileres = await Alquiler.find().populate("propietario").populate("local");
        res.json(alquileres);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener alquileres" });
    }
};

// Crear un nuevo alquiler
exports.crearAlquiler = async (req, res) => {
    try {
        const nuevoAlquiler = new Alquiler(req.body);
        await nuevoAlquiler.save();
        res.status(201).json({ mensaje: "Alquiler creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear alquiler" });
    }
};

// Actualizar alquiler
exports.actualizarAlquiler = async (req, res) => {
    try {
        const { id } = req.params;
        const alquilerActualizado = await Alquiler.findByIdAndUpdate(id, req.body, { new: true });
        res.json(alquilerActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar alquiler" });
    }
};

// Eliminar alquiler
exports.eliminarAlquiler = async (req, res) => {
    try {
        const { id } = req.params;
        await Alquiler.findByIdAndDelete(id);
        res.json({ mensaje: "Alquiler eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar alquiler" });
    }
};
