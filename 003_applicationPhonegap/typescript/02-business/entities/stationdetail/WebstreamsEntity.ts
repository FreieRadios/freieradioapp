module freeradios.business.entities.stationdetail
{
    export class WebstreamsEntity
    {
        stationID : number;
        transmitTimesFrom : string;
        transmitTimesTo : string;
        url : string;
        format : string;
        quality : string;
    }
}