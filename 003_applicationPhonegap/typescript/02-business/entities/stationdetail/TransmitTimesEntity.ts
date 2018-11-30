/// <reference path="enums/TransmitTimesTimeType.ts"/>

module freeradios.business.entities.stationdetail
{
    export class TransmitTimesEntity
    {
        stationID : number;
        broadcastsID : number;
        recurrence : boolean;
        rerun : boolean;
        day : string;
        priority : number;
        timeFrom : string;
        timeTo : string;
        week1 : boolean;
        week2 : boolean;
        week3 : boolean;
        week4 : boolean;
        week5 : boolean;
        firstWeek : boolean;
        lastWeek : boolean;
        timeType : enums.TransmitTimesTimeType;
        dateOnceFrom : string;
        dateOnceTo : string;
    }
}