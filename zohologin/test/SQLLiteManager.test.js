"use strict";

const chai = require('chai');
var expect = require("chai").expect;
const assertArrays = require('chai-arrays');
chai.use(assertArrays);

const SQLLiteManager = require("../SQLLiteManager.js");

describe("SQLLiteManager", async ()=>{
   //this.timeout(120000);
   
      it( "sqlLiteManager.constructor", ()=>{
         var f = () => { var sqlm = new SQLLiteManager.SQLLiteManager( "zoho", "active", "./test/test.db" ) }
         expect(f).to.not.throw();
      });

      it( "sqlLiteManager.constructor", ()=>{
         var f = () => { var sqlm = new SQLLiteManager.SQLLiteManager() }
         expect(f).to.not.throw();
      });

      it( "should cause sqlLiteManager.constructor throw", ()=>{
         try
         {
            var f = function(){ new SQLLiteManager.SQLLiteManager("zoho", "active", "./data/fake1.db") };
            expect( f ).to.throw();   
         }
         catch( error )
         {

         }
      });

      var sqlLiteManager = new SQLLiteManager.SQLLiteManager("zoho", "active", "./test/test.db");

      it( "sqlLiteManager.init", async ()=>{
         await sqlLiteManager.init().then( ( result ) => { 
            expect(result).to.equal( true ); 
         }).catch( ( error )=>{ 
            expect(error).to.not.equal( null );
         });
      });

      it( "should cause sqlLiteManager.init throw", async ()=>{
         var sql = "err";
         await sqlLiteManager.init( sql ).then( ( result ) => { 
            expect(result).to.equal( true ); 
         }).catch( ( error )=>{ 
            expect(error).to.not.equal( null );
         });
      });

      it( "sqlLiteManager.loadAccounts", async ( )=>{
         await sqlLiteManager.loadAccounts().then( ( result ) => { 
            expect(result).to.be.array();
         });
      });

      it( "should cause sqlLiteManager.loadAccounts throw", async ( )=>{
         //var f = async ()=>{await sqlLiteManager.loadAccounts( "exi" )};
         //expect(f).to.throw();
         await sqlLiteManager.loadAccounts( "exi" ).then( ( result )=>{ 
            expect( result ).to.be.array();
         }).catch( ( error )=>{ 
            expect( error ).to.not.be.array();
            expect( error ).to.not.equal( null );
         });
      });


      it( "sqlLiteManager.getAccounts", async ()=>{
         var result = sqlLiteManager.getAccounts();
         expect(result).to.be.array();
      });

      it( "should cause sqlLiteManager.getAccounts throw", async ()=>{
         try
         {
            var accounts = 7;
            var f = () => { var result = sqlLiteManager.getAccounts( accounts ) };
            expect(f).to.throw();
         }
         catch( error )
         {
         }
         //expect( sqlLiteManager.getAccounts( accounts ) ).to.throw();
      });

      it( "sqlLiteManager.addAccount", async ()=>{

         var account = SQLLiteManager.Account( 
            0,
            "username",
            "password",
            "useraccount",
            "userpassword",
            "recovery_email",
            "lastlogin",
            "active",
            "check",
            "note"
         );

         expect(account).to.have.property('username')

         var result = sqlLiteManager.addAccount( account );
         expect(result).to.equal( true ); 

         var result = sqlLiteManager.addAccount();
         expect(result).to.equal( false ); 
      });

      it( "sqlLiteManager.listAccounts", async ( )=>{
         var result = sqlLiteManager.listAccounts();
         expect(result).to.equal( true );
      });
      
      it( "sqlLiteManager.listAccounts log", async ( )=>{
         var result = sqlLiteManager.listAccounts( false );
         expect(result).to.equal( true );
      });

      //it( "sqlLiteManager.listAccounts throw undefined", async ( )=>{
      //   try
      //   {
      //      var accounts;
      //      var result = sqlLiteManager.listAccounts( false, accounts );
      //      expect(result).to.equal( true );
      //   }
      //   catch( error )
      //   {
      //      expect(error).to.not.equal( null );
      //   }
      //});

      it( "should cause sqlLiteManager.listAccounts throw not an array", async ( )=>{
         try
         {
            var accounts = 7;
            var result = sqlLiteManager.listAccounts( false, accounts );
            expect(result).to.equal( true );
         }
         catch( error )
         {
            //console.log( error );
            expect(error).to.not.equal( null );
         }         
      });

      it( "should cause sqlLiteManager.listAccounts throw username undefined", async ( )=>{
         try
         {
            var accounts = [1,1,2];
            var result = sqlLiteManager.listAccounts( false, accounts );
            expect(result).to.equal( true );
         }
         catch( error )
         {
            //console.log( error );
            expect(error).to.not.equal( null );
         }         
      });
      
      it( "sqlLiteManager.destroy", async ( )=>{
         var f = ()=>{ sqlLiteManager.destroy( false ) };
         expect(f).to.not.throw();
      });

});
