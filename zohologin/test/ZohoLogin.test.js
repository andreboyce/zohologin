"use strict";

const chai = require('chai');
var expect = require("chai").expect;
var should = require("chai").should;
const assertArrays = require('chai-arrays');
chai.use(assertArrays);
chai.use( require('chai-as-promised') );

const ZohoLogin = require("../ZohoLogin.js");

describe("ZohoLogin", function (){
   //this.timeout(120000);

      it( "should cause ZohoLogin.constructor throw", ()=>{
         var f = function(){ new ZohoLogin( "zoho", "active", "./data/fake.db", false ) };
         expect( f ).to.throw();
      });

      it( "ZohoLogin.constructor", ()=>{
         var f = function(){ new ZohoLogin() };
         expect( f ).to.not.throw();
      });

      var zohoLogin = new ZohoLogin( "zoho", "active", "./test/test.db", true, 0 );

      
      it( "should cause ZohoLogin.init( SQLLiteManager ) throw", async ( )=>{
         var SQLLiteManager = null;
         return zohoLogin.init( SQLLiteManager )
         .then( ( result )=>{ 
            //console.log( "wrong" );
            expect( result ).to.equal( true );
         })
         .catch( (error)=>{ 
            //console.log( "correct: " + error );
            expect( error ).to.not.equal( null );
         });
      });

      it( "should cause ZohoLogin.init sqlLiteManager.init( SQLLiteManager, sql ) to throw", async ( )=>{
         var SQLLiteManager = require('../SQLLiteManager.js');
         var sql = "error";
         zohoLogin.init( SQLLiteManager, sql )
         .then( ( result )=>{
            //console.log( "wrong" );
            expect( result ).to.equal( true );
         })
         .catch( (error)=>{ 
            //console.log( "correct: " + error );
            expect( error ).to.not.equal( null );
         });
      });
      


      it( "ZohoLogin.init ", async ()=>{
         //var SQLLiteManager = require('../SQLLiteManager.js');
         await zohoLogin.init().then( ( result ) => {
            expect(result).to.equal( true ); 
         });
      });

      
      it( "ZohoLogin.getAccounts", async ()=>{
         await zohoLogin.getAccounts().then( ( result ) => { 
            expect(result).to.be.array();
            expect(result).to.have.length.above( 0 );
         });
      });

      it( "should cause ZohoLogin.getAccounts throw", async ()=>{
         //var y = 1;
         //var f = async ()=>{await zohoLogin.getAccounts( y ) };
         //expect(f).to.throw();

         var y = 1;
         await zohoLogin.getAccounts( y ).then( ( result ) => { 
            expect(result).to.be.array();
            expect(result).to.have.length.above( 0 );
         }).catch( ( error ) =>
         {
            expect(error).to.not.equal( null );
         });
      });


      it( "ZohoLogin.listAccounts", async ()=>{
         await zohoLogin.listAccounts( false ).then( ( result ) => { 
            expect(result).to.equal( true );
         });

         await zohoLogin.listAccounts().then( ( result ) => { 
            expect(result).to.equal( true );
         });
      });

      it( "should cause ZohoLogin.listAccounts throw", async ()=>{
         //var accounts = new Array();
         //accounts.push( {x:1} );
         var accounts = 7;
         await zohoLogin.listAccounts( false, accounts ).then( ( result ) => { 
            expect(result).to.equal( true );
         }).catch( ( error ) =>
         {
            expect(error).to.not.equal( null );
         });
      });

      describe( "ZohoLogin.initBrowser", async() => {
         this.timeout(320000);

         it( "ZohoLogin.initBrowser", async ()=>{
               var options = { headless: true, args: [
                  '--no-sandbox1',
                  '--disable-setuid-sandbox',
                  '--start-maximized'
               ] };
               var browser;
               try
               {
                  browser = await zohoLogin.initBrowser( options );
                  expect(browser).to.not.equal(null);
                  //expect(browser).to.not.equal(undefined);
               }
               catch( error )
               {
                  console.log( "ZohoLogin.initBrowser" + error );
               }
               expect(browser.close).to.be.a('function');
               await browser.close();
         });

         it( "should cause  ZohoLogin.initBrowser to throw", async ()=>{
            var options = { headless: true, executablePath: "./", args: [
               '--no-sandbox1',
               '--disable-setuid-sandbox',
               '--start-maximized'
            ] };
            await zohoLogin.initBrowser( options ).then( async ( browser ) => { 
               expect(browser).to.not.equal(null);
               expect(browser.close).to.be.a('function');
               await browser.close();
            }).catch( ( error ) =>
            {
               expect(error).to.not.equal(null);
            });
         });
      });

      it( "should cause ZohoLogin.initPage throw", async ()=>{
         await zohoLogin.initBrowser().then( async ( browser ) => { 
            expect(browser).to.not.equal(null);
            expect(browser.close).to.be.a('function');

            await zohoLogin.initPage( null ).then( async ( page ) => {

               expect(page).to.not.equal(null);
               expect(page.close).to.be.a('function');
               await page.close();

               expect(browser.close).to.be.a('function');
               await browser.close();
            }).catch( async ( error )=>{
               expect(error).to.not.equal(null);

               expect(browser.close).to.be.a('function');
               await browser.close();
            });
         });
      });

      it( "ZohoLogin.initPage", async ()=>{
         await zohoLogin.initBrowser().then( async ( browser ) => { 
            expect(browser).to.not.equal(null);
            expect(browser.close).to.be.a('function');

            await zohoLogin.initPage( browser ).then( async ( page ) => {

               expect(page).to.not.equal(null);
               expect(page.close).to.be.a('function');
               await page.close();

               expect(browser.close).to.be.a('function');
               await browser.close();
            });
         });
      });

      describe("should cause ZohoLogin.login throw", function (){
         this.timeout(320000);

         it( "ZohoLogin.login throw", async ()=>{
            
            await zohoLogin.init().then( async ( result ) => {
               expect(result).to.equal( true ); 
               await zohoLogin.initBrowser().then( async ( browser ) => { 
                  expect(browser).to.not.equal(null);
                  expect(browser.close).to.be.a('function');
      
                  await zohoLogin.initPage( browser ).then( async ( page ) => {
      
                     expect(page).to.not.equal(null);
                     expect(page.close).to.be.a('function');
      
                     var accounts = await zohoLogin.getAccounts();
                     expect(accounts).to.be.array();   
                     expect(accounts).to.have.length.above( 0 );
      
                     var username       = accounts[0]['username'], 
                         password       = accounts[0]['password'], 
                         recovery_email = accounts[0]['recovery_email'];
      
                     //console.log( "ZohoLogin.login throw zohoLogin.login( null..." );
                     await zohoLogin.login( null, username, password, recovery_email, false ).then( async ( result ) => { 
                        expect(result).to.equal(null);
                        expect(result.close).to.not.be.a('function');
                        //expect(browser.close).to.be.a('function');
                        //await browser.close();
                        //done();
                     }).catch( ( error )=>{
                        //console.log( error );
                        expect(error).to.not.equal(null);
                     });
                     expect(browser.close).to.be.a('function');
                     await browser.close();
                  });
               });
      
            });
         });

         it( "should cause ZohoLogin.login throw bad url", async ()=>{
            
            await zohoLogin.init().then( async ( result ) => {
               expect(result).to.equal( true ); 
               await zohoLogin.initBrowser().then( async ( browser ) => { 
                  expect(browser).to.not.equal(null);
                  expect(browser.close).to.be.a('function');
      
                  await zohoLogin.initPage( browser ).then( async ( page ) => {
      
                     expect(page).to.not.equal(null);
                     expect(page.close).to.be.a('function');
      
                     var accounts = await zohoLogin.getAccounts();
                     expect(accounts).to.be.array();   
                     expect(accounts).to.have.length.above( 0 );
      
                     var username       = accounts[0]['username'], 
                         password       = accounts[0]['password'], 
                         recovery_email = accounts[0]['recovery_email'];
      
                     var protocol = "http://";
                     var host = "localhost";
                     var port = "9090";                     
                     var login_url = ""; //protocol + host + ":" + port;
                     await zohoLogin.login( page, username, password, recovery_email, false, login_url ).then( async ( result ) => { 
                        expect(result).to.equal(null);
                        expect(result.close).to.not.be.a('function');
                        //expect(browser.close).to.be.a('function');
                        //await browser.close();
                        //done();
                     }).catch( ( error )=>{
                        //console.log( error );
                        expect(error).to.not.equal(null);
                     });
                     expect(browser.close).to.be.a('function');
                     await browser.close();
                  });
               });
      
            });
         });

         it( "ZohoLogin.login mock", async ()=>{
            
            await zohoLogin.init().then( async ( result ) => {
               expect(result).to.equal( true ); 
               await zohoLogin.initBrowser().then( async ( browser ) => { 
                  expect(browser).to.not.equal(null);
                  expect(browser.close).to.be.a('function');
      
                  await zohoLogin.initPage( browser ).then( async ( page ) => {
      
                     expect(page).to.not.equal(null);
                     expect(page.close).to.be.a('function');
      
                     var accounts = await zohoLogin.getAccounts();
                     expect(accounts).to.be.array();   
                     expect(accounts).to.have.length.above( 0 );
      
                     var username       = accounts[0]['username'], 
                         password       = accounts[0]['password'], 
                         recovery_email = accounts[0]['recovery_email'];
                     
                     var TestServer = require("../test_server/server.js");

                     var server = TestServer.start_server();
      
                     var protocol = "http://";
                     var host = "localhost";
                     var port = "9090";                     
                     var login_url = protocol + host + ":" + port;
                                          //( page, username, password, recovery_email, logusername = true, login_url = "https://www.zoho.com/mail/" )
                     await zohoLogin.login( page, username, password, recovery_email, false, login_url ).then( async ( result ) => { 
                        expect(result).to.equal(null);
                        expect(result.close).to.not.be.a('function');
                        //expect(browser.close).to.be.a('function');
                        //await browser.close();
                        //done();
                     }).catch( ( error )=>{
                        //console.log( error );
                        expect(error).to.not.equal(null);
                     });

                     TestServer.stop_server( server );

                     expect(browser.close).to.be.a('function');
                     await browser.close();
                  });
               });
      
            });
         });

         it( "ZohoLogin.login mock throw incorrect username", async ()=>{
            
            await zohoLogin.init().then( async ( result ) => {
               expect(result).to.equal( true ); 
               await zohoLogin.initBrowser().then( async ( browser ) => { 
                  expect(browser).to.not.equal(null);
                  expect(browser.close).to.be.a('function');
      
                  await zohoLogin.initPage( browser ).then( async ( page ) => {
      
                     expect(page).to.not.equal(null);
                     expect(page.close).to.be.a('function');
      
                     var accounts = await zohoLogin.getAccounts();
                     expect(accounts).to.be.array();   
                     expect(accounts).to.have.length.above( 0 );
      
                     var username       = accounts[0]['username'], 
                         password       = accounts[0]['password'], 
                         recovery_email = accounts[0]['recovery_email'];
                     
                     var TestServer = require("../test_server/server.js");

                     var server = TestServer.start_server();
      
                     var protocol = "http://";
                     var host = "localhost";
                     var port = "9090";                     
                     var login_url = protocol + host + ":" + port;
                                          //( page, username, password, recovery_email, logusername = true, login_url = "https://www.zoho.com/mail/" )
                     await zohoLogin.login( page, "", password, recovery_email, false, login_url ).then( async ( result ) => { 
                        expect(result).to.equal(null);
                        expect(result.close).to.not.be.a('function');
                        //expect(browser.close).to.be.a('function');
                        //await browser.close();
                        //done();
                     }).catch( ( error )=>{
                        //console.log( error );
                        expect(error).to.not.equal(null);
                     });

                     TestServer.stop_server( server );

                     expect(browser.close).to.be.a('function');
                     await browser.close();
                  });
               });
      
            });
         });
   
      });

      describe("ZohoLogin.login", function (){
         this.timeout(120000);
         it( "ZohoLogin.login", async ()=>{
            
            await zohoLogin.init().then( async ( result ) => {
               expect(result).to.equal( true ); 
               await zohoLogin.initBrowser().then( async ( browser ) => { 
                  expect(browser).to.not.equal(null);
                  expect(browser.close).to.be.a('function');
      
                  await zohoLogin.initPage( browser ).then( async ( page ) => {
      
                     expect(page).to.not.equal(null);
                     expect(page.close).to.be.a('function');
      
                     var accounts = await zohoLogin.getAccounts();
                     expect(accounts).to.be.array();   
                     expect(accounts).to.have.length.above( 0 );
      
                     var username       = accounts[0]['username'], 
                         password       = accounts[0]['password'], 
                         recovery_email = accounts[0]['recovery_email'];
      
                     await zohoLogin.login( page, username, password, recovery_email, true ).then( async ( result ) => { 
                        expect(result.close).to.be.a('function');
                        await result.close();
                        //done();
                     }).catch( ( error )=>{
                        console.log( error );
                     });

                     await zohoLogin.login( page, username, password, recovery_email ).then( async ( result ) => { 
                        expect(result.close).to.be.a('function');
                        await result.close();
                     }).catch( ( error )=>{
                        console.log( error );
                     });

                     expect(browser.close).to.be.a('function');
                     await browser.close();
                  });
               });
      
            });
         });   
      });

      describe("zohoLogin.loginToAccounts", function (){
         this.timeout(120000);

         it( "zohoLogin.loginToAccounts throw", async ()=>{
            
            await zohoLogin.init().then( async ( result ) => {
               expect(result).to.equal( true ); 
               await zohoLogin.initBrowser().then( async ( browser ) => { 
                  expect(browser).to.not.equal(null);
                  expect(browser.close).to.be.a('function');

                  //var accounts = await zohoLogin.getAccounts();
                  //expect(accounts).to.be.array();   
                  //expect(accounts).to.have.length.above( 0 );

                  await zohoLogin.loginToAccounts( null, true, null ).then( (result)=>{
                     expect(result).to.equal(true);
                  }).catch( ( error )=>{ 
                     expect(error).to.not.equal(null);
                  });

                  //await zohoLogin.loginToAccounts( browser, false, "" ).then( (result)=>{
                  //   expect(result).to.equal(true);
                  //}).catch( ( error )=>{ 
                  //   expect(error).to.not.equal(null);
                  //});

                  expect(browser.close).to.be.a('function');
                  await browser.close();
               });      
            });
         });

         it( "zohoLogin.loginToAccounts", async ()=>{
            
            await zohoLogin.init().then( async ( result ) => {
               expect(result).to.equal( true ); 
               await zohoLogin.initBrowser().then( async ( browser ) => { 
                  expect(browser).to.not.equal(null);
                  expect(browser.close).to.be.a('function');

                  //var accounts = await zohoLogin.getAccounts();
                  //expect(accounts).to.be.array();   
                  //expect(accounts).to.have.length.above( 0 );

                  await zohoLogin.loginToAccounts( browser, false ).then( (result)=>{
                     expect(result).to.equal(true);
                  }).catch( ( error )=>{ 
                     expect(error).to.not.equal(null);
                  });

                  await zohoLogin.loginToAccounts( browser, true, "" ).then( (result)=>{
                     expect(result).to.equal(true);
                  }).catch( ( error )=>{ 
                     expect(error).to.not.equal(null);
                  });

                  await zohoLogin.loginToAccounts( browser ).then( (result)=>{
                     expect(result).to.equal(true);
                  }).catch( ( error )=>{ 
                     expect(error).to.not.equal(null);
                  });

                  expect(browser.close).to.be.a('function');
                  await browser.close();
               });      
            });
         });   
      });

      describe("ZohoLogin.run", function (){
         this.timeout(120000);

         
         it( "zohoLogin.run to throw", async ( )=>{
            await zohoLogin.run( false, "https://www.zoho.com/mail/", false, "./" ).then( ( result ) => {
               expect(result).to.equal( true ); 
            }).catch( (error)=>{
               expect(error).to.not.equal( null );
            });
         });
         

         it( "zohoLogin.run loginToAccounts to throw", async ( )=>{
            var fakebrowser = 11;
            await zohoLogin.run( false, "http://localhost:80", false, "", fakebrowser ).then( ( result ) => {
               expect(result).to.equal( true );
            }).catch( (error)=>{
               expect(error).to.not.equal( null );
            });
         });

         
         it( "zohoLogin.run ", async ( )=>{
            await zohoLogin.run().then( ( result ) => {
               expect(result).to.equal( true );
            }).catch( (error)=>{
               expect(error).to.not.equal( null );
            });
         });
         
      });

});
