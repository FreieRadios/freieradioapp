/// <reference path="../../02-business/contracts/stationdetail/IMediaChannelsLocalRepository.ts"/>
/// <reference path="../../02-business/entities/stationdetail/MediaChannelsEntity.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.stationdetail
{
    import entities = freeradios.business.entities.stationdetail;
    
    export class SQLMediaChannelsLocalRepository extends BaseSQLRepository implements business.contracts.stationdetail.IMediaChannelsLocalRepository
    {
        public saveMediaChannelsArray(mediaChannels : Array<entities.MediaChannelsEntity>, callback : (success : boolean) => any)
        {
            this.getContext().beginTransaction();
            
            for (var i = 0, length = mediaChannels.length; i < length; ++i)
            {
                this.saveMediaChannel(mediaChannels[i], function(success : boolean) {});
            }
            
            this.getContext().commitTransaction(function(success : boolean) 
            {
                callback(success);
            });
        }
        
        public saveMediaChannel(mediaChannel : entities.MediaChannelsEntity, callback : (success : boolean) => any)
        {
            if (isNaN(mediaChannel.stationID))
            {
                return;
            }
            
            var query = "INSERT INTO mediachannels "
                        + "(mediachannels_stations_id, mediachannels_type, mediachannels_frequency, mediachannels_frequencyunit, mediachannels_city, mediachannels_operator, "
                        + "mediachannels_power, mediachannels_powerunit, mediachannels_rdsid, mediachannels_transmit_times_from, mediachannels_transmit_times_to, "
                        + "mediachannels_transmitter_location_latitude, mediachannels_transmitter_location_longitude, mediachannels_receptionarea) VALUES "
                        + "(:STATIONSID, :TYPE, :FREQUENCY, :FREQUENCYUNIT, :CITY, :OPERATOR, "
                        + ":POWER, :POWERUNIT, :RDSID, :TRANSMITTIMESFROM, :TRANSMITTIMESTO, "
                        + ":LATITUDE, :LONGITUDE, :RECEPTIONAREA);";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", mediaChannel.stationID);
            statement.bindValue(":TYPE", mediaChannel.type || "");
            statement.bindValue(":FREQUENCY", mediaChannel.frequency || "");
            statement.bindValue(":FREQUENCYUNIT", mediaChannel.frequencyUnit || "");
            statement.bindValue(":CITY", mediaChannel.city || "");
            statement.bindValue(":OPERATOR", mediaChannel.operator || "");
            statement.bindValue(":POWER", mediaChannel.power || "");
            statement.bindValue(":POWERUNIT", mediaChannel.powerUnit || "");
            statement.bindValue(":RDSID", mediaChannel.rdsid || "");
            statement.bindValue(":TRANSMITTIMESFROM", mediaChannel.transmitTimesFrom || "00:00");
            statement.bindValue(":TRANSMITTIMESTO", mediaChannel.transmitTimesTo || "00:00");
            statement.bindValue(":LATITUDE", mediaChannel.latitude || 0);
            statement.bindValue(":LONGITUDE", mediaChannel.longitude || 0);
            statement.bindValue(":RECEPTIONAREA", mediaChannel.transmitterReceptionArea || "");
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            var statement = this.getContext().query("DELETE FROM mediachannels WHERE mediachannels_stations_id=:STATIONID;");
            statement.bindValue(":STATIONID", stationID);
            this.getContext().executeNonResults(statement, callback);
        }
        
        public getList(callback : (mediaChannels : Array<entities.MediaChannelsEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM mediachannels ORDER BY mediachannels_stations_id;");
            this.getListWithStatement<entities.MediaChannelsEntity>(statement, this._getMediaChannelFromSQLResults, callback);
        }
        
        public getListByStationID(stationID : number, callback : (mediaChannels : Array<entities.MediaChannelsEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM mediachannels WHERE mediachannels_stations_id=:STATIONID;");
            statement.bindValue(":STATIONID", stationID);            
            this.getListWithStatement<entities.MediaChannelsEntity>(statement, this._getMediaChannelFromSQLResults, callback);
        }
        
        private _getMediaChannelFromSQLResults(results : utilities.database.ISQLResult) : entities.MediaChannelsEntity
        {
            var mediaChannel = new entities.MediaChannelsEntity();
            
            mediaChannel.stationID = parseInt(results.getValue("mediachannels_stations_id"), 10);            
            mediaChannel.type = results.getValue("mediachannels_type");            
            mediaChannel.frequency = results.getValue("mediachannels_frequency");
            mediaChannel.frequencyUnit = results.getValue("mediachannels_frequencyunit");
            mediaChannel.city = results.getValue("mediachannels_city");
            mediaChannel.operator = results.getValue("mediachannels_operator");
            mediaChannel.power = results.getValue("mediachannels_power");
            mediaChannel.powerUnit = results.getValue("mediachannels_powerunit");
            mediaChannel.rdsid = results.getValue("mediachannels_rdsid");
            mediaChannel.transmitTimesFrom = results.getValue("mediachannels_transmit_times_from");
            mediaChannel.transmitTimesTo = results.getValue("mediachannels_transmit_times_to");
            mediaChannel.latitude = parseFloat(results.getValue("mediachannels_transmitter_location_latitude"));
            mediaChannel.longitude = parseFloat(results.getValue("mediachannels_transmitter_location_longitude"));
            mediaChannel.transmitterReceptionArea = results.getValue("mediachannels_receptionarea");
            
            return mediaChannel;
        }
    }
}

