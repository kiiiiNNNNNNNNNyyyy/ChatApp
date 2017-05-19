var socket = io(); //method available due to socket  io. variable for communicating.

socket.on('connect', function(){
    console.log("Connected to the server!");
});

socket.on('disconnect', function(){
    console.log('Disconnected from the server!!'); 

});

socket.on('newMessage', function(message){
    console.log('newMessage', message);
    var p = jQuery('<p class="text-back"></p></br>');
    p.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(p);  
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){
         
    }); 
});