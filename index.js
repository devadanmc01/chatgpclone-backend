require('dotenv').config()
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const app = express();
let server = http.createServer(app);
const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 8080;


app.use(express.static(publicPath));
//IO = es la comunicacion del backend
module.exports.io = socketIO(server,{ 
    cors: {
        origin: '*',
    },
    presence: true,
});
require('./src/controllers/sockets.js')

server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});