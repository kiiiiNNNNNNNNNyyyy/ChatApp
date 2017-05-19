const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port =  process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketio(server); //now we have access to the server. We will get back our web ocket setver. we can listen to events here.

app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('New User connected!!');

    //emit from admin text welcome to the chat app
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

    //socket.broadcast.emit from Admin text New user joined
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined!!'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));//emits an event to every connection
        callback('This is from the server!!');

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });// wiill send to everyone except itself
    });

    socket.on('disconnect', () => {
        console.log("Disconnected from the server");
    });
}); //to register an event. Listen to a new connection. Callback to do somthing with that connection

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});