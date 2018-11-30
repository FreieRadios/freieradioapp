/// <reference path="../../entities/stationdetail/MediaChannelsEntity.ts"/>

module freeradios.business.contracts.stationdetail
{
    export interface IMediaChannelsLocalRepository
    {
        saveMediaChannelsArray(mediaChannels : Array<entities.stationdetail.MediaChannelsEntity>, callback : (success : boolean) => any);
        saveMediaChannel(mediaChannel : entities.stationdetail.MediaChannelsEntity, callback : (success : boolean) => any);
        deleteByStationID(stationID : number, callback : (success : boolean) => any);
        getList(callback : (mediaChannels : Array<entities.stationdetail.MediaChannelsEntity>) => any);
        getListByStationID(stationID : number, callback : (mediaChannels : Array<entities.stationdetail.MediaChannelsEntity>) => any);
    }
}