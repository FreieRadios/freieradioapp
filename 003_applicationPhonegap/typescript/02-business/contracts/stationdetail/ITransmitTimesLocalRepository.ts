/// <reference path="../../entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../entities/stationdetail/TransmitTimesEntity.ts"/>

module freeradios.business.contracts.stationdetail
{
    export interface ITransmitTimesLocalRepository
    {
        saveTransmitTimesArray(transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>, callback : (success : boolean) => any);
        saveTransmitTime(transmitTime : entities.stationdetail.TransmitTimesEntity, callback : (success : boolean) => any);
        deleteByStationID(stationID : number, callback : (success : boolean) => any);
        getList(callback : (transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>) => any);
        getListForDayAndBroadcasts(day : string, broadcasts : Array<entities.stationdetail.BroadcastsEntity>, callback : (transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>) => any);
        getListByStationID(stationID : number, callback : (transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>) => any);
        getListByStationIDAndBroadcastID(stationID : number, broadcastID : number, callback : (transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>) => any);
    }
}