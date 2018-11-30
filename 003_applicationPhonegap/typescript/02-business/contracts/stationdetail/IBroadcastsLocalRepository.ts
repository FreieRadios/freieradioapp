/// <reference path="../../entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../entities/favorites/BroadcastsFavoritesEntity.ts"/>

module freeradios.business.contracts.stationdetail
{
    export interface IBroadcastsLocalRepository
    {
        saveBroadcastsArray(broadcasts : Array<entities.stationdetail.BroadcastsEntity>, callback : (success : boolean) => any);
        saveBroadcast(broadcast : entities.stationdetail.BroadcastsEntity, callback : (success : boolean) => any);
        setIsFavorite(stationID : number, broadcastID : number, isFavorite : boolean, callback : (success : boolean) => any);
        reflagIsFavoriteFromBroadcastsFavorites(stationID : number, callback : (success : boolean) => any);
        deleteByStationID(stationID : number, callback : (success : boolean) => any);
        getListForFavorites(favorites : Array<entities.favorites.BroadcastsFavoritesEntity>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        getList(callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        getListByStationID(stationID : number, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        getSingle(stationID : number, broadcastID : number, callback : (broadcast : entities.stationdetail.BroadcastsEntity) => any);
        searchInTitleAndDescriptionAndCategoriesAndStationName(searchText : string, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        searchInTitleAndDescriptionAndCategories(searchText : string, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        searchInTitleAndDescriptionAndCategoriesForStation(stationID : number, searchText : string, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        searchInTitleAndDescriptionAndCategoriesFilteredByCategories(searchText : string, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        searchInTitleAndDescriptionAndCategoriesFilteredByCategoriesForStation(stationID : number, searchText : string, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        getFilteredByCategories(categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
        getFilteredByCategoriesForStation(stationID : number, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any);
    }
}