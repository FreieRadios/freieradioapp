module freeradios.business.entities.stationdetail
{
    export class MediaChannelsEntity
    {
        stationID : number;
        type : string;
        frequency : string;
        frequencyUnit : string;
        city : string;
        operator : string;
        power : string;
        powerUnit : string;
        rdsid : string;
        transmitTimesFrom : string;
        transmitTimesTo : string;
        latitude : number;
        longitude : number;
        transmitterReceptionArea : string;
    }
}