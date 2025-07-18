async function main() {
const MiPrimerContrato = await ethers.getContractFactory("MiPrimerContrato");
  const contrato = await MiPrimerContrato.deploy();
  await contrato.waitForDeployment(); 

  console.log("Contrato desplegado en:", contrato.address);

  // Llamar función registrar
  let tx = await contrato.registrar("Sergio", 30);
  await tx.wait();

  // Obtener valores
  const nombre = await contrato.obtenerNombre();
  const edad = await contrato.obtenerEdad();
  const aprendio = await contrato.aprendioSolidity();
  const creador = await contrato.creador();

  console.log("Nombre:", nombre);
  console.log("Edad:", edad.toString());
  console.log("Aprendió Solidity:", aprendio);
  console.log("Creador:", creador);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
