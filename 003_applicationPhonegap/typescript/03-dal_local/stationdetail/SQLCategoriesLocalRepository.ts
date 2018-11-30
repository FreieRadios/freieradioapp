/// <reference path="../../02-business/contracts/stationdetail/ICategoriesLocalRepository.ts"/>
/// <reference path="../../02-business/entities/stationdetail/CategoriesEntity.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.stationdetail
{
    import entities = freeradios.business.entities.stationdetail;
    
    export class SQLCategoriesLocalRepository extends BaseSQLRepository implements business.contracts.stationdetail.ICategoriesLocalRepository
    {
        public getCategoryList(callback : (categories : Array<entities.CategoriesEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM categories ORDER BY category_name COLLATE NOCASE;");
            this.getListWithStatement<entities.CategoriesEntity>(statement, this._getCategoryFromSQLResults, callback);
        }
        
        public getSingle(id : number, callback : (category : entities.CategoriesEntity) => any)
        {
            var statement = this.getContext().query("SELECT * FROM categories WHERE category_id=:CATEGORYID LIMIT 1;");
            statement.bindValue(":CATEGORYID", id);
            this.getSingleWithStatement<entities.CategoriesEntity>(statement, this._getCategoryFromSQLResults, callback);
        }
        
        public getSingleByName(name : string, callback : (category : entities.CategoriesEntity) => any)
        {
            var statement = this.getContext().query("SELECT * FROM categories WHERE category_name=:CATEGORYNAME LIMIT 1;");
            statement.bindValue(":CATEGORYNAME", name);
            this.getSingleWithStatement<entities.CategoriesEntity>(statement, this._getCategoryFromSQLResults, callback);
        }
        
        public getForBroadcast(stationID : number, broadcastID : number, callback : (categories : Array<entities.CategoriesEntity>) => any)
        {
            var query = "SELECT categories.* "
                        + "FROM categories "
                        + "JOIN broadcasts_categories ON (broadcasts_categories.broadcasts_categories_categories_id = categories.category_id) "
                        + "WHERE broadcasts_categories.broadcasts_categories_stations_id = :STATIONSID "
                        + "AND broadcasts_categories.broadcasts_categories_broadcasts_id = :BROADCASTSID "
                        + "GROUP BY categories.category_id "
                        + "ORDER BY categories.category_name COLLATE NOCASE;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", stationID);
            statement.bindValue(":BROADCASTSID", broadcastID);
            
            this.getListWithStatement<entities.CategoriesEntity>(statement, this._getCategoryFromSQLResults, callback);           
        }
        
        private _getCategoryFromSQLResults(results : utilities.database.ISQLResult) : entities.CategoriesEntity
        {
            var category = new entities.CategoriesEntity();
            
            category.id = parseInt(results.getValue("category_id"), 10);
            category.name = results.getValue("category_name");
                        
            return category;
        }
    }
}