const bcrypt = require("bcryptjs");

const passwordIngresada = "hola123";
const passwordAlmacenada = "$2a$10$DJS5QoFCT0xmSze/LiJb.erBaYLDb5Ya4z4xSWEr2aFXVOkSF4Ql2"; // Copia la que tienes en la BD

bcrypt.compare(passwordIngresada, passwordAlmacenada)
    .then(match => console.log("🔍 Resultado de comparación manual:", match))
    .catch(err => console.error("❌ Error en comparación:", err));
