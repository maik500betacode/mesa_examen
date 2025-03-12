const jwt = require("jsonwebtoken");

exports.verificarToken = (req, res, next) => {
    const token = req.header("Authorization");

    console.log("🔹 Token recibido en el backend:", token);
    
    if (!token) {
        console.log("❌ No se recibió token en la petición");
        return res.status(401).json({ error: "Acceso denegado, token no proporcionado" });
    }

    try {
        const tokenLimpio = token.replace("Bearer ", "").trim();
        console.log("🔹 Token recibido en el backend:", tokenLimpio);

        const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.usuario = verificado;

        console.log("✅ Token verificado correctamente:", verificado);
        next();
    } catch (error) {
        console.log("❌ Error al verificar el token:", error.message);
        res.status(400).json({ error: "Token inválido" });
    }
};


exports.verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({ error: "Acceso denegado" });
        }
        next();
    };
};
