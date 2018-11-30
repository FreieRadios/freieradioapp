module freeradios.business.entities.station
{
    export class StationEntity
    {
        id : number;
        lastUpdate : Date;
        name : string;
        city : string
        xmlURI : string;
        frequency : string;
        latitude : number;
        longitude : number;
        streamURL : string; 
        eventIsOn? : boolean;       
        geoPoint? : string;
    }
}