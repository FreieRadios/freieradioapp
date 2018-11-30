/// <reference path="../../02-business/contracts/favorites/IBroadcastsFavoritesLocalRepository.ts"/>
/// <reference path="../../02-business/entities/favorites/BroadcastsFavoritesEntity.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.favorites
{
    import entities = freeradios.business.entities.favorites;
    
    export class SQLFavoritesLocalRepository extends BaseSQLRepository implements business.contracts.favorites.IBroadcastsFavoritesLocalRepository
    {  
        public saveBroadcastFavorite(favorite : entities.BroadcastsFavoritesEntity, callback : (success : boolean) => any)
        {
            if (isNaN(favorite.stationID) || isNaN(favorite.broadcastsID))
            {
                return;
            }
            
            var query = "INSERT INTO broadcasts_favorites "
                        + "(broadcasts_favorites_stations_id, broadcasts_favorites_broadcasts_id) VALUES "
                        + "(:STATIONSID, :BROADCASTSID);";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", favorite.stationID);
            statement.bindValue(":BROADCASTSID", favorite.broadcastsID);            
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public deleteBroadcastFavorite(favorite : entities.BroadcastsFavoritesEntity, callback : (success : boolean) => any)
        {
            var query = "DELETE FROM broadcasts_favorites "
                        + "WHERE broadcasts_favorites_stations_id=:STATIONSID "
                        + "AND broadcasts_favorites_broadcasts_id=:BROADCASTSID;";                     
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", favorite.stationID);
            statement.bindValue(":BROADCASTSID", favorite.broadcastsID);            
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public getList(callback : (favorites : Array<entities.BroadcastsFavoritesEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM broadcasts_favorites GROUP BY broadcasts_favorites_stations_id, broadcasts_favorites_broadcasts_id;");
            this.getListWithStatement<entities.BroadcastsFavoritesEntity>(statement, this._getFavoriteFromSQLResults, callback);
        }
        
        public getListForStation(stationID : number, callback : (favorites : Array<entities.BroadcastsFavoritesEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM broadcasts_favorites WHERE broadcasts_favorites_stations_id=:STATIONSID GROUP BY broadcasts_favorites_stations_id, broadcasts_favorites_broadcasts_id;");
            statement.bindValue(":STATIONSID", stationID);
            this.getListWithStatement<entities.BroadcastsFavoritesEntity>(statement, this._getFavoriteFromSQLResults, callback);
        }                
        
        private _getFavoriteFromSQLResults(results : utilities.database.ISQLResult) : entities.BroadcastsFavoritesEntity
        {
            var favorite = new entities.BroadcastsFavoritesEntity();
            
            favorite.broadcastsID = parseInt(results.getValue("broadcasts_favorites_broadcasts_id"), 10);
            favorite.stationID = parseInt(results.getValue("broadcasts_favorites_stations_id"), 10);
                        
            return favorite;        
        }
    }
}