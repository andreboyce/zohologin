// https://stackoverflow.com/questions/502366/structs-in-javascript
const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}));
const Account = Struct( 
   "id",
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

class SQLLiteManager
   {
      /**
      * SQLLiteManager
      * wrapper class for sqlite3 which can manage sqlite files
      * @constructor
      * @param {string} table  - table to list default "zoho" - select * from table where field = 1
      * @param {string} field - column to determine if that record will be used active = 1 use, active = 0 do not use
      * @param {string} dbfile - path and file name of sqlite dabase. default "./data/accounts.db"
      * @param {enum} mode - sqlite fileopen mode default: require('sqlite3').OPEN_READONLY - sqlite3.Database( this.dbfile, mode, dbcallback )
      */
      constructor( table = "zoho", field = "active", dbfile = "./data/accounts.db", mode = require('sqlite3').OPEN_READONLY )
      {
            this.field    = field;
            this.table    = table;
            this.dbfile   = dbfile;
            this.accounts = new Array();
            this.sql      = "SELECT * FROM " + table + " where " + field + "=1";
   
            this.sqlite3 = require('sqlite3').verbose();

            function dbcallback( error )
            {
               if( error )
               {
                  console.log( "SQLLiteManager.constructor: " + error );
                  //throw error;
               }
            }

            //console.log( dbfile );

            this.db = new this.sqlite3.Database( this.dbfile, mode, dbcallback );
            //throw new Error( "error" );
   
            //this.db.run( "PRAGMA KEY = '123456'" );
            //this.db.run( "PRAGMA CIPHER = 'aes-128-cbc'" );
      }

      /**
      * init
      * Calls Async functions which cannot be called in constructor.
      * @param {string} sql - for testing purposes
      * @returns {promise} true success, Error on reject
      */
      async init( sql = null )
      {
         return new Promise( async (resolve, reject) =>
         {
            this.accounts = new Array();
            await this.loadAccounts( sql ).then( async ( rows )=>{
               //console.log( "should not be here" );
               return resolve( true  );
            }).catch( ( error )=> { 

               //console.log( "should be here" );
               //throw error;
               return reject( error  );
            });
         }).catch( (error)=>{
            throw error;
         });
      }

      /**
      * listAccounts
      * @param {boolean} logaccount - default true - if true will call console.log( id + ": " + account['username'] )
      * @param {array} accounts - default accounts = this.accounts - 
      * @todo test account for correct properties like account['username']
      */
      listAccounts( logaccount = true, accounts = this.accounts )
      {
            if( !Array.isArray( accounts ) )
            {
               //console.log( accounts );
               throw new Error( "SQLLiteManager.listAccounts accounts is not an array" );
            }

            var id = 0;
            this.accounts.forEach( (account)=>{ 


               //if( (typeof(account['username']) == 'undefined') )
               //   throw new Error( "SQLLiteManager.listAccounts account['username'] undefined" );

               if( logaccount )
                  console.log( id + ": " + account['username'] ); 
               id++;
            });
            return true;
      }

      /**
      * addAccount
      * @param {array} account
      * @returns {boolean} - true if added
      */
      addAccount( account )
      {
         //console.log( typeof account );
         if( account === undefined )
            return false;
         
         this.accounts.push( account );
         return true;
      }

      /**
      * getAccounts
      * @param {array} accounts - for testing purposes
      */
      getAccounts( accounts = this.accounts )
      {
         //if( ( typeof( accounts ) === 'undefined') )
         //   throw "SQLLiteManager.getAccounts accounts is undefined";

         if( !Array.isArray( accounts ) )
            throw new Error( "SQLLiteManager.getAccounts accounts is not an array" );

         return accounts;
      }

      /**
      * loadAccounts
      * @param {string} sql for testing purposes
      * @returns {promise} {array} rows - db.all( sql, params, (error, rows) => { return rows; }, Error on reject
      */
      async loadAccounts( sql )
      {
         return new Promise( async (resolve, reject) =>
         {
            if( sql == null )
               sql = this.sql;
            var params = [];

            //console.log(sql);

               this.db.all( sql, params, (error, rows) => {
                  if(error)
                  {
                     //console.log('loadAccounts: Error running sql: ' + sql + err );
                     //console.log(error);
                     //console.log( "loadAccounts: " + error );
                     //console.log( "hjyfcjfcx" );
                     return reject(error);
                     //throw error;
                  }
                  else
                  {
                     //console.log( "should not be here" );

                     var id = 0;
                     rows.forEach( (row) => {
   
                        var account = Account( 
                           row.id,
                           row.username,
                           row.password,
                           row.useraccount,
                           row.userpassword,
                           row.recovery_email,
                           row.lastlogin,
                           row.active,
                           row.check,
                           row.note
                        );
                        this.addAccount( account );
                        //console.log( "account: " + account );
                        id++;
                     });      
                     return resolve(rows);
                  }
               });

         }).catch( (error)=>{
            //console.log( "loadAccounts: 3 " + error );
            //throw new Error( error );
            throw error;
         });
      }

      /**
      * destroy 
      * calls db.close
      */
      destroy()
      {
         this.db.close();
      }
   }

module.exports = {
   SQLLiteManager : SQLLiteManager,
   Account : Account
}
