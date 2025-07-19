const hre = require("hardhat");

async function main() {
  const SistemaVotacion = await hre.ethers.getContractFactory("SistemaVotacion");

  const propuestas = ["Propuesta A", "Propuesta B", "Propuesta C"];

  const contrato = await SistemaVotacion.deploy(propuestas);
  await contrato.waitForDeployment(); // Usamos esto en Ethers v6

  console.log("Contrato desplegado en:", contrato.target); // .target = dirección en Ethers v6

  // Obtener cantidad de propuestas
  const cantidad = await contrato.getCantidadPropuestas();
  console.log("Cantidad de propuestas:", cantidad.toString());

  // Imprimir propuestas desde el contrato
  for (let i = 0; i < propuestas.length; i++) {
    const propuesta = await contrato.propuestas(i);
    console.log(`Propuesta ${i}: ${propuesta.nombre}, Votos: ${propuesta.numeroVotos}`);
  }

  // (Opcional) Mostrar si las elecciones están abiertas
  const abiertas = await contrato.eleccionesAbiertas();
  console.log("¿Elecciones abiertas?:", abiertas);
}

main().catch((error) => {
  console.error("Error al desplegar:", error);
  process.exitCode = 1;
});