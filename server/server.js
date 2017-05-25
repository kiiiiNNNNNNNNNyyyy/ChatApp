const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port =  process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketio(server); //now we have access to the server. We will get back our web ocket setver. we can listen to events here.
var users = new Users();

app.use(express.static(publicPath));
io.on('connection', (socket) => {
    console.log('New User connected!!');
    
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and room name are required.');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id); 
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //emit from admin text welcome to the chat app
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));
        //socket.broadcast.emit from Admin text New user joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!!`));
        callback();
    });
    
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));//emits an event to every connectione
        callback();
    });
    
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });
    
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat room!!`));
        }
        console.log("Disconnected from the server");
    });
}); //to register an event. Listen to a new connection. Callback to do somthing with that connection

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});