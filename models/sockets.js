const { verifyJWT } = require("../helpers/jwt");
const { userConnection, getUsers, saveMessage } = require("../controller/sockets");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {

            // Validate JWT
            // If token invalite disconnect  
            const [valid, uid] = verifyJWT(socket.handshake.query['x-token']);

            if(!valid){
                console.log('Socket no identificado');
                return socket.disconnect()
            }
             
            // Know which user is active by token uid
            const user = await userConnection(uid, true)
            console.log('client connected-->', user.nombre);


            // Join user to a Socket.IO room
            socket.join(uid)


            // Send all connected users
            this.io.emit('user-list', await getUsers() )



            

            // TODO: Listen when the client sends a message
            socket.on('personal-message', async (msgData)=>{
               const message= await saveMessage(msgData)
                
               this.io.to(msgData.for).emit('personal-message', message)
               this.io.to(msgData.from).emit('personal-message', message)

            })

            // TODO: Disconnect
            // Mark in the database that the user was disconnected

            

            socket.on('disconnect', async()=>{
                const user = await userConnection( uid, false )
                console.log('cliente desconectado-->', user.nombre);
                
                // Update online and offline and notify user
                this.io.emit('user-list', await getUsers() )
            })
        });
    }


}


module.exports = Sockets;