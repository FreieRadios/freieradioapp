module freeradios.business.entities.stationdetail
{
    export class BroadcastsEntity
    {
        id : number;
        stationID : number;
        title : string;
        description : string;
        isFavorite : boolean;
    }
}