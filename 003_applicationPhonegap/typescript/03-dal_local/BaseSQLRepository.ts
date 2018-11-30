/// <reference path="../99-utilities/database/ISQLContext.ts"/>
/// <reference path="../99-utilities/di/DIContainer.ts"/>

module freeradios.dal_local
{
    import di = freeradios.utilities.di;
    
    export class BaseSQLRepository
    {
        private _context : utilities.database.ISQLContext;
        
        constructor(context? : utilities.database.ISQLContext)
        {
            this._context = di.DIContainer.get<freeradios.utilities.database.ISQLContext>(
                "freeradios.utilities.database.ISQLContext",
                context);            
        }
        
        public getContext() : utilities.database.ISQLContext
        {
            return this._context;
        }
        
        public getSingleWithStatement<TEntityType>(
            statement : utilities.database.PreparedStatement,
            entityFactory : (results : utilities.database.ISQLResult) => TEntityType, 
            callback : (resultEntity : TEntityType) => any)
        {
            statement.executeWithResults(function(results : utilities.database.ISQLResult)
            {
                if (results === null || !results.hasNext())
                {
                    callback(null);
                }
                else
                {
                    results.next();
                    callback(entityFactory(results));
                }
            });  
        }
        
        public getListWithStatement<TEntityType>(
            statement : utilities.database.PreparedStatement,
            entityFactory : (results : utilities.database.ISQLResult) => TEntityType, 
            callback : (entityArray : Array<TEntityType>) => any)
        {
            statement.executeWithResults(function(results : utilities.database.ISQLResult)
            {
                if (results === null)
                {
                    callback(null);
                }
                else
                {
                    var entityArray = new Array<TEntityType>();
                    
                    while (results.next())
                    {
                        entityArray.push(entityFactory(results));
                    }
                    
                    callback(entityArray);
                }
            });             
        }
    }
}