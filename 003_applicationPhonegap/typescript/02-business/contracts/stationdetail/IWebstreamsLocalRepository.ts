/// <reference path="../../entities/stationdetail/WebstreamsEntity.ts"/>

module freeradios.business.contracts.stationdetail
{
    export interface IWebstreamsLocalRepository
    {
        saveWebstreamsArray(webstreams : Array<entities.stationdetail.WebstreamsEntity>, callback : (success : boolean) => any);
        saveWebstream(webstream : entities.stationdetail.WebstreamsEntity, callback : (success : boolean) => any);
        deleteByStationID(stationID : number, callback : (success : boolean) => any);
        getList(callback : (webstreams : Array<entities.stationdetail.WebstreamsEntity>) => any);
        getListByStationID(stationID : number, callback : (webstreams : Array<entities.stationdetail.WebstreamsEntity>) => any);        
    }
}