/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../contracts/stationdetail/ICategoriesLocalRepository.ts"/>

/// <reference path="../../entities/stationdetail/CategoriesEntity.ts"/>

module freeradios.business.service.stationdetail
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities.stationdetail;
    
    export class CategoriesService
    {
        private _repository : contracts.stationdetail.ICategoriesLocalRepository;
        
        constructor(repository? : contracts.stationdetail.ICategoriesLocalRepository)
        {
            this._repository = di.DIContainer.get<contracts.stationdetail.ICategoriesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ICategoriesLocalRepository",
                repository);                  
        }
        
        public getList(callback : (categories : Array<entities.CategoriesEntity>) => any)
        {
            this._repository.getCategoryList(callback); 
        }
        
        public getSingle(id : number, callback : (category : entities.CategoriesEntity) => any)
        {
            this._repository.getSingle(id, callback); 
        }
        
        public getSingleByName(name : string, callback : (category : entities.CategoriesEntity) => any)
        {
            this._repository.getSingleByName(name, callback); 
        }
        
        public getIDMap(callback : (categories : {[id : number] : entities.CategoriesEntity}) => any)
        {
            this.getList(function(categories : Array<entities.CategoriesEntity>)
            {
                var map : {[id : number] : entities.CategoriesEntity} = {};
                
                for (var i = 0, length = categories.length; i < length; ++i)
                {
                    var currentCategory = categories[i];
                    map[currentCategory.id] = currentCategory;
                }
                
                callback(map);
            }); 
        }
        
        public getNameMap(callback : (categories : {[name : string] : entities.CategoriesEntity}) => any)
        {
            this.getList(function(categories : Array<entities.CategoriesEntity>)
            {
                var map : {[id : string] : entities.CategoriesEntity} = {};
                
                for (var i = 0, length = categories.length; i < length; ++i)
                {
                    var currentCategory = categories[i];
                    map[currentCategory.name] = currentCategory;
                }
                
                callback(map);
            }); 
        }
        
        public getForBroadcast(stationID : number, broadcastID : number, callback : (categories : Array<entities.CategoriesEntity>) => any)
        {
            this._repository.getForBroadcast(stationID, broadcastID, callback);
        }
        
        public getByIDList(categoryIDs : Array<number>, callback : (categories : Array<entities.CategoriesEntity>) => any)
        {
            (function(self : CategoriesService)
            {
                self.getIDMap(function(idMap)
                {
                    var categories = new Array<entities.CategoriesEntity>();
                    
                    for (var i = 0, length = categoryIDs.length; i < length; ++i)
                    {
                        categories.push(idMap[categoryIDs[i]]);
                    }
                    
                    callback(categories);
                });
            }(this));
        }
    }
}