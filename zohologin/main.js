"use strict";

/**
 * main
 * creates an instance of ZohoLogin class and logins to several accounts.
 */
async function main( live )
{
    try
    {
        const ZohoLogin = require("./ZohoLogin.js");

        if( live )
        {
            var zohoLogin = new ZohoLogin( "zoho", "active", "./data/accounts.db", false, 10000 )
            zohoLogin.init().then( async ()=>{
               await zohoLogin.run( false ).then(()=>{

               }).catch((error)=>{
                  console.log( "main: " + error );
               });
            }).catch((error)=>{

            });
        }
        else
        {
            var zohoLogin = new ZohoLogin( "zoho", "active", "./test/test.db", false, 3000 );
            zohoLogin.init().then( async ()=>{
               var TestServer = require("./test_server/server.js");
               var server = TestServer.start_server();
               await zohoLogin.run( false, "http://localhost:9090" ).then(()=>{

               }).catch((error)=>{
                  console.log( "main: " + error );
               });
               TestServer.stop_server( server );
            }).catch((error)=>{

            });
        }
    }
    catch( error )
    {
        console.log( "main: " + error );
    }
}

(async ()=>{

    //var live = false;
    var live = true;
    await main( live );

})();
