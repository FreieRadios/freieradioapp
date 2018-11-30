/// <reference path="../../02-business/contracts/stationdetail/IBroadcastsLocalRepository.ts"/>
/// <reference path="../../02-business/entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../02-business/entities/favorites/BroadcastsFavoritesEntity.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>
/// <reference path="../../99-utilities/database/PreparedStatement.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.stationdetail
{
    import entities = freeradios.business.entities.stationdetail;
    
    export class SQLBroadcastsLocalRepository extends BaseSQLRepository implements business.contracts.stationdetail.IBroadcastsLocalRepository
    {
        public saveBroadcastsArray(broadcasts : Array<entities.BroadcastsEntity>, callback : (success : boolean) => any)
        {
            this.getContext().beginTransaction();
            
            for (var i = 0, length = broadcasts.length; i < length; ++i)
            {
                this.saveBroadcast(broadcasts[i], function(success : boolean) {});
            }
            
            this.getContext().commitTransaction(function(success : boolean) 
            {
                callback(success);
            });
        }
        
        public saveBroadcast(broadcast : entities.BroadcastsEntity, callback : (success : boolean) => any)
        {
            if (isNaN(broadcast.id) || isNaN(broadcast.stationID))
            {
                return;
            }
            
            var query = "INSERT INTO broadcasts "
                        + "(broadcasts_id, broadcasts_stations_id, broadcasts_title, broadcasts_description, broadcasts_is_favorite) VALUES "
                        + "(:BROADCASTID, :STATIONSID, :TITLE, :DESCRIPTION, :ISFAVORITE);";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":BROADCASTID", broadcast.id);
            statement.bindValue(":STATIONSID", broadcast.stationID);
            statement.bindValue(":TITLE", broadcast.title || "");
            statement.bindValue(":DESCRIPTION", broadcast.description || "");
            statement.bindValue(":ISFAVORITE", broadcast.isFavorite === true);
            
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public setIsFavorite(stationID : number, broadcastID : number, isFavorite : boolean, callback : (success : boolean) => any)
        {
            var query = "UPDATE broadcasts "
                        + "SET broadcasts_is_favorite=:ISFAVORITE WHERE "
                        + "broadcasts_id=:BROADCASTID AND broadcasts_stations_id=:STATIONSID;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":ISFAVORITE", isFavorite === true);
            statement.bindValue(":BROADCASTID", broadcastID);
            statement.bindValue(":STATIONSID", stationID);
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public reflagIsFavoriteFromBroadcastsFavorites(stationID : number, callback : (success : boolean) => any)
        {
            var query = "UPDATE broadcasts "
                        + "SET broadcasts_is_favorite='1' WHERE "
                        + "broadcasts_stations_id=:STATIONSID AND broadcasts_id IN ( "
                            + "SELECT broadcasts_favorites_broadcasts_id FROM broadcasts_favorites WHERE "
                            + "broadcasts_favorites_stations_id=:STATIONSID "
                        + ");";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", stationID);
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            var statement = this.getContext().query("DELETE FROM broadcasts WHERE broadcasts_stations_id=:STATIONID;");
            statement.bindValue(":STATIONID", stationID);
            this.getContext().executeNonResults(statement, callback);
        }
        
        public getListForFavorites(favorites : Array<business.entities.favorites.BroadcastsFavoritesEntity>, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
            if (favorites.length > 0)
            {
                var whereStatement = "";
                var stationIDs = new Array<number>();
                var broadcastsIDs = new Array<number>();
                
                for (var i = 0, length = favorites.length; i < length; ++i)
                {
                    var currentFavorite = favorites[i];
                    
                    if (whereStatement !== "")
                    {
                        whereStatement += " OR ";
                    }
                    
                    whereStatement += "(broadcasts.broadcasts_id=:BROADCASTSID" + i + " AND broadcasts.broadcasts_stations_id=:STATIONSID" + i + ")";
                    stationIDs[i] = currentFavorite.stationID;
                    broadcastsIDs[i] = currentFavorite.broadcastsID;
                }
                
                var query = "SELECT broadcasts.* FROM broadcasts JOIN broadcasts_favorites ON ( "
                            + "broadcasts_favorites.broadcasts_favorites_broadcasts_id = broadcasts.broadcasts_id "
                            + "AND broadcasts_favorites.broadcasts_favorites_stations_id = broadcasts.broadcasts_stations_id) "
                            + "WHERE " + whereStatement + " "
                            + "GROUP BY broadcasts_favorites.broadcasts_favorites_broadcasts_id, broadcasts_favorites.broadcasts_favorites_stations_id "
                            + "ORDER BY broadcasts.broadcasts_title COLLATE NOCASE;";
                
                var statement = this.getContext().query(query);
                
                for (var i = 0, length = favorites.length; i < length; ++i)
                {
                    statement.bindValue(":BROADCASTSID" + i, broadcastsIDs[i]);
                    statement.bindValue(":STATIONSID" + i, stationIDs[i]);
                }
                
                this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
            }
            else
            {
                callback([]);
            }
        }
        
        public getList(callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)        
        {
            var statement = this.getContext().query("SELECT * FROM broadcasts ORDER BY broadcasts_title COLLATE NOCASE;");
            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public getListByStationID(stationID : number, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM broadcasts WHERE broadcasts_stations_id=:STATIONSID ORDER BY broadcasts_title COLLATE NOCASE;");
            statement.bindValue(":STATIONSID", stationID);
            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public getSingle(stationID : number, broadcastID : number, callback : (broadcast : entities.BroadcastsEntity) => any)
        {
            var statement = this.getContext().query("SELECT * FROM broadcasts WHERE broadcasts_stations_id=:STATIONID AND broadcasts_id=:BROADCASTID LIMIT 1;");            
            statement.bindValue(":STATIONID", stationID);
            statement.bindValue(":BROADCASTID", broadcastID);
            this.getSingleWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public searchInTitleAndDescriptionAndCategories(searchText : string, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
            var query = "SELECT broadcasts.* FROM broadcasts "
                        + "JOIN broadcasts_categories ON ("
                        + "broadcasts.broadcasts_stations_id = broadcasts_categories.broadcasts_categories_stations_id "
                        + "AND broadcasts.broadcasts_id = broadcasts_categories.broadcasts_categories_broadcasts_id) "
                        + "JOIN categories ON (categories.category_id = broadcasts_categories.broadcasts_categories_categories_id) " 
                        + "WHERE broadcasts.broadcasts_title LIKE :BROADCASTSTITLE "
                        + "OR broadcasts.broadcasts_description LIKE :BROADCASTSDESCRIPTION "
                        + "OR categories.category_name LIKE :CATEGORYNAME "
                        + "ORDER BY broadcasts.broadcasts_title COLLATE NOCASE;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":BROADCASTSTITLE", "%" + searchText + "%");
            statement.bindValue(":BROADCASTSDESCRIPTION", "%" + searchText + "%");
            statement.bindValue(":CATEGORYNAME", "%" + searchText + "%");
            
            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public searchInTitleAndDescriptionAndCategoriesAndStationName(searchText : string, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
             var query = "SELECT broadcasts.* FROM broadcasts "
                        + "JOIN broadcasts_categories ON ("
                        + "broadcasts.broadcasts_stations_id = broadcasts_categories.broadcasts_categories_stations_id "
                        + "AND broadcasts.broadcasts_id = broadcasts_categories.broadcasts_categories_broadcasts_id) "
                        + "JOIN stations ON (stations.stations_id=broadcasts.broadcasts_stations_id) "
                        + "JOIN categories ON (categories.category_id = broadcasts_categories.broadcasts_categories_categories_id) " 
                        + "WHERE broadcasts.broadcasts_title LIKE :BROADCASTSTITLE "
                        + "OR broadcasts.broadcasts_description LIKE :BROADCASTSDESCRIPTION "
                        + "OR categories.category_name LIKE :CATEGORYNAME "
                        + "OR stations.stations_name LIKE :STATIONSNAME "
                        + "ORDER BY broadcasts.broadcasts_title COLLATE NOCASE;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":BROADCASTSTITLE", "%" + searchText + "%");
            statement.bindValue(":BROADCASTSDESCRIPTION", "%" + searchText + "%");
            statement.bindValue(":CATEGORYNAME", "%" + searchText + "%");
            statement.bindValue(":STATIONSNAME", "%" + searchText + "%");
            
            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public searchInTitleAndDescriptionAndCategoriesForStation(stationID : number, searchText : string, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
            var query = "SELECT broadcasts.* FROM broadcasts "
                        + "JOIN broadcasts_categories ON ("
                        + "broadcasts.broadcasts_stations_id = broadcasts_categories.broadcasts_categories_stations_id "
                        + "AND broadcasts.broadcasts_id = broadcasts_categories.broadcasts_categories_broadcasts_id) "
                        + "JOIN categories ON (categories.category_id = broadcasts_categories.broadcasts_categories_categories_id) " 
                        + "WHERE (broadcasts.broadcasts_title LIKE :BROADCASTSTITLE "
                        + "OR broadcasts.broadcasts_description LIKE :BROADCASTSDESCRIPTION "
                        + "OR categories.category_name LIKE :CATEGORYNAME) "
                        + "AND broadcasts.broadcasts_stations_id=:STATIONSID "
                        + "ORDER BY broadcasts.broadcasts_title COLLATE NOCASE";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":BROADCASTSTITLE", "%" + searchText + "%");
            statement.bindValue(":BROADCASTSDESCRIPTION", "%" + searchText + "%");
            statement.bindValue(":CATEGORYNAME", "%" + searchText + "%");
            statement.bindValue(":STATIONSID", stationID);
            
            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public searchInTitleAndDescriptionAndCategoriesFilteredByCategories(searchText : string, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
            if (categoryIDs.length < 1)
            {
                return this.searchInTitleAndDescriptionAndCategories(searchText, callback);
            }
            
            var query = "SELECT broadcasts.* FROM broadcasts "
                        + "JOIN broadcasts_categories ON ("
                        + "broadcasts.broadcasts_stations_id = broadcasts_categories.broadcasts_categories_stations_id "
                        + "AND broadcasts.broadcasts_id = broadcasts_categories.broadcasts_categories_broadcasts_id) "
                        + "JOIN categories ON (categories.category_id = broadcasts_categories.broadcasts_categories_categories_id) " 
                        + "WHERE (broadcasts.broadcasts_title LIKE :BROADCASTSTITLE "
                        + "OR broadcasts.broadcasts_description LIKE :BROADCASTSDESCRIPTION "
                        + "OR categories.category_name LIKE :CATEGORYNAME) "
                        + "AND categories.category_id IN (" + this._getCategoryInStatementWithPlaceholders(categoryIDs) +  ") "
                        + "ORDER BY broadcasts.broadcasts_title COLLATE NOCASE;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":BROADCASTSTITLE", "%" + searchText + "%");
            statement.bindValue(":BROADCASTSDESCRIPTION", "%" + searchText + "%");
            statement.bindValue(":CATEGORYNAME", "%" + searchText + "%");
            
            this._bindCategoryInStatementValues(statement, categoryIDs);
            
            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public searchInTitleAndDescriptionAndCategoriesFilteredByCategoriesForStation(stationID : number, searchText : string, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
            if (categoryIDs.length < 1)
            {
                return this.searchInTitleAndDescriptionAndCategoriesForStation(stationID, searchText, callback);
            }
            
            var query = "SELECT broadcasts.* FROM broadcasts "
                        + "JOIN broadcasts_categories ON ("
                        + "broadcasts.broadcasts_stations_id = broadcasts_categories.broadcasts_categories_stations_id "
                        + "AND broadcasts.broadcasts_id = broadcasts_categories.broadcasts_categories_broadcasts_id) "
                        + "JOIN categories ON (categories.category_id = broadcasts_categories.broadcasts_categories_categories_id) " 
                        + "WHERE (broadcasts.broadcasts_title LIKE :BROADCASTSTITLE "
                        + "OR broadcasts.broadcasts_description LIKE :BROADCASTSDESCRIPTION "
                        + "OR categories.category_name LIKE :CATEGORYNAME) "
                        + "AND categories.category_id IN (" + this._getCategoryInStatementWithPlaceholders(categoryIDs) +  ") "
                        + "AND broadcasts.broadcasts_stations_id=:STATIONSID "
                        + "ORDER BY broadcasts.broadcasts_title COLLATE NOCASE;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":BROADCASTSTITLE", "%" + searchText + "%");
            statement.bindValue(":BROADCASTSDESCRIPTION", "%" + searchText + "%");
            statement.bindValue(":CATEGORYNAME", "%" + searchText + "%");
            statement.bindValue(":STATIONSID", stationID);
            
            this._bindCategoryInStatementValues(statement, categoryIDs);
            
            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public getFilteredByCategories(categoryIDs : Array<number>, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
            if (categoryIDs.length < 1)
            {
                return this.getList(callback);
            }
            
            var query = "SELECT broadcasts.* FROM broadcasts "
                        + "JOIN broadcasts_categories ON ("
                        + "broadcasts.broadcasts_stations_id = broadcasts_categories.broadcasts_categories_stations_id "
                        + "AND broadcasts.broadcasts_id = broadcasts_categories.broadcasts_categories_broadcasts_id) "
                        + "JOIN categories ON (categories.category_id = broadcasts_categories.broadcasts_categories_categories_id) " 
                        + "WHERE categories.category_id IN (" + this._getCategoryInStatementWithPlaceholders(categoryIDs) +  ") "
                        + "ORDER BY broadcasts.broadcasts_title COLLATE NOCASE;";
            
            var statement = this.getContext().query(query);
            
            this._bindCategoryInStatementValues(statement, categoryIDs);

            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }
        
        public getFilteredByCategoriesForStation(stationID : number, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.BroadcastsEntity>) => any)
        {
            if (categoryIDs.length < 1)
            {
                return this.getListByStationID(stationID, callback);
            }
            
            var query = "SELECT broadcasts.* FROM broadcasts "
                        + "JOIN broadcasts_categories ON ("
                        + "broadcasts.broadcasts_stations_id = broadcasts_categories.broadcasts_categories_stations_id "
                        + "AND broadcasts.broadcasts_id = broadcasts_categories.broadcasts_categories_broadcasts_id) "
                        + "JOIN categories ON (categories.category_id = broadcasts_categories.broadcasts_categories_categories_id) " 
                        + "WHERE categories.category_id IN (" + this._getCategoryInStatementWithPlaceholders(categoryIDs) +  ") "
                        + "AND broadcasts.broadcasts_stations_id=:STATIONSID "
                        + "ORDER BY broadcasts.broadcasts_title COLLATE NOCASE;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", stationID);
            
            this._bindCategoryInStatementValues(statement, categoryIDs);
            
            this.getListWithStatement<entities.BroadcastsEntity>(statement, this._getBroadcastFromSQLResults, callback);
        }        
        
        private _getBroadcastFromSQLResults(results : utilities.database.ISQLResult) : entities.BroadcastsEntity
        {
            var broadcast = new entities.BroadcastsEntity();
            
            broadcast.id = parseInt(results.getValue("broadcasts_id"), 10);
            broadcast.stationID = parseInt(results.getValue("broadcasts_stations_id"), 10);            
            broadcast.title = results.getValue("broadcasts_title");
            broadcast.description = results.getValue("broadcasts_description");
            broadcast.isFavorite = results.getValue("broadcasts_is_favorite") === "1";
                        
            return broadcast;
        }
        
        private _getCategoryInStatementWithPlaceholders(categoryIDs : Array<number>) : string
        {
            var query = "";
            
            for (var i = 0, length = categoryIDs.length; i < length; ++i)
            {
                if (query !== "")
                {
                    query += ",";
                }
                
                query += ":CATEGORY" + i;
            }
            
            return query;
        }
        
        private _bindCategoryInStatementValues(statement : utilities.database.PreparedStatement, categoryIDs : Array<number>)
        {
            for (var i = 0, length = categoryIDs.length; i < length; ++i)
            {
                statement.bindValue(":CATEGORY" + i, categoryIDs[i]);   
            }
        }
    }
}   