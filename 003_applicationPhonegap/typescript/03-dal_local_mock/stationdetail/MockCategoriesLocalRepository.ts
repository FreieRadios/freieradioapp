/// <reference path="../../02-business/entities/stationdetail/CategoriesEntity.ts"/>
/// <reference path="../../02-business/contracts/stationdetail/ICategoriesLocalRepository.ts"/>
/// <reference path="MockBroadcastsLocalRepository.ts"/>

module freeradios.dal_local_mock.stationdetail
{
    import entities = business.entities.stationdetail;
    
    export class MockCategoriesLocalRepository implements business.contracts.stationdetail.ICategoriesLocalRepository
    {
        private static _categoryList : Array<entities.CategoriesEntity> =
        [
            { id: 1, name: "Alternative"},
            { id: 2, name: "Elektronika"},
            { id: 3, name: "HipHop"},
            { id: 4, name: "Jazz"},
            { id: 5, name: "Klassik"},
            { id: 6, name: "Reggae"},
            { id: 7, name: "R'n'B / Black"},
            { id: 8, name: "Singer-Songwriter"},
            { id: 9, name: "U-Musi & Schlager"},
            { id: 10, name: "Volksmusik"},
            { id: 11, name: "World"},
            { id: 12, name: "Wort"}
        ];           
        
        public getCategoryList(callback : (categories : Array<entities.CategoriesEntity>) => any)
        {
            callback(MockCategoriesLocalRepository._categoryList);
        }
        
        public getSingle(id : number, callback : (category : entities.CategoriesEntity) => any)
        {
            this.getCategoryList(function(categories : Array<entities.CategoriesEntity>)
            {
                var entity : entities.CategoriesEntity = null;
                
                for (var i = 0, length = categories.length; i < length; ++i)
                {
                    var currentCategory = categories[i];
                    
                    if (currentCategory.id === id)
                    {
                        entity = currentCategory;
                        break;
                    }
                }
                
                callback(entity);
            });
        }
        
        public getSingleByName(name : string, callback : (category : entities.CategoriesEntity) => any)
        {
            this.getCategoryList(function(categories : Array<entities.CategoriesEntity>)
            {
                var entity : entities.CategoriesEntity = null;
                
                for (var i = 0, length = categories.length; i < length; ++i)
                {
                    var currentCategory = categories[i];
                    
                    if (currentCategory.name === name)
                    {
                        entity = currentCategory;
                        break;
                    }
                }
                
                callback(entity);
            });
        }
        
        public getForBroadcast(stationID : number, broadcastID : number, callback : (categories : Array<entities.CategoriesEntity>) => any)
        {
            var connections = MockBroadcastsLocalRepository.categoryConnections;
            var results = new Array<entities.CategoriesEntity>();
            
            for (var i = 0, length = connections.length; i < length; ++i)
            {
                var currentConnection = connections[i];
                
                if (currentConnection.stationID === stationID && currentConnection.broadcastsID === broadcastID)
                {
                    results.push(MockCategoriesLocalRepository._categoryList[currentConnection.categoriesID]);
                }
            }
            
            callback(results);
        }
    }
}