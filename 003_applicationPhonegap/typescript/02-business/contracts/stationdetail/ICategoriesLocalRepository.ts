/// <reference path="../../entities/stationdetail/CategoriesEntity.ts"/>

module freeradios.business.contracts.stationdetail
{
    export interface ICategoriesLocalRepository
    {            
        getCategoryList(callback : (categories : Array<entities.stationdetail.CategoriesEntity>) => any);
        getSingle(id : number, callback : (category : entities.stationdetail.CategoriesEntity) => any);
        getSingleByName(name : string, callback : (category : entities.stationdetail.CategoriesEntity) => any);
        getForBroadcast(stationID : number, broadcastID : number, callback : (categories : Array<entities.stationdetail.CategoriesEntity>) => any);
    }
}