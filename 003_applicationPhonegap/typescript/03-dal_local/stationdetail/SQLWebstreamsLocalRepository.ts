/// <reference path="../../02-business/contracts/stationdetail/IWebstreamsLocalRepository.ts"/>
/// <reference path="../../02-business/entities/stationdetail/WebstreamsEntity.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.stationdetail
{
    import entities = freeradios.business.entities.stationdetail;
    
    export class SQLWebstreamsLocalRepository extends BaseSQLRepository implements business.contracts.stationdetail.IWebstreamsLocalRepository
    {   
        public saveWebstreamsArray(webstreams : Array<entities.WebstreamsEntity>, callback : (success : boolean) => any)
        {
            this.getContext().beginTransaction();
            
            for (var i = 0, length = webstreams.length; i < length; ++i)
            {
                this.saveWebstream(webstreams[i], function(success : boolean) {});
            }
            
            this.getContext().commitTransaction(function(success : boolean) 
            {
                callback(success);
            });
        }
        
        public saveWebstream(webstream : entities.WebstreamsEntity, callback : (success : boolean) => any)
        {
            if (isNaN(webstream.stationID))
            {
                return;
            }
            
            var query = "INSERT INTO webstreams "
                        + "(webstreams_stations_id, webstreams_transmit_times_from, webstreams_transmit_times_to, webstreams_url, webstreams_format, webstreams_quality) VALUES "
                        + "(:STATIONSID, :TRANSMITTIMESFROM, :TRANSMITTIMESTO, :URL, :FORMAT, :QUALITY);";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", webstream.stationID);
            statement.bindValue(":TRANSMITTIMESFROM", webstream.transmitTimesFrom || "");
            statement.bindValue(":TRANSMITTIMESTO", webstream.transmitTimesTo || "");
            statement.bindValue(":URL", webstream.url || "");
            statement.bindValue(":FORMAT", webstream.format || "");
            statement.bindValue(":QUALITY", webstream.quality || "");
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            var statement = this.getContext().query("DELETE FROM webstreams WHERE webstreams_stations_id=:STATIONID;");
            statement.bindValue(":STATIONID", stationID);
            this.getContext().executeNonResults(statement, callback);
        }
        
        public getList(callback : (webstreams : Array<entities.WebstreamsEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM webstreams ORDER BY webstreams_stations_id;");
            this.getListWithStatement<entities.WebstreamsEntity>(statement, this._getWebstreamFromSQLResults, callback);
        }
        
        public getListByStationID(stationID : number, callback : (webstreams : Array<entities.WebstreamsEntity>) => any)        
        {
            var statement = this.getContext().query("SELECT * FROM webstreams WHERE webstreams_stations_id=:STATIONID;");
            statement.bindValue(":STATIONID", stationID);            
            this.getListWithStatement<entities.WebstreamsEntity>(statement, this._getWebstreamFromSQLResults, callback);
        }
        
        private _getWebstreamFromSQLResults(results : utilities.database.ISQLResult) : entities.WebstreamsEntity
        {
            var webstream = new entities.WebstreamsEntity();
            
            webstream.stationID = parseInt(results.getValue("webstreams_stations_id"), 10);            
            webstream.transmitTimesFrom = results.getValue("webstreams_transmit_times_from");
            webstream.transmitTimesTo = results.getValue("webstreams_transmit_times_to");
            webstream.url = results.getValue("webstreams_url");
            webstream.format = results.getValue("webstreams_format");
            webstream.quality = results.getValue("webstreams_quality");
            
            return webstream;
        }
    }
}