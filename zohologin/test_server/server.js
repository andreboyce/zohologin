"use strict";

var express = require("express");

function start_server( port = 9090 )
{
    var app = express();

    var path = __dirname + "\\public";
    app.use( express.static( path ) );

    //console.log( path );
     
    //make way for some custom css, js and images
    app.use( "/css",    express.static( __dirname + "\\public\\css"    ) );
    app.use( "/js",     express.static( __dirname + "\\public\\js"     ) );
    app.use( "/images", express.static( __dirname + "\\public\\images" ) );

    //console.log( __dirname + "\\public\\css" );

    var server = app.listen( port, function(){
        console.log( "Server started at http://localhost:%s", port );
    });

    return server;
}

function stop_server( server, callback = null )
{
    if( typeof server.close == "function" )
       return server.close( callback );
}

module.exports = {
    start_server : start_server,
    stop_server : stop_server
 }
