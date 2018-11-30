/// <reference path="../../entities/stationdetail/Broadcasts2CategoriesEntity.ts"/>

module freeradios.business.contracts.stationdetail
{
    export interface IBroadcasts2CategoriesLocalRepository
    {
        saveConnection(connection : entities.stationdetail.Broadcasts2CategoriesEntity, callback : (success : boolean) => any);               
        saveConnectionsArray(connections : Array<entities.stationdetail.Broadcasts2CategoriesEntity>, callback : (success : boolean) => any);
        deleteByStationID(stationID : number, callback : (success : boolean) => any);
    }
}