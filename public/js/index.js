var socket = io(); //method available due to socket  io. variable for communicating.

socket.on('connect', function(){
    console.log("Connected to the server!");

    socket.emit("createMessage", {
        from: 'Andrew',
        msg: "Yup!, That was me!"
    });
});

socket.on('disconnect', function(){
    console.log('Disconnected from the server!!'); 

});

socket.on('newMessage', function(message){
    console.log('newMessage', message);
});