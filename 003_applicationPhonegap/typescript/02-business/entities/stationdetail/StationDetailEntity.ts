module freeradios.business.entities.stationdetail
{
    export class StationDetailEntity
    {
        stationID : number;
        displayName : string;
        fullName : string;
        logoSource : string;
        baseColor : string;
        city : string;
        studioStreet : string;
        studioStreetNumber : string;
        studioCity : string;
        studioZIP : string;
        latitude : number;
        longitude : number;
        studioStudioPhone : string;
        studioOfficePhone : string;
        studioStudioEMail : string;
        studioOfficeEMail : string;
        studioOpenTimeFrom : string;
        studioOpenTimeTo : string;
        website : string;
        lastUpdate : Date;  
    }
}