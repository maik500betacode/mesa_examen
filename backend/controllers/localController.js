const Local = require("../models/Local");

// Obtener todos los locales
exports.obtenerLocales = async (req, res) => {
    try {
        const locales = await Local.find();
        res.json(locales);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener locales" });
    }
};

// Crear un nuevo local
exports.crearLocal = async (req, res) => {
    try {
        const nuevoLocal = new Local(req.body);
        await nuevoLocal.save();
        res.status(201).json({ mensaje: "Local creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear local" });
    }
};

// Actualizar local
exports.actualizarLocal = async (req, res) => {
    try {
        const { id } = req.params;
        const localActualizado = await Local.findByIdAndUpdate(id, req.body, { new: true });
        res.json(localActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar local" });
    }
};

// Eliminar local
exports.eliminarLocal = async (req, res) => {
    try {
        const { id } = req.params;
        await Local.findByIdAndDelete(id);
        res.json({ mensaje: "Local eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar local" });
    }
};
