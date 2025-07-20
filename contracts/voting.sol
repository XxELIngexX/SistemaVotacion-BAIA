// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SistemaVotacion {

    // Estructura que define una propuesta
    struct Propuesta {
        string nombre;
        uint numeroVotos;
    }

    struct Eleccion {
        string nombre;
        Propuesta[] propuestas;
        bool abierta;
        bool eliminada;
        mapping(address => bool) yaVoto;
    }

    struct EleccionPublica {
    string titulo;
    bool abierta;
    string[] nombresPropuestas;
    uint[] votos;
}


    address public admin;
    Eleccion[] private elecciones;

    modifier soloAdmin() {
        require(msg.sender == admin, "Solo el administrador puede ejecutar esta funcion.");
        _;
    }


    // Constructor que inicializa las propuestas al desplegar el contrato
    constructor() {
        admin = msg.sender;
    }

// FUNCIONES DE ADMINISTRADOR 

    // Función para crear una nueva elección
    function crearEleccion(string memory _nombre, string[] memory _nombresPropuestas) public soloAdmin {
        Eleccion storage nuevaEleccion = elecciones.push();
        nuevaEleccion.nombre = _nombre;
        nuevaEleccion.eliminada = false;
        nuevaEleccion.abierta = false;
        for (uint i = 0; i < _nombresPropuestas.length; i++) {
            nuevaEleccion.propuestas.push(Propuesta({
                nombre: _nombresPropuestas[i],
                numeroVotos: 0
            }));
        }
    }

    // Función para abrir una elección
    function abrirEleccion(uint _indiceEleccion) public soloAdmin {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        require(!elecciones[_indiceEleccion].abierta, "La eleccion ya esta abierta.");
        elecciones[_indiceEleccion].abierta = true;
    }

    // Función para cerrar una elección
    function cerrarEleccion(uint _indiceEleccion) public soloAdmin {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        require(elecciones[_indiceEleccion].abierta, "La eleccion ya esta cerrada.");
        elecciones[_indiceEleccion].abierta = false;
    }

    // Función para eliminar una elección
    function eliminarEleccion(uint _indiceEleccion) public soloAdmin {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        require(!elecciones[_indiceEleccion].eliminada, "La eleccion ya esta eliminada.");
        elecciones[_indiceEleccion].eliminada = true;
    }


// FUNCIONES DE CONSULTA
    //funcion para obtener todas las elecciones
    function obtenerElecciones() public view returns (EleccionPublica[] memory) {
        EleccionPublica[] memory elecciones_ = new EleccionPublica[](elecciones.length);
        for (uint i = 0; i < elecciones.length; i++) {
            Eleccion storage eleccion = elecciones[i];
            elecciones_[i].titulo = eleccion.nombre;
            elecciones_[i].abierta = eleccion.abierta;
            elecciones_[i].nombresPropuestas = new string[](eleccion.propuestas.length);
            elecciones_[i].votos = new uint[](eleccion.propuestas.length);
            for (uint j = 0; j < eleccion.propuestas.length; j++) {
                elecciones_[i].nombresPropuestas[j] = eleccion.propuestas[j].nombre;
                elecciones_[i].votos[j] = eleccion.propuestas[j].numeroVotos;
            }
        }
        return elecciones_;
    }

    //Función para obtener el número de elecciones
    function obtenerNumeroElecciones() public view returns (uint) {
        return elecciones.length;
    }

    //Funcion para obtener el nombre de una eleccion
    function obtenerNombreEleccion(uint _indiceEleccion) public view returns (string memory) {
        require( _indiceEleccion < elecciones.length, "Eleccion no encontrada." );
        return elecciones[_indiceEleccion].nombre;
    }

    // Función para obtener si una elección está abierta
    function estaAbierta(uint _indiceEleccion) public view returns (bool) {
        require( _indiceEleccion < elecciones.length, "Eleccion no encontrada." );
        return elecciones[_indiceEleccion].abierta;
    }

    // Función para obtener si una elección está eliminada
    function estaEliminada(uint _indiceEleccion) public view returns (bool) {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        return elecciones[_indiceEleccion].eliminada;
    }

    // Función para obtener el número de propuestas en una elección
    function obtenerNumeroPropuestas(uint _indiceEleccion) public view returns (uint) {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        return elecciones[_indiceEleccion].propuestas.length;
    }

    // Función para obtener los nombres de las propuestas en una elección
    function obtenerNombresPropuestas(uint _indiceEleccion) public view returns (string[] memory) {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        Eleccion storage eleccion = elecciones[_indiceEleccion];
        string[] memory nombres = new string[](eleccion.propuestas.length);
        for (uint i = 0; i < eleccion.propuestas.length; i++) {
            nombres[i] = eleccion.propuestas[i].nombre;
        }
        return nombres;
    }

    // Función para obtener los detalles de una elección
    function verResultados(uint _indiceEleccion) public view returns (string memory, Propuesta[] memory, bool) {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        Eleccion storage eleccion = elecciones[_indiceEleccion];
        return (eleccion.nombre, eleccion.propuestas, eleccion.abierta);
    }

    // Función para obtener si un usuario ya votó en una elección
    function yaVoto(uint _indiceEleccion) public view returns (bool) {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        Eleccion storage eleccion = elecciones[_indiceEleccion];
        return eleccion.yaVoto[msg.sender];
    }

//FUNCIONES DE USUARIO

    // Función para votar por una propuesta
    function votar(uint _indiceEleccion, uint _indicePropuesta) public {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        Eleccion storage eleccion = elecciones[_indiceEleccion];
        require(eleccion.abierta, "La eleccion no esta abierta.");
        require(!eleccion.yaVoto[msg.sender], "Ya has votado en esta eleccion.");
        require(_indicePropuesta < eleccion.propuestas.length, "Propuesta no encontrada.");

        eleccion.propuestas[_indicePropuesta].numeroVotos++;
        eleccion.yaVoto[msg.sender] = true;
    }


//FUNCIONES GENERALES

    // Función para obtener el número de votos de una propuesta
    function obtenerNumeroVotos(uint _indiceEleccion, uint _indicePropuesta) public view returns (uint) {
        require(_indiceEleccion < elecciones.length, "Eleccion no encontrada.");
        Eleccion storage eleccion = elecciones[_indiceEleccion];
        require(_indicePropuesta < eleccion.propuestas.length, "Propuesta no encontrada.");
        return eleccion.propuestas[_indicePropuesta].numeroVotos;
    }

}
