const Novedad = require("../models/Novedad");

exports.obtenerNovedades = async (req, res) => {
    try {
        const novedades = await Novedad.find().populate("usuario");
        res.json(novedades);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener novedades" });
    }
};

exports.crearNovedad = async (req, res) => {
    try {
        const nuevaNovedad = new Novedad(req.body);
        await nuevaNovedad.save();
        res.status(201).json({ mensaje: "Novedad creada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear novedad" });
    }
};

exports.actualizarNovedad = async (req, res) => {
    try {
        const { id } = req.params;
        const novedadActualizada = await Novedad.findByIdAndUpdate(id, req.body, { new: true });
        res.json(novedadActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar novedad" });
    }
};

exports.eliminarNovedad = async (req, res) => {
    try {
        const { id } = req.params;
        await Novedad.findByIdAndDelete(id);
        res.json({ mensaje: "Novedad eliminada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar novedad" });
    }
};
