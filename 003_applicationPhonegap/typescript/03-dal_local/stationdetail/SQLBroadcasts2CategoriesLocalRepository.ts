/// <reference path="../../02-business/contracts/stationdetail/IBroadcasts2CategoriesLocalRepository.ts"/>
/// <reference path="../../02-business/entities/stationdetail/Broadcasts2CategoriesEntity.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.stationdetail
{
    import entities = freeradios.business.entities.stationdetail;
    
    export class SQLBroadcasts2CategoriesLocalRepository extends BaseSQLRepository implements business.contracts.stationdetail.IBroadcasts2CategoriesLocalRepository
    {
        public saveConnectionsArray(connections : Array<entities.Broadcasts2CategoriesEntity>, callback : (success : boolean) => any)
        {
            this.getContext().beginTransaction();
            
            for (var i = 0, length = connections.length; i < length; ++i)
            {
                this.saveConnection(connections[i], function(success : boolean) {});
            }
            
            this.getContext().commitTransaction(function(success : boolean) 
            {
                callback(success);
            });
        }    
        
        public saveConnection(connection : entities.Broadcasts2CategoriesEntity, callback : (success : boolean) => any)
        {
            if (isNaN(connection.broadcastsID) || isNaN(connection.stationID) || isNaN(connection.categoriesID))
            {
                return;
            }
            
            var query = "INSERT INTO broadcasts_categories "
                        + "(broadcasts_categories_stations_id, broadcasts_categories_broadcasts_id, broadcasts_categories_categories_id) VALUES "
                        + "(:STATIONSID, :BROADCASTSID, :CATEGORYID);";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":BROADCASTSID", connection.broadcastsID);
            statement.bindValue(":STATIONSID", connection.stationID);
            statement.bindValue(":CATEGORYID", connection.categoriesID);
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)        
        {
            var statement = this.getContext().query("DELETE FROM broadcasts_categories WHERE broadcasts_categories_stations_id=:STATIONID;");
            statement.bindValue(":STATIONID", stationID);
            this.getContext().executeNonResults(statement, callback);
        }        
    }
}