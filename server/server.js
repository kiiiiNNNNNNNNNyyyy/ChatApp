const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port =  process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketio(server); //now we have access to the server. We will get back our web ocket setver. we can listen to events here.

app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('New User connected!!');

    socket.emit('newMessage', {
        from: "John",
        text: "See you then!!",
        createdAt: 123123
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
    });

    socket.on('disconnect', () => {
        console.log("Disconnected from the server");
    });
}); //to register an event. Listen to a new connection. Callback to do somthing with that connection

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});