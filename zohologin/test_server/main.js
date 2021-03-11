"use strict";

/**
 * main
 */
(async ()=>{

    try
    {
        var TestServer = require( "./server.js" );
        var server = TestServer.start_server();

        var stopServerCallback = function(){ console.log( "Server Closed" ); };
        //TestServer.stop_server( server, stopServerCallback );
    }
    catch( error )
    {
        console.log( "main: " + error );
    }

})();
