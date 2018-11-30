/// <reference path="../../entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../entities/stationdetail/Broadcasts2CategoriesEntity.ts"/>
/// <reference path="../../entities/stationdetail/MediaChannelsEntity.ts"/>
/// <reference path="../../entities/stationdetail/StationDetailEntity.ts"/>
/// <reference path="../../entities/stationdetail/TransmitTimesEntity.ts"/>
/// <reference path="../../entities/stationdetail/WebstreamsEntity.ts"/>

module freeradios.business.contracts.stationdetail
{
    export interface IStationDetailWebRepository
    {
        loadData(dataURL : string, callback : () => any, errorCallback : () => any);
        getBroadcasts2CategoriesEntity(categoryNames2Categories : {[name : string] : entities.stationdetail.CategoriesEntity}, stationID : number) : Array<entities.stationdetail.Broadcasts2CategoriesEntity>;
        getBroadcastsEntities(stationID : number) : Array<entities.stationdetail.BroadcastsEntity>;
        getMediaChannelsEntities(stationID : number) : Array<entities.stationdetail.MediaChannelsEntity>;
        getStationDetailEntity(stationID : number) : entities.stationdetail.StationDetailEntity;
        getTransmitTimeEntities(stationID : number) : Array<entities.stationdetail.TransmitTimesEntity>;
        getWebstreamsEntities(stationID : number) : Array<entities.stationdetail.WebstreamsEntity>;
    }
}