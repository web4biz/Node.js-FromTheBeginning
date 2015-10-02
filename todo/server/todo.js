var express     = require('express'),
    app         = express(),
    
    server      = require('http').createServer( app ).listen( 80 ),
    io          = require('socket.io').listen( server )
    
    debug       = require("debug");
    
app.use( express.static( './client' ) );

app.get( '/', function( rew, res ) {
    res.sendFile( "../client/index.html", { root: __dirname } );
});

io.on( 'connection', function(socket) {

    function login ( name ) {
        console.log( "login", name );
        socket.nickname     = name;
    }

    // tell the socket to identify (for relogin after restart of node session)
    socket.emit( "relogin", {}, login );

    // event for login from socket
    socket.on( "login", login );

    // socket sends message
    socket.on( "sendMessage", function( msg ) {
        console.log( "send message", numConn, socket.nickname, msg );

        // broadcast message to all subscribed sockets
        io.emit( "newMessage", {
            name:       socket.nickname,
            msg:        msg
        } );
    });

});