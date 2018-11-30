/// <reference path="../../entities/station/StationEntity.ts"/>

module freeradios.business.contracts.station
{
    export interface IStationWebRepository
    {
        getStationList(callback : (stations: Array<entities.station.StationEntity>) => any, errorCallback : () => any);
    }
}