// Servidor de Express
const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const cors = require('cors');

const Sockets  = require('./sockets');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {

        this.app  = express();
        this.port = process.env.PORT;

 
        // Conectar a la Base de Datos
        dbConnection()

        // Http server
        this.server = http.createServer( this.app );
        
        // Configuraciones de sockets
        this.io = socketio( this.server, { /* configuraciones */ } );
    }

    middlewares() {
        // Desplegar el directorio público
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );
        
        // Habilitar cors
        this.app.use( cors() );
        
        // Habilitar Body Parser
        this.app.use( express.json())

        // API ENDPoints
        this.app.use('/api/auth', require('../router/auth'))
        this.app.use('/api/msg', require('../router/msg'))
    }

    // Esta configuración se puede tener aquí o como propiedad de clase
    configurarSockets() {
        new Sockets( this.io );
    }


    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto:', this.port );
        });
    }

}


module.exports = Server;