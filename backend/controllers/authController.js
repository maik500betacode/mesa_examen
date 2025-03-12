const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.registrarUsuario = async (req, res) => {
    try {
        const { email, usuario, password, perfil } = req.body;

        let usuarioExiste = await Usuario.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }


        const nuevoUsuario = new Usuario({ 
            email, 
            usuario, 
            password,
            perfil 
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar usuario" });
    }
};

const generarToken = (id, perfil) => {
    return jwt.sign(
        { id, perfil }, 
        process.env.JWT_SECRET || 'secreto',  // Usa una variable de entorno para más seguridad
        { expiresIn: "2h" } // Token válido por 2 horas
    );
};




exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`📌 Iniciando sesión con: ${email}`);
        console.log(`🔐 Contraseña ingresada: ${password}`);

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        console.log("🔑 Usuario encontrado en la BD:", usuario);

        console.log("🛠️ Contraseña almacenada en BD:", usuario.password);

        // 🔍 Comparar la contraseña ingresada con la encriptada
        const match = await bcrypt.compare(password, usuario.password);
        console.log("🔍 Resultado de comparación de contraseña:", match);

        if (!match) {
            return res.status(400).json({ error: "Credenciales inválidas" });
        }

        // Si la contraseña es correcta, generar un token y devolverlo
        const token = generarToken(usuario._id, usuario.perfil);
        console.log("✅ Token generado correctamente:", token);

        res.json({ token });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};



