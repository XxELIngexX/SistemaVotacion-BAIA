# Sistema de Votaciones 

instalaciones necesarias:
Instalar Node.js desde https://nodejs.org (si no lo tienes ya)

```shell
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install ethers
npm create vite@latest
```

esta es una lista de comandos para ejecutar si se va a correr el proyecto
```shell
npx hardhat clean // si se hacen cambios estructurales + (opcional) borrar la carpeta artifacts
npx hardhat compile //compila
npx hardhat node //levanta un nodo local de hardhat
npx hardhat run scripts/deploy.js --network localhost //despliega el SC
npm run dev //para desplegar el front
```
