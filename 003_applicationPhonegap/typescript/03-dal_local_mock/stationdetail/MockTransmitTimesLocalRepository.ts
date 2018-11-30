/// <reference path="../../02-business/entities/stationdetail/TransmitTimesEntity.ts"/>
/// <reference path="../../02-business/contracts/stationdetail/ITransmitTimesLocalRepository.ts"/>

module freeradios.dal_local_mock.stationdetail
{
    import entities = business.entities.stationdetail;
    
    export class MockTransmitTimeslLocalRepository implements business.contracts.stationdetail.ITransmitTimesLocalRepository
    {   
        private static _baseList : Array<entities.TransmitTimesEntity> =
        [
            {
                stationID : 0, broadcastsID : 1, recurrence : true, rerun : false, day : "DO", priority : 0, timeFrom : "03:00:00", timeTo : "04:00:00", 
                week1 : true, week2 : true, week3 : true, week4 : true, week5 : true, firstWeek : false, lastWeek : false, timeType : entities.enums.TransmitTimesTimeType.weekly,
                dateOnceFrom : "", dateOnceTo : ""
            },
            {
                stationID : 1, broadcastsID : 7, recurrence : true, rerun : false, day : "MO", priority : 0, timeFrom : "08:00:00", timeTo : "19:00:00", 
                week1 : true, week2 : true, week3 : true, week4 : true, week5 : true, firstWeek : false, lastWeek : false, timeType : entities.enums.TransmitTimesTimeType.weekOfMonth,
                dateOnceFrom : "", dateOnceTo : ""
            },
            {
                stationID : 2, broadcastsID : 3, recurrence : true, rerun : false, day : "MO", priority : 0, timeFrom : "08:00:00", timeTo : "19:00:00", 
                week1 : true, week2 : true, week3 : true, week4 : true, week5 : true, firstWeek : false, lastWeek : false, timeType : entities.enums.TransmitTimesTimeType.weekly,
                dateOnceFrom : "", dateOnceTo : ""
            }
        ];
        
        public saveTransmitTimesArray(transmitTimes : Array<entities.TransmitTimesEntity>, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public saveTransmitTime(transmitTime : entities.TransmitTimesEntity, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public getList(callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            callback(MockTransmitTimeslLocalRepository._baseList);
        }
        
        public getListForDayAndBroadcasts(day : string, broadcasts : Array<entities.BroadcastsEntity>, callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            this.getList(function(transmitTimes : Array<entities.TransmitTimesEntity>)
            {
                var filtered = new Array<entities.TransmitTimesEntity>();
                
                for (var i = 0, length = transmitTimes.length; i < length; ++i)
                {
                    var currentTransmitTime = transmitTimes[i];
                    
                    if (currentTransmitTime.day === day)
                    {
                        for (var j = 0, lengthJ = broadcasts.length; j < lengthJ; ++j)
                        {
                            var currentBroadcast = broadcasts[j];
                            
                            if (currentBroadcast.stationID === currentTransmitTime.stationID && currentBroadcast.id === currentTransmitTime.broadcastsID)
                            {
                                filtered.push(currentTransmitTime);
                                break;
                            }
                        }
                    }
                }
                
                callback(filtered);
            });
        }
        
        public getListByStationID(stationID : number, callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            this.getList(function(transmitTimes : Array<entities.TransmitTimesEntity>)
            {
                var filtered = new Array<entities.TransmitTimesEntity>();
                
                for (var i = 0, length = transmitTimes.length; i < length; ++i)
                {
                    var currentTransmitTime = transmitTimes[i];
                    
                    if (currentTransmitTime.stationID === stationID)
                    {
                        filtered.push(currentTransmitTime);
                    }
                }
                
                callback(filtered);
            });
        }
        
        public getListByStationIDAndBroadcastID(stationID : number, broadcastID : number, callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            this.getList(function(transmitTimes : Array<entities.TransmitTimesEntity>)
            {
                var filtered = new Array<entities.TransmitTimesEntity>();
                
                for (var i = 0, length = transmitTimes.length; i < length; ++i)
                {
                    var currentTransmitTime = transmitTimes[i];
                    
                    if (currentTransmitTime.stationID === stationID && currentTransmitTime.broadcastsID === broadcastID)
                    {
                        filtered.push(currentTransmitTime);
                    }
                }
                
                callback(filtered);
            });
        }        
    }
}