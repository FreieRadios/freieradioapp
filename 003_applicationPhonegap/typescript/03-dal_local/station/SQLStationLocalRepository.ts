/// <reference path="../../02-business/contracts/station/IStationLocalRepository.ts"/>
/// <reference path="../../02-business/entities/station/StationEntity.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.station
{
    import entities = freeradios.business.entities.station;
    
    export class SQLStationLocalRepository extends BaseSQLRepository implements business.contracts.station.IStationLocalRepository
    {   
        public saveStationArray(stations : Array<entities.StationEntity>, callback : (success : boolean) => any)
        {
            this.getContext().beginTransaction();
            
            for (var i = 0, length = stations.length; i < length; ++i)
            {
                this.saveStation(stations[i], function(success : boolean) {});
            }
            
            this.getContext().commitTransaction(function(success : boolean) 
            {
                callback(success);
            });
        }
        
        public saveStation(station : entities.StationEntity, callback : (success : boolean) => any)
        {
            if (isNaN(station.id))
            {
                return;
            }
            
            var query = "INSERT INTO stations "
                        + "(stations_id, stations_lastupdate, stations_name, stations_city, stations_xmluri, stations_frequency, stations_latitude, stations_longitude, stations_streamurl) VALUES "
                        + "(:STATIONSID, :STATIONSLASTUPDATE, :STATIONSNAME, :STATIONSCITY, :STATIONSXMLURI, :STATIONSFREQUENCY, :STATIONSLATITUDE, :STATIONSLONGITUDE, :STATIONSSTREAMURL);";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", station.id);
            statement.bindValue(":STATIONSLASTUPDATE", station.lastUpdate || new Date(0));
            statement.bindValue(":STATIONSNAME", station.name || "");
            statement.bindValue(":STATIONSCITY", station.city || "");
            statement.bindValue(":STATIONSXMLURI", station.xmlURI || "");
            statement.bindValue(":STATIONSFREQUENCY", station.frequency || "");
            statement.bindValue(":STATIONSLATITUDE", station.latitude || 0);
            statement.bindValue(":STATIONSLONGITUDE", station.longitude || 0);
            statement.bindValue(":STATIONSSTREAMURL", station.streamURL || "");
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public deleteAll(callback : (success : boolean) => any)
        {
            var statement = this.getContext().query("DELETE FROM stations WHERE 1;");
            this.getContext().executeNonResults(statement, callback);
        }
        
        public getByID(id : number, callback : (station: entities.StationEntity) => any)
        {
            var statement = this.getContext().query("SELECT * FROM stations WHERE stations_id=:STATIONSID;");
            statement.bindValue(":STATIONSID", id);
            this.getSingleWithStatement<entities.StationEntity>(statement, this._getStationFromSQLResults, callback);
        }
        
        public getStationList(callback : (stations: Array<entities.StationEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM stations ORDER BY stations_name COLLATE NOCASE;");
            this.getListWithStatement<entities.StationEntity>(statement, this._getStationFromSQLResults, callback);            
        }
        
        public searchInNameAndCity(searchText : string, callback : (stations: Array<entities.StationEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM stations WHERE stations_name LIKE :STATIONSNAME OR stations_city LIKE :STATIONSCITY ORDER BY stations_name COLLATE NOCASE;");
            
            statement.bindValue(":STATIONSNAME", "%" + searchText + "%");
            statement.bindValue(":STATIONSCITY", "%" + searchText + "%");
         
            this.getListWithStatement<entities.StationEntity>(statement, this._getStationFromSQLResults, callback);
        }               
        
        private _getStationFromSQLResults(results : utilities.database.ISQLResult) : entities.StationEntity
        {
            var station = new entities.StationEntity();
            
            station.id = parseInt(results.getValue("stations_id"), 10);
            station.lastUpdate = new Date(results.getValue("stations_lastupdate"));
            station.name = results.getValue("stations_name");
            station.city = results.getValue("stations_city");
            station.xmlURI = results.getValue("stations_xmluri");
            station.frequency = results.getValue("stations_frequency");
            station.latitude = parseFloat(results.getValue("stations_latitude"));
            station.longitude = parseFloat(results.getValue("stations_longitude"));
            station.streamURL = results.getValue("stations_streamurl");
            
            return station;
        }
    }
}