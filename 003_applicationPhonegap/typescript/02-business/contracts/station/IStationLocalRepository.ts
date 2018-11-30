/// <reference path="../../entities/station/StationEntity.ts"/>

module freeradios.business.contracts.station
{
    export interface IStationLocalRepository
    {
        saveStationArray(stations : Array<entities.station.StationEntity>, callback : (success : boolean) => any);
        saveStation(station : entities.station.StationEntity, callback : (success : boolean) => any);
        deleteAll(callback : (success : boolean) => any);
        getByID(id : number, callback : (station: entities.station.StationEntity) => any);
        getStationList(callback : (stations: Array<entities.station.StationEntity>) => any);
        searchInNameAndCity(searchText : string, callback : (stations: Array<entities.station.StationEntity>) => any);        
    }
}