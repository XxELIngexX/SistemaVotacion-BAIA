const hre = require("hardhat");

async function main() {
  const SistemaVotacion = await hre.ethers.getContractFactory("SistemaVotacion");
  const contrato = await SistemaVotacion.deploy();
  await contrato.waitForDeployment();

  console.log("Contrato desplegado en:", contrato.target);
  console.log("Admin: ", await contrato.admin());

  // Crear elección base: "Menú de la Cafetería"
  const nombresPropuestas = [
    "Vegetariano",
    "Light",
    "Vegano",
    "Alto en carbohidratos",
    "Alto en proteínas"
  ];

  const colores = [
    "azul",
    "rojo", 
    "verde",
    "amarillo",
  ]


  // Llama a la función crearEleccion
  const tx = await contrato.crearEleccion("Menú de la Cafetería", nombresPropuestas);
  await tx.wait();

  const tx1 = await contrato.crearEleccion("Colores Favoritos", colores);
  await tx1.wait();

  const electionDetails = await contrato.obtenerElecciones();
  console.log("Elección base creada exitosamente.");
  console.log("Detalles de la elección base: ", electionDetails);
}
  
main().catch((error) => {
  console.error("Error al desplegar:", error);
  process.exitCode = 1;
});
