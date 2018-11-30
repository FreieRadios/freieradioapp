/// <reference path="../../entities/stationdetail/BroadcastsEntity.ts"/>

module freeradios.business.businessentities.stationdetail
{
    export class BroadcastsEntityWithTransmitTime extends entities.stationdetail.BroadcastsEntity
    {
        timeFrom : string;
        timeTo : string;
    }
}