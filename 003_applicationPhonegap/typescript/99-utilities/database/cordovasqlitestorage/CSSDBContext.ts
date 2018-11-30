/// <reference path="../ISQLContext.ts"/>
/// <reference path="../ISQLResult.ts"/>
/// <reference path="../PreparedStatement.ts"/>

/// <reference path="CSSDBResult.ts"/>

interface Window
{
    sqlitePlugin : any;
}

module freeradios.utilities.database.cordovasqlitestorage
{
    // Module: https://github.com/litehelpers/Cordova-sqlite-storage
    
    export class CSSDBContext implements ISQLContext
    {
        private static _db : any;
        private _lastInsertID : number;
        private _inTransaction : boolean;        
        
        private _statements : Array<PreparedStatement>;
        
        constructor(databaseFileName : string)
        {
            CSSDBContext._db = window.sqlitePlugin.openDatabase({name: databaseFileName, location: 'default', createFromLocation: 1});            
            this._lastInsertID = -1;            
            this._inTransaction = false;
            this._statements = [];
        }
        
        public open()
        {
        }
        
        public close()
        {
            // "close" is not available in the used module
        }
        
        public query(query : string) : PreparedStatement
        {
            return new PreparedStatement(this, query);
        }
        
        public beginTransaction()
        {
            this._statements = [];
            this._inTransaction = true;            
        }
    
        public commitTransaction(callback : (success : boolean) => any)
        {
            (function(self : CSSDBContext)
            {
                CSSDBContext._db.transaction(function(tx) 
                {
                    self._transactionNextStatement(tx, self._statements, 0, self._statements.length, function()
                    {
                        self._statements = [];
                        self._inTransaction = false;
                        callback(true);
                    });
                }, function(e : Error)
                {
                    self._statements = [];
                    self._inTransaction = false;
                    callback(false);
                    throw e;                    
                });                
            }(this));
        }
        
        public executeNonResults(statement : PreparedStatement, callback : (success : boolean) => any)
        {
            if (this._inTransaction)
            {
                this._statements.push(statement);
            }
            else
            {
                var query = statement.parseQuery();
                
                (function(self : CSSDBContext)
                {
                    CSSDBContext._db.transaction(function(tx) 
                    {
                        tx.executeSql(query, [], function(tx, res) 
                        {
                            if (res.insertId && res.insertId > 0)
                            {
                                self._lastInsertID = res.insertId;
                            }
                        
                            callback(true); 
                        });                
                    }, function(e : Error)
                    {
                        callback(false);
                        throw e;                        
                    })
                }(this));
           }
        }
        
        public executeWithResults(statement : PreparedStatement, callback : (result : ISQLResult) => any)
        {
            var query = statement.parseQuery();
            
            (function(self : CSSDBContext)
            {
                CSSDBContext._db.transaction(function(tx) 
                {
                    tx.executeSql(query, [], function(tx, res) 
                    {
                        callback(new CSSDBResult(res));    
                    });                
                }, function(e : Error)
                {                  
                    callback(null);
                    throw e;                    
                })
            }(this));
        }
        
        public lastRowID() : number
        {
            return this._lastInsertID;
        }
        
        public prepareValue(value : any) : string
        {
            var valueType = typeof value;
            
            switch(valueType)
            {
                case "string" :
                    return "'" + String(value).replace(/'/g, "''") + "'";                
                case "number" :
                    return value;
                case "boolean":
                    return value === true ? "1" : "0";
                default :
                    if (value instanceof Date)
                    {
                         return "'" + String(value).replace(/'/g, "''") + "'";   
                    }
                    else
                    {                        
                        return "'" + JSON.stringify(value) + "'";
                    }
            }
        }
        
        private _transactionNextStatement(tx : any, statements : Array<PreparedStatement>, index : number, length : number, callback : () => any)
        {
            if (index >= length)
            {
                callback();
            }
            else
            {
                var query = statements[index].parseQuery();
                
                (function(self : CSSDBContext)
                {
                    tx.executeSql(query, [], function(tx, res) 
                    {
                        if (res.insertId && res.insertId > 0)
                        {
                            self._lastInsertID = res.insertId;
                        }
                        
                        self._transactionNextStatement(tx, statements, index + 1, length, callback);
                    });
                }(this));
           } 
        }
    }
}