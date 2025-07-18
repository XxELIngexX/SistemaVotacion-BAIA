// SPDX-License-Identifier: MIT
// Licencia del contrato. MIT permite que otros lo usen libremente.
pragma solidity ^0.8.28;
// Esta línea indica la versión mínima del compilador Solidity que se usará.

contract MiPrimerContrato {
    // --- Variables de estado ---

    // Guardará el nombre de la persona que se registra
    string private nombre;

    // Edad de la persona
    uint private edad;

    // Indica si la persona aprendió Solidity (solo para mostrar uso de booleano)
    bool public aprendioSolidity;

    // Dirección de la persona que desplegó el contrato
    address public creador;

    // --- Eventos ---
    // Los eventos permiten registrar acciones en la blockchain
    event RegistroExitoso(string nombre, uint edad, address cuenta);

    // --- Constructor ---
    // Esta función se ejecuta solo UNA VEZ, cuando se despliega el contrato
    constructor() {
        creador = msg.sender; // msg.sender es quien ejecuta el contrato (el deployer)
    }

    // --- Funciones públicas ---

    // Permite registrar un nombre y edad
    function registrar(string memory _nombre, uint _edad) public {
        nombre = _nombre;      // Guardamos el nombre
        edad = _edad;          // Guardamos la edad
        aprendioSolidity = true; // Marcamos que ya aprendió Solidity (ejemplo booleano)

        // Emitimos un evento para dejar constancia del registro
        emit RegistroExitoso(_nombre, _edad, msg.sender);
    }

    // Función para obtener el nombre registrado
    // view: solo lee información, no modifica el contrato
    function obtenerNombre() public view returns (string memory) {
        return nombre;
    }

    // Función para obtener la edad registrada
    function obtenerEdad() public view returns (uint) {
        return edad;
    }
}
