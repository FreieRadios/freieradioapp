/// <reference path="ISQLContext.ts"/>
/// <reference path="ISQLResult.ts"/>

module freeradios.utilities.database
{
    export class PreparedStatement
    {
        private _dbContext : ISQLContext;    
        private _query : string;
        private _bindings : {[key : string] : any};        
        
        constructor(dbContext : ISQLContext, query : string)
        {
            this._dbContext = dbContext;
            this._query = query;
            this._bindings = {};
        }
        
        public bindValue(key : string, value : any)
        {
            this._bindings[key] = value;
        }
        
        public parseQuery() : string
        {
            var parsedQuery = this._query;
            
            for (var key in this._bindings)
            {
                parsedQuery = parsedQuery.replace(key, this._dbContext.prepareValue(this._bindings[key]));
            }
            
            return parsedQuery;
        }
        
        public executeNonResults(callback : (success : boolean) => any)
        {
            this._dbContext.executeNonResults(this, callback);
        }
        
        public executeWithResults(callback : (result : ISQLResult) => any)
        {
            this._dbContext.executeWithResults(this, callback);
        }
    }
}