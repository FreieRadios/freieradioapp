/// <reference path="../../02-business/contracts/stationdetail/ITransmitTimesLocalRepository.ts"/>
/// <reference path="../../02-business/entities/stationdetail/TransmitTimesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/enums/TransmitTimesTimeType.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.stationdetail
{
    import entities = freeradios.business.entities.stationdetail;
    import enums = freeradios.business.entities.stationdetail.enums;
    
    export class SQLTransmitTimesLocalRepository extends BaseSQLRepository implements business.contracts.stationdetail.ITransmitTimesLocalRepository
    {
        public saveTransmitTimesArray(transmitTimes : Array<entities.TransmitTimesEntity>, callback : (success : boolean) => any)
        {
            this.getContext().beginTransaction();
            
            for (var i = 0, length = transmitTimes.length; i < length; ++i)
            {
                this.saveTransmitTime(transmitTimes[i], function(success : boolean) {});
            }
            
            this.getContext().commitTransaction(function(success : boolean) 
            {
                callback(success);
            });
        }
        
        public saveTransmitTime(transmitTime : entities.TransmitTimesEntity, callback : (success : boolean) => any)
        {
            if (isNaN(transmitTime.stationID) || isNaN(transmitTime.broadcastsID))
            {
                return;
            }
            
            var query = "INSERT INTO transmit_times "
                        + "(transmit_times_stations_id, transmit_times_broadcasts_id, transmit_times_recurrence, transmit_times_rerun, transmit_times_day, "
                        + "transmit_times_priority, transmit_times_time_from, transmit_times_time_to, transmit_times_week1, transmit_times_week2, "
                        + "transmit_times_week3, transmit_times_week4, transmit_times_week5, transmit_times_time_type, transmit_times_first_week, transmit_times_last_week, "
                        + "transmit_times_date_once_from, transmit_times_date_once_to) VALUES "
                        + "(:STATIONSID, :BROADCASTSID, :RECURRENCE, :RERUN, :DAY, "
                        + ":PRIORITY, :TIMEFROM, :TIMETO, :WEEK1, :WEEK2, "
                        + ":WEEK3, :WEEK4, :WEEK5, :TIMETYPE, :FIRSTWEEK, :LASTWEEK, "
                        + ":DATEONCEFROM, :DATEONCETO);";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", transmitTime.stationID);
            statement.bindValue(":BROADCASTSID", transmitTime.broadcastsID);
            statement.bindValue(":RECURRENCE", transmitTime.recurrence || false);
            statement.bindValue(":RERUN", transmitTime.rerun || false);
            statement.bindValue(":DAY", transmitTime.day || "");
            statement.bindValue(":PRIORITY", transmitTime.priority || 0);
            statement.bindValue(":TIMEFROM", transmitTime.timeFrom || "");
            statement.bindValue(":TIMETO", transmitTime.timeTo || "");
            statement.bindValue(":WEEK1", transmitTime.week1 || false);
            statement.bindValue(":WEEK2", transmitTime.week2 || false);
            statement.bindValue(":WEEK3", transmitTime.week3 || false);
            statement.bindValue(":WEEK4", transmitTime.week4 || false);
            statement.bindValue(":WEEK5", transmitTime.week5 || false);
            statement.bindValue(":TIMETYPE", transmitTime.timeType);
            statement.bindValue(":FIRSTWEEK", transmitTime.firstWeek || false);
            statement.bindValue(":LASTWEEK", transmitTime.lastWeek || false);
            statement.bindValue(":DATEONCEFROM", transmitTime.dateOnceFrom || "");
            statement.bindValue(":DATEONCETO", transmitTime.dateOnceTo || "");
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            var statement = this.getContext().query("DELETE FROM transmit_times WHERE transmit_times_stations_id=:STATIONID;");
            statement.bindValue(":STATIONID", stationID);
            this.getContext().executeNonResults(statement, callback);
        }
        
        public getList(callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            var statement = this.getContext().query("SELECT * FROM transmit_times ORDER BY transmit_times_stations_id, transmit_times_broadcasts_id;");
            this.getListWithStatement<entities.TransmitTimesEntity>(statement, this._getTransmitTimeFromSQLResults, callback);
        }
        
        public getListForDayAndBroadcasts(day : string, broadcasts : Array<entities.BroadcastsEntity>, callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            var bindings : {[name : string] : number} = {};
            var wherePart = "";
                        
            for (var i = 0, length = broadcasts.length; i < length; ++i)
            {
                var broadcast = broadcasts[i];
                
                if (wherePart !== "")
                {
                    wherePart += " OR ";
                }
                
                wherePart += "(transmit_times_stations_id=:STATIONID" + i + " AND transmit_times_broadcasts_id=:BROADCASTSID" + i + ")";
                bindings[":STATIONID" + i] = broadcast.stationID;
                bindings[":BROADCASTSID" + i] = broadcast.id;
            }
            
            var statement = this.getContext().query("SELECT * FROM transmit_times WHERE transmit_times_day=:TRANSMITTIMESDAY AND (" + wherePart + ") ORDER BY transmit_times_stations_id, transmit_times_broadcasts_id;");
            
            statement.bindValue(":TRANSMITTIMESDAY", day);
            
            for (var key in bindings)
            {
                statement.bindValue(key, bindings[key]);
            }            
            
            this.getListWithStatement<entities.TransmitTimesEntity>(statement, this._getTransmitTimeFromSQLResults, callback);
        }
        
        public getListByStationID(stationID : number, callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            var query = "SELECT * FROM transmit_times "
                        + "WHERE transmit_times_stations_id=:STATIONSID "
                        + "ORDER BY transmit_times_stations_id, transmit_times_broadcasts_id;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", stationID);
            
            this.getListWithStatement<entities.TransmitTimesEntity>(statement, this._getTransmitTimeFromSQLResults, callback);
        }
        
        public getListByStationIDAndBroadcastID(stationID : number, broadcastID : number, callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            var query = "SELECT * FROM transmit_times "
                        + "WHERE transmit_times_stations_id=:STATIONSID "
                        + "AND transmit_times_broadcasts_id=:BROADCASTSID "
                        + "ORDER BY transmit_times_stations_id, transmit_times_broadcasts_id;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", stationID);
            statement.bindValue(":BROADCASTSID", broadcastID);
            
            this.getListWithStatement<entities.TransmitTimesEntity>(statement, this._getTransmitTimeFromSQLResults, callback);
        }
        
        private _getTransmitTimeFromSQLResults(results : utilities.database.ISQLResult) : entities.TransmitTimesEntity
        {
            var transmitTime = new entities.TransmitTimesEntity();
            
            transmitTime.stationID = parseInt(results.getValue("transmit_times_stations_id"), 10);
            transmitTime.broadcastsID = parseInt(results.getValue("transmit_times_broadcasts_id"), 10);            
            transmitTime.recurrence = results.getValue("transmit_times_recurrence") === "1";
            transmitTime.rerun = results.getValue("transmit_times_rerun") === "1";
            transmitTime.day = results.getValue("transmit_times_day");
            transmitTime.priority = parseInt(results.getValue("transmit_times_priority"), 10);
            transmitTime.timeFrom = results.getValue("transmit_times_time_from");
            transmitTime.timeTo = results.getValue("transmit_times_time_to");
            transmitTime.week1 = results.getValue("transmit_times_week1") === "1";
            transmitTime.week2 = results.getValue("transmit_times_week2") === "1";
            transmitTime.week3 = results.getValue("transmit_times_week3") === "1";
            transmitTime.week4 = results.getValue("transmit_times_week4") === "1";
            transmitTime.week5 = results.getValue("transmit_times_week5") === "1";
            transmitTime.firstWeek = results.getValue("transmit_times_first_week") === "1";
            transmitTime.lastWeek = results.getValue("transmit_times_last_week") === "1";
            transmitTime.dateOnceFrom = results.getValue("transmit_times_date_once_from");
            transmitTime.dateOnceTo = results.getValue("transmit_times_date_once_to");
            
            if (transmitTime.timeFrom.charAt(0) == ":")
            {
                transmitTime.timeFrom = "00" + results.getValue("transmit_times_time_from");
            }
            if (transmitTime.timeTo.charAt(0) == ":")
            {
                transmitTime.timeTo = "00" + results.getValue("transmit_times_time_to");
            }
            switch (results.getValue("transmit_times_time_type"))
            {
                case "1" : transmitTime.timeType = enums.TransmitTimesTimeType.weekOfMonth; break;
                case "2" : transmitTime.timeType = enums.TransmitTimesTimeType.daily; break;
                case "3" : transmitTime.timeType = enums.TransmitTimesTimeType.once; break;
                default : transmitTime.timeType = enums.TransmitTimesTimeType.weekly;
            }
                        
            return transmitTime;
        }
    }
}