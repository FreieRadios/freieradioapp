/// <reference path="../../entities/stationdetail/StationDetailEntity.ts"/>

module freeradios.business.contracts.stationdetail
{
    export interface IStationDetailLocalRepository
    {
        saveStationDetailsArray(stationDetails : Array<entities.stationdetail.StationDetailEntity>, callback : (success : boolean) => any);
        saveStationDetail(stationDetail : entities.stationdetail.StationDetailEntity, callback : (success : boolean) => any);
        deleteByStationID(stationID : number, callback : (success : boolean) => any);
        getByStationID(stationID : number, callback : (stationDetail : entities.stationdetail.StationDetailEntity) => any);
        getList(callback : (stationsDetails : Array<entities.stationdetail.StationDetailEntity>) => any);
        searchInDisplayNameAndFullNameAndCity(searchText : string, callback : (stationsDetails : Array<entities.stationdetail.StationDetailEntity>) => any);
    }
}