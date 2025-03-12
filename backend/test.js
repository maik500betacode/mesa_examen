const bcrypt = require("bcryptjs");

async function testHash() {
    const passwordIngresada = "hola123";
    const hashAlmacenado = "$2a$10$N9CiGQ.ifdSybjqHPVERfOi5kFFwRP1rLPnN86q0uuqiPMlO.iJYC";  // Hash del usuario en la BD

    const match = await bcrypt.compare(passwordIngresada, hashAlmacenado);
    console.log("🔍 Comparación manual:", match);
}

testHash();

