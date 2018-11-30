/// <reference path="../../entities/favorites/BroadcastsFavoritesEntity.ts"/>

module freeradios.business.contracts.favorites
{
    import entities = business.entities.favorites;
    
    export interface IBroadcastsFavoritesLocalRepository
    {
        saveBroadcastFavorite(favorite : entities.BroadcastsFavoritesEntity, callback : (success : boolean) => any);
        deleteBroadcastFavorite(favorite : entities.BroadcastsFavoritesEntity, callback : (success : boolean) => any);
        getList(callback : (favorites : Array<entities.BroadcastsFavoritesEntity>) => any);
        getListForStation(stationID : number, callback : (favorites : Array<entities.BroadcastsFavoritesEntity>) => any);
    }
}