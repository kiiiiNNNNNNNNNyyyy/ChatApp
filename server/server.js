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

    //emit from admin text welcome to the chat app
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the text App'
    });

    //socket.broadcast.emit from Admin text New user joined
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New User Joined!'
    });

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        // io.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });//emits an event to every connection

        socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });// wiill send to everyone except itself
    });

    socket.on('disconnect', () => {
        console.log("Disconnected from the server");
    });
}); //to register an event. Listen to a new connection. Callback to do somthing with that connection

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});