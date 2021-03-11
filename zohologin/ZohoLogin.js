"use strict";

/**
 * @todo more testing, I think they are more ways to get puppeteer functions to throw errors but I havent really tested them
 */
class ZohoLogin
{
   /**
   * ZohoLogin
   * @constructor
   * @param {string} table_name - table containing the list of accounts with columns like "username|password|recoveryemail|active|...". select * from table where active = 1
   * @param {string} active_field - column in table that can be used to exclude rows if set to false. active = 1 include, active = 0 exclude
   * @param {string} sqlite_database_filename - filename of accounts database file. it expects an sqlite database file
   * @param {boolean} headless - puppeteer headless = true means no gui or headless = false means show the gui
   * @param {number} delay - how llong to wait after reaching the end of login sequence
   */
    constructor( table_name = "zoho", active_field = "active", sqlite_database_filename = "./data/accounts.db", headless = false, delay = 0 )
    {
                
        try
        {
            const fs = require('fs');
            if ( fs.existsSync(sqlite_database_filename) )
            {
                this.sqlite_database_filename = sqlite_database_filename;
            }
            else
            {
                throw "ZohoLogin.constructor: " + sqlite_database_filename + " does not exist";
            }
        }
        catch(error)
        {
            //console.error( "ZohoLogin.constructor:" + error );
            throw error;
        }
        
        this.table_name = table_name;
        this.active_field = active_field;
        this.sqlite_database_filename = sqlite_database_filename;
        this.headless = headless;
        this.delay = delay;
    }

   /**
    * init
    * Calls Async functions which cannot be called in constructor.
    * SQLLiteManager.init()
    * @param {object} SQLLiteManager - SQLLiteManager class require('./SQLLiteManager.js'). was included for testing purposes
    * @param {string} sql - select * from table_name where active = 1. This was included for testing purposes
    * @returns {promise} true on resolve, error on reject
    */
    async init( SQLLiteManager = require('./SQLLiteManager.js'), sql = null )
    {
        var return_value = new Promise( async (resolve, reject) => {

            if( SQLLiteManager == null )
            {
                return reject( new Error( "ZohoLogin.init SQLLiteManager null" ) );
            }
            else
            {
                //console.log( "ZohoLogin.init: should not reach here " + SQLLiteManager );

                this.sqlLiteManager = new SQLLiteManager.SQLLiteManager( this.table_name, this.active_field, this.sqlite_database_filename );
                await this.sqlLiteManager.init( sql ).then( async (result)=>{
                    return resolve( true );
                }).catch( (error)=>{
                    //throw new Error( "catch1: " + error );
                    return reject( new Error( "ZohoLogin.init: " + error ) );
                });
            }
        })
        .catch( (error)=>{
            //console.log( "catch2 ZohoLogin.init: -" + error );
            //throw new Error( error );
            throw new error;
        });

        return return_value;
    }

   /**
    * initBrowser
    * calls puppeteer.launch( options )
    * @param {array} options - puppeteer.launch( options ) - options = { headless: true, args: [ '--no-sandbox', '--disable-setuid-sandbox', '--start-maximized' ] }
    * @returns {promise} browser - browser = await puppeteer.launch( options ) on resolve, error on reject
    */
    async initBrowser( options = { headless: true, args: [ '--no-sandbox', '--disable-setuid-sandbox', '--start-maximized' ] } )
    {
        var return_value = new Promise( async (resolve, reject) => {

                const puppeteer = require('puppeteer');

                await puppeteer.launch( options ).then( ( browser )=>{ 
                    return resolve(browser);
                }).catch( (error)=>{
                    //console.log( "initBrowser catch1: " + error );
                    return reject( new Error( "initBrowser: " + error ) );
                });
        }).catch( (error)=>{ 
            //console.log( "initBrowser catch2: " + error );
            //reject( error );
            //throw new Error( error );
            throw error;
        });

        return return_value;
    }

   /**
    * initPage
    * creates a new incognitopage
    * @param {object} browser - browser = await puppeteer.launch( options )
    * @returns {promise} page - const context = await browser.createIncognitoBrowserContext(); on resolve
    *                    var page = await context.newPage();
    *                    error on reject
    * @todo refactor how to test browser.createIncognitoBrowserContext()
    */
    async initPage( browser )
    {
        var return_value = new Promise( async (resolve, reject) => {

            //var page;
            //if( browser.pages.length > 0 )
            //   page = browser[0];
            //else
            //   page = await browser.newPage();
                if( browser == null || browser == undefined || typeof browser.createIncognitoBrowserContext != "function" )
                   return reject( new Error( "browser null" ) );

                await browser.createIncognitoBrowserContext().then( async(context)=>{
                    var page = await context.newPage();
                    await page.setUserAgent('newUserAgent');
                    await page.setViewport({ width: 1640, height: 1040 });
    
                    return resolve(page);
                });//.catch( (error) =>{
                //   return reject( error );
                //});
        }).catch( (error)=>{ 
            //reject( error );
            //throw new Error( error );
            throw error;
        });

        return return_value;
    }

   /**
    * listAccounts
    * calls sqlLiteManager.listAccounts
    * @param {boolean} logaccount - if true call console.log( accounts[index]['username'] )
    * @param {object} accounts - const Account = Struct( "id", "username", "password", "useraccount", "userpassword", "recovery_email", "lastlogin", "active", "check", "note" );
    *                            var account1 = SQLLiteManager.Account();
    *                            var account2 = SQLLiteManager.Account();
    *                            accounts = new Array( account1, account2 );
    *                            was included for testing purposes
    * @returns {promise} this.sqlLiteManager.listAccounts( logaccount ) on resolve, error on reject
    */
   async listAccounts( logaccount = true, accounts = null )
   {
       var return_value = new Promise( async (resolve, reject) => {

           var result;
           try
           {
              if( accounts == null )
              {
                 //var result = this.sqlLiteManager.listAccounts( logaccount, accounts );
                 result = this.sqlLiteManager.listAccounts( logaccount );
              }
              else
              {
                 result = this.sqlLiteManager.listAccounts( logaccount, accounts );
              }
              return resolve(result);
           }
           catch( error )
           {
               return reject( new Error( "listAccounts: " + error ) );
           }
       })
       .catch( (error)=>{ 
           //console.log( "ZohoLogin.listAccounts: " + error );
           //throw new Error( error );
           throw error;
       });

       return return_value;
   }

   /**
    * getAccounts
    * @param {array} accounts - const Account = Struct( "id", "username", "password", "useraccount", "userpassword", "recovery_email", "lastlogin", "active", "check", "note" );
    *                           var account1 = SQLLiteManager.Account();
    *                           var account2 = SQLLiteManager.Account();
    *                           accounts = new Array( account1, account2 );
    *                           was included for testing purposes
    * @returns {promise} this.sqlLiteManager.getAccounts() if resolve, error on reject
    */
   async getAccounts( accounts = null )
   {
       var return_value = new Promise( async (resolve, reject) => {

           try
           {
               var accounts_result;

               if( accounts == null )
               {
                  accounts_result = this.sqlLiteManager.getAccounts();
                  this.accounts = accounts_result;
               }
               else
               {
                  //console.log( "ZohoLogin.getAccounts: accounts:" + accounts );
                  accounts_result = this.sqlLiteManager.getAccounts( accounts );
               }

               return resolve(accounts_result);
           }
           catch( error )
           {
               //console.log( "ZohoLogin.getAccounts: 1 " + error );
               return reject( error );
           }
       }).catch( (error)=>{ 
           //console.log( "ZohoLogin.getAccounts: 2 " + error );
           //throw new Error( error );
           throw error;
       });

       return return_value;
   }

   /**
    * login peforms a sequence of typing and button clicks to login to a zohomail account
    * @param {object} page - const context = await browser.createIncognitoBrowserContext();
    *               var page = await context.newPage();
    * @param {string} username - username / email address of the account to login to
    * @param {string} password - password of the account to login to
    * @param {string} recovery_email - recovery_email
    * @param {boolean} logusername - logusername
    * @param {string} login_url - default - "https://www.zoho.com/mail/"
    * @returns {promise} page if resolve, error on reject
    */
   async login( page, username, password, recovery_email, logusername = true, login_url = "https://www.zoho.com/mail/" )
   {
       var return_value = new Promise( async (resolve, reject) => {

        var mailBoxFound = false;

               if( page == null || page == undefined )
                  return reject( new Error( "ZohoLogin.login: page undefined" ) );

               //console.log( "ZohoLogin.login: login_url " + login_url );

               await page.goto( login_url ).then( async ()=>{
                   //await page.waitFor( 500 );
                   await page.waitFor("a[class='zgh-login']", { timeout: 1000 }).then( async ()=>{
                       await page.click("a[class='zgh-login']").then( async ()=>{

                        await page.waitFor("input[type='email']", { timeout: 5000 }).then( async ()=>{
                           await page.type("input[type='email']", username );
                        });
    
                        //await page.waitFor( 5000 );

                        await page.waitFor( "button[id='nextbtn']", { timeout: 1000 }).then( async ()=>{
                            await page.click("button[id='nextbtn']");
                        });
            
                        //await page.waitFor( 1000 );
    
                        try
                        {
                           await page.waitFor("div[class='fielderror errorlabel']", { timeout: 1000 });
                           return reject( "ZohoLogin.login: Incorrect Username: " + username );
                        }
                        catch( error )
                        {
                            //console.log( "ZohoLogin.login: fielderror not found" );
                        }
    
                        //await page.waitFor( 500 );
    
                        await page.waitFor("input[name='PASSWORD']", { timeout: 1000 });
                        await page.type("input[name='PASSWORD']", password );

                        try
                        {
                           await page.waitFor("div[class='fielderror']", { timeout: 1000 });
                           return reject( "ZohoLogin.login: Incorrect Password" );
                        }
                        catch( error )
                        {
                        }

                        //await page.waitFor( 5000 );
    
                        await page.waitFor("button[id='nextbtn']", { timeout: 1000 }).then( async ()=>{
                            await page.click("button[id='nextbtn']");
                        });
    
                        try
                        {
                           await page.waitFor("a[id='continueButton']", { timeout: 1000 });
                           await page.click("a[id='continueButton']");
                        }
                        catch( error )
                        {
                            //console.log( error );
                        }
    
                        try
                        {
                           await page.waitFor("input[id='mobileno']", { timeout: 1000 });
                           await page.type( "input[id='mobileno']", recovery_email, { timeout: 1000 });
                        }
                        catch( error )
                        {
                        }
    
                        try
                        {
                           await page.waitFor("a[id='updateButton']", { timeout: 1000 });
                           await page.click("a[id='updateButton']");
                        }
                        catch( error )
                        {
                        }
    
                        try
                        {
                           await page.waitFor("button[id='rmLaterBtn']", { timeout: 1000 });
                           await page.click("button[id='rmLaterBtn']");
                        }
                        catch( error )
                        {
                        }
            
                        /*
                        try
                        {
                           await page.waitFor("a[class='zicon-apps-mail']", { timeout: 1000 });
                           await page.click("a[class='zicon-apps-mail']");
                        }
                        catch( error )
                        {
                        }
                        */

                        try
                        {
                           await page.waitFor("span[class='zicon-apps-mail zicon-apps-96']", { timeout: 1000 });
                           await page.click("span[class='zicon-apps-mail zicon-apps-96']");
                        }
                        catch( error )
                        {
                        }

                        try
                        {
                           await page.waitFor("span[class='zmAppName']", { timeout: 1000 });
                           mailBoxFound = true;
                        }
                        catch( error )
                        {
                        }

                        try
                        {
                           await page.waitFor("input[value='Sign Out']", { timeout: 1000 });
                           await page.click("input[value='Sign Out']");
                        }
                        catch( error )
                        {
                        }
            
                        await page.waitFor( this.delay );
    
                       });
                    });

                    if( logusername )
                       console.log( "ZohoLogin.login: " + username + " ok" );
                    
                    //resolve(mailBoxFound);
                    return resolve(page);
                }).catch( (error)=> { 
                    //console.log( "ZohoLogin.login: 3 " + error );
                    return reject( error );
                });
       })
       .catch( (error)=>{ 
            //console.log( "ZohoLogin.login: " + error );
            //throw new Error( error );
            throw error;
       });

       return return_value;
   }

   /**
    * loginToAccounts
    * login to each account
    * @param {object} browser - browser = puppeteer.launch( options )
    * @param {boolean} logusername - if true login will concole.log( username )
    * @param {string} login_url - "https://www.zoho.com/mail/"
    * @returns {promise} true if resolve, error on reject
    */
    async loginToAccounts( browser, logusername = false, login_url = "https://www.zoho.com/mail/" )
    {

        var return_value = new Promise( async (resolve, reject) => {

                    var accounts = await this.getAccounts();
    
                    for( var i=0; i<accounts.length ; i++ )
                    {
                        //console.log( accounts[i]["username"] + " " + accounts[i]["password"]);
                        var page; 
                        await this.initPage( browser ).then( async ( result )=>{
                            page = result;
                            try
                            {
                                var result = await this.login( page, accounts[i]["username"], accounts[i]["password"], accounts[i]["recovery_email"], logusername, login_url );
                            }
                            catch( error )
                            {
                                console.log( "loginToAccounts: " + error );
                            }
    
                            //if( typeof page.close === 'function' )
                            //   await page.close();
                            await page.close();
                        }).catch( ( error )=>{
                            return reject( error );
                        });
                    }
        
                    return resolve(true);

        }).catch( (error)=>{ 
            //throw new Error( error );
            throw error;
        });

        return return_value;
    }

    /**
    * run
    * initBrowser then loginToAccounts then browser.close()
    * @param {boolean} headless = true
    * @param {string} login_url = default - "https://www.zoho.com/mail/", tests http://localhost:9090
    * @param {boolean} logusername = see login method if true will call console.log( username )
    * @param {string} executablePath - path to chromium executable - blank defaults to /node_modules/puppeteer/...
    * @returns {promise} true if resolve, error on reject
    */
    async run( headless = true, login_url = "https://www.zoho.com/mail/", logusername = false, executablePath = null, browser = null )
    {
        var return_value = new Promise( async (resolve, reject) => {

            var options;
            if( executablePath == null )
               options = { headless: headless,
                               args: [ '--no-sandbox', '--disable-setuid-sandbox', '--start-maximized' ] };
            else
               options = { headless: headless, 
                           executablePath: executablePath,
                               args: [ '--no-sandbox', '--disable-setuid-sandbox', '--start-maximized' ] };

            //var browser;
            await this.initBrowser( options ).then( async ( result )=>{
                if( browser == null )
                   browser = result;
                    await this.loginToAccounts( browser, logusername, login_url ).then( async ()=>{      
                        resolve(true);        
                    }).catch( ( error )=>{
                        reject( error );
                    });
                    //await browser.close();
                    await result.close();                   

            }).catch( (error)=>
            {
                //console.log( "run: catch0" + error );
                return reject( error );
            });

        }).catch( (error)=>{
            //console.log( "run: catch2" + error );
            //throw new Error( error );
            throw error;
        });

        return return_value;
    }

    /*
    * destroy
    */
    destroy()
    {
    }
}

module.exports = ZohoLogin;
