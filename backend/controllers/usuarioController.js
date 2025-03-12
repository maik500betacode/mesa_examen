const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    console.log("✅ Se recibió una solicitud GET a /api/usuarios");
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};


// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
    try {
        const { usuario, email, password, perfil } = req.body;

        // Verificar si el email ya está en uso
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        if (!password) {
            return res.status(400).json({ error: "La contraseña es obligatoria" });
        }


        const nuevoUsuario = new Usuario({
            usuario,
            email,
            password,
            perfil,
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Usuario creado con éxito" });

    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({ error: "Error al crear usuario", detalle: error.message });
    }
};



exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        let { password, ...restoDatos } = req.body;

        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Si se envía una nueva contraseña, simplemente la asignamos
        if (password) {
            usuario.password = password;
            console.log("🛠️ Nueva contraseña asignada:", usuario.password);
        }

        // Actualizamos los otros datos
        Object.assign(usuario, restoDatos);
        await usuario.save(); // Aquí se ejecuta el `pre("save")` del modelo

        res.json(usuario);
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ error: "Error al actualizar usuario", detalle: error.message });
    }
};


// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        await Usuario.findByIdAndDelete(id);
        res.json({ mensaje: "Usuario eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
};
