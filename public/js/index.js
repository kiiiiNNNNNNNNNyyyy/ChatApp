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

socket.on('newLocationMessage', function(message){
    var p =jQuery('<p></p>');
    var a = jQuery('<a target="_blank">My current Location</a>');
    p.text(`${message.from}: `);
    a.attr('href', message.url);
    p.append(a);
    jQuery('#messages').append(p);
});

jQuery('#send-message').on('click', function(e){
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function(){
         
    }); 
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(e){
    e.preventDefault();
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser!!');
    }
    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        alert('Unable to fetch location.');
    })
});