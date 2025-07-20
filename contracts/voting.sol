// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SistemaVotacion {

    // Estructura que define una propuesta
    struct Propuesta {
        string nombre;
        uint numeroVotos;
    }

    modifier soloAdmin() {
        require(msg.sender == admin, "Solo el administrador puede ejecutar esta funcion.");
        _;
    }


    // Dirección del administrador (quien despliega el contrato)
    address public admin;

    // Variable que indica si las elecciones están abiertas o no (opcional)
    bool public eleccionesAbiertas;

    // Para saber si una persona ya votó
    mapping(address => bool) public yaVoto;

    // Lista de propuestas disponibles para votar
    Propuesta[] public propuestas;

    // Evento que se puede emitir si se quieren registrar nuevas propuestas
    event RegistrarPropuesta(string nombre, uint numeroVotos);


    // Constructor que inicializa las propuestas al desplegar el contrato
    constructor(string[] memory nombrePropuestas) {
        admin = msg.sender;
        for (uint i = 0; i < nombrePropuestas.length; i++) {
            propuestas.push(
                Propuesta(
                    {
                        nombre: nombrePropuestas[i],
                        numeroVotos: 0
                    }
                )
            );
        }
    }

    // Función para votar por una propuesta usando su índice

    function getCantidadPropuestas() public view returns (uint) {
        return propuestas.length;
    }

    function votar(uint propuestaIndex) public {
        require(eleccionesAbiertas,"lo sentimos, las elecciones ya se cerraron");
        require(!yaVoto[msg.sender], "Solo puedes votar una vez.");
        require(propuestaIndex < propuestas.length, "Propuesta invalida.");
        
        yaVoto[msg.sender] = true;
        propuestas[propuestaIndex].numeroVotos += 1;
    }

    // Ver resultados: nombres de las propuestas y cantidad de votos
    function verResultados() public view returns (string[] memory, uint[] memory) {
        string[] memory nombres = new string[](propuestas.length);
        uint[] memory votos = new uint[](propuestas.length);

        for (uint i = 0; i < propuestas.length; i++) {
            nombres[i] = propuestas[i].nombre;
            votos[i] = propuestas[i].numeroVotos;
        }

        return (nombres, votos);
    }

    function abrirElecciones() public soloAdmin{
        eleccionesAbiertas = true;
    }
    function cerrarElecciones() public soloAdmin{
        eleccionesAbiertas = false;
    }

    function agregarPropuesta(string memory nombrePropuesta) public soloAdmin {
        propuestas.push(Propuesta(nombrePropuesta, 0));
    }

    function eliminarPropuesta(uint index) public soloAdmin {
        require(index < propuestas.length, "Propuesta no existe");
       
        for (uint i = index; i < propuestas.length - 1; i++) {
            propuestas[i] = propuestas[i + 1];
        }
        propuestas.pop(); // eliminar la última duplicada
    }


}
