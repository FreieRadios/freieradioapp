/// <reference path="../../02-business/entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/Broadcasts2CategoriesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/CategoriesEntity.ts"/>
/// <reference path="../../02-business/contracts/stationdetail/IBroadcastsLocalRepository.ts"/>
/// <reference path="../../02-business/entities/favorites/BroadcastsFavoritesEntity.ts"/>
/// <reference path="../favorites/MockBroadcastsFavoritesLocalRepository.ts"/>
/// <reference path="../station/MockStationLocalRepository.ts"/>

module freeradios.dal_local_mock.stationdetail
{
    import entities = business.entities;
    
    export class MockBroadcastsLocalRepository implements business.contracts.stationdetail.IBroadcastsLocalRepository
    {       
        private static _baseList : Array<entities.stationdetail.BroadcastsEntity> =
        [
            { stationID : 0, id : 1, title : "title 0|1", description : "description 0|1", isFavorite : false },
            { stationID : 1, id : 4, title : "title 1|4", description : "description 1|4", isFavorite : true },
            { stationID : 1, id : 7, title : "title 1|7", description : "description 1|7", isFavorite : false },
            { stationID : 2, id : 3, title : "title 2|3", description : "description 2|3", isFavorite : false }
        ];
        
        public static categoryConnections : Array<entities.stationdetail.Broadcasts2CategoriesEntity> = 
        [
            { broadcastsID : 1, stationID : 0, categoriesID : 1 },
            { broadcastsID : 1, stationID : 0, categoriesID : 14 },
            { broadcastsID : 4, stationID : 1, categoriesID : 2 },
            { broadcastsID : 7, stationID : 1, categoriesID : 5 },
            { broadcastsID : 7, stationID : 1, categoriesID : 8 },
            { broadcastsID : 7, stationID : 1, categoriesID : 10 },
            { broadcastsID : 3, stationID : 2, categoriesID : 5 },
            { broadcastsID : 10, stationID : 0, categoriesID : 1 },
            { broadcastsID : 10, stationID : 0, categoriesID : 11 }          
        ];
        
        private static _categories : Array<entities.stationdetail.CategoriesEntity> =
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
        
        public saveBroadcastsArray(broadcasts : Array<entities.stationdetail.BroadcastsEntity>, callback : (success : boolean) => any)
        {
            MockBroadcastsLocalRepository._baseList = MockBroadcastsLocalRepository._baseList.concat(broadcasts);
            callback(true);
        }
        
        public saveBroadcast(broadcast : entities.stationdetail.BroadcastsEntity, callback : (success : boolean) => any)
        {
            MockBroadcastsLocalRepository._baseList.push(broadcast);
            callback(true);
        }
        
        public setIsFavorite(stationID : number, broadcastID : number, isFavorite : boolean, callback : (success : boolean) => any)
        {
            this.getList(function(allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                var broadcasts = new Array<entities.stationdetail.BroadcastsEntity>();
                
                for (var i = 0, length = allBroadcasts.length; i < length; ++i)
                {
                    var currentBroadcast = allBroadcasts[i];
                    
                    if (currentBroadcast.id === broadcastID && currentBroadcast.stationID === stationID)
                    {
                        currentBroadcast.isFavorite = isFavorite;
                        break;
                    }                    
                }
            });
            
            callback(true);
        }
        
        public reflagIsFavoriteFromBroadcastsFavorites(stationID : number, callback : (success : boolean) => any)
        {
            var favoritesRepository = new favorites.MockFavoritesLocalRepository();
            
            this.getList(function(allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                favoritesRepository.getList(function(favorites : Array<entities.favorites.BroadcastsFavoritesEntity>)
                {
                    var broadcasts = new Array<entities.stationdetail.BroadcastsEntity>();
                
                    for (var i = 0, lengthI = allBroadcasts.length; i < lengthI; ++i)
                    {
                        var currentBroadcast = allBroadcasts[i];
                        
                        if (currentBroadcast.stationID === stationID)
                        {
                            for (var j = 0, lengthJ = favorites.length; j < lengthJ; ++j)
                            {
                                var currentFavorite = favorites[j];
                                
                                if (currentFavorite.stationID === currentBroadcast.stationID && currentFavorite.broadcastsID === currentBroadcast.id)
                                {
                                    currentBroadcast.isFavorite = true;
                                    break;
                                }
                            }
                        }
                    }           
                });
            });
            
            callback(true)
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public getListForFavorites(favorites : Array<entities.favorites.BroadcastsFavoritesEntity>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this.getList(function(allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                var broadcasts = new Array<entities.stationdetail.BroadcastsEntity>();
                
                for (var i = 0, lengthI = allBroadcasts.length; i < lengthI; ++i)
                {
                    var currentBroadcast = allBroadcasts[i];
                    
                    for (var j = 0, lengthJ = favorites.length; j < lengthJ; ++j)
                    {
                        var currentFavorite = favorites[j];
                        
                        if (currentBroadcast.stationID === currentFavorite.stationID && currentBroadcast.id === currentFavorite.broadcastsID)
                        {
                            broadcasts.push(currentBroadcast);
                            break;
                        }
                    }
                }
                
                callback(broadcasts);
            });
        }
        
        public getList(callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            callback(MockBroadcastsLocalRepository._baseList.slice(0));
        }
        
        public getListByStationID(stationID : number, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this.getList(function(allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                callback(MockBroadcastsLocalRepository._filterByStation(stationID, allBroadcasts));
            });
        }
        
        public getSingle(stationID : number, broadcastID : number, callback : (broadcast : entities.stationdetail.BroadcastsEntity) => any)
        {
            this.getList(function(allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                var entity : entities.stationdetail.BroadcastsEntity = null;
                
                for (var i = 0, lengthI = allBroadcasts.length; i < lengthI; ++i)
                {
                    var currentBroadcast = allBroadcasts[i];
                    
                    if (currentBroadcast.stationID === stationID && currentBroadcast.id === broadcastID)
                    {
                        entity = currentBroadcast;
                        break;
                    }
                }
                
                callback(entity);
            });
        }
        
        public searchInTitleAndDescriptionAndCategories(searchText : string, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this.getList(function(allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                var searchRegExp = new RegExp(searchText, "i");
                var broadcasts = new Array<entities.stationdetail.BroadcastsEntity>();
                
                for (var j = 0, lengthJ = allBroadcasts.length; j < lengthJ; ++j)
                {
                    var currentBroadcast = allBroadcasts[j];
                    
                    var categoryConnections = MockBroadcastsLocalRepository.categoryConnections.filter(function(connection : entities.stationdetail.Broadcasts2CategoriesEntity)
                    {
                        return connection.broadcastsID === currentBroadcast.id;
                    });
                    
                    var categories = MockBroadcastsLocalRepository._categories.filter(function(category : entities.stationdetail.CategoriesEntity)
                    {
                        for (var i = 0, length = categoryConnections.length; i < length; ++i)
                        {
                            if (categoryConnections[i].categoriesID === category.id)
                            {
                                return true;
                            }
                        }
                        
                        return false;
                    });
                    
                    var categoriesFound : boolean = false;
                    
                    for (var i = 0, length = categories.length; i < length; ++i)
                    {
                        if (searchRegExp.test(categories[i].name))
                        {
                            categoriesFound = true;
                        }
                    }
                    
                    if (searchRegExp.test(currentBroadcast.title) || searchRegExp.test(currentBroadcast.description) || categoriesFound)
                    {
                        broadcasts.push(currentBroadcast);
                    }
                }
                
                callback(broadcasts);
            });
        }
        
        public searchInTitleAndDescriptionAndCategoriesAndStationName(searchText : string, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            var stationRepository = new station.MockStationLocalRepository();
            
            this.getList(function(allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                stationRepository.getStationList(function(stations : Array<entities.station.StationEntity>)
                {                
                    var searchRegExp = new RegExp(searchText, "i");
                    var broadcasts = new Array<entities.stationdetail.BroadcastsEntity>();
                    
                    for (var j = 0, lengthJ = allBroadcasts.length; j < lengthJ; ++j)
                    {
                        var currentBroadcast = allBroadcasts[j];
                        
                        var categoryConnections = MockBroadcastsLocalRepository.categoryConnections.filter(function(connection : entities.stationdetail.Broadcasts2CategoriesEntity)
                        {
                            return connection.broadcastsID === currentBroadcast.id;
                        });
                        
                        var categories = MockBroadcastsLocalRepository._categories.filter(function(category : entities.stationdetail.CategoriesEntity)
                        {
                            for (var i = 0, length = categoryConnections.length; i < length; ++i)
                            {
                                if (categoryConnections[i].categoriesID === category.id)
                                {
                                    return true;
                                }
                            }
                            
                            return false;
                        });
                        
                        var stationNames = stations.filter(function(station : entities.station.StationEntity)
                        {
                            return station.id === currentBroadcast.stationID;
                        });
                        
                        var categoriesFound : boolean = false;
                        
                        for (var i = 0, length = categories.length; i < length; ++i)
                        {
                            if (searchRegExp.test(categories[i].name))
                            {
                                categoriesFound = true;
                            }
                        }
                        
                        if (searchRegExp.test(currentBroadcast.title) || searchRegExp.test(currentBroadcast.description) || categoriesFound || searchRegExp.test(stationNames[0].name))
                        {
                            broadcasts.push(currentBroadcast);
                        }
                    }
                    
                    callback(broadcasts);
                });
            });
        }
        
        public searchInTitleAndDescriptionAndCategoriesForStation(stationID : number, searchText : string, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this.searchInTitleAndDescriptionAndCategories(searchText, function(searchedBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                callback(MockBroadcastsLocalRepository._filterByStation(stationID, searchedBroadcasts));
            });
        }
        
        public searchInTitleAndDescriptionAndCategoriesFilteredByCategories(searchText : string, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this.searchInTitleAndDescriptionAndCategories(searchText, function(searchedBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                callback(MockBroadcastsLocalRepository._filterByCategories(categoryIDs, searchedBroadcasts));
            });
        }
        
        public searchInTitleAndDescriptionAndCategoriesFilteredByCategoriesForStation(stationID : number, searchText : string, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this.searchInTitleAndDescriptionAndCategoriesFilteredByCategories(searchText, categoryIDs, function(searchedBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                callback(MockBroadcastsLocalRepository._filterByStation(stationID, searchedBroadcasts));
            });
        }
        
        public getFilteredByCategories(categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this.getList(function(allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                callback(MockBroadcastsLocalRepository._filterByCategories(categoryIDs, allBroadcasts));
            });
        }
        
        public getFilteredByCategoriesForStation(stationID : number, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this.getFilteredByCategories(categoryIDs, function(filteredBroadcasts : Array<entities.stationdetail.BroadcastsEntity>)
            {
                callback(MockBroadcastsLocalRepository._filterByStation(stationID, filteredBroadcasts));
            });
        }
        
        private static _filterByStation(stationID : number, allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>) : Array<entities.stationdetail.BroadcastsEntity>
        {
            var broadcasts = new Array<entities.stationdetail.BroadcastsEntity>();
                
            for (var i = 0, lengthI = allBroadcasts.length; i < lengthI; ++i)
            {
                var currentBroadcast = allBroadcasts[i];
                
                if (currentBroadcast.stationID === stationID)
                {
                    broadcasts.push(currentBroadcast);
                }
            }
            
            return broadcasts;
        }
        
        private static _filterByCategories(categoryIDs : Array<number>, allBroadcasts : Array<entities.stationdetail.BroadcastsEntity>) : Array<entities.stationdetail.BroadcastsEntity>
        {
            if (categoryIDs.length === 0)
            {
               return allBroadcasts;
            }
            
            var broadcasts = new Array<entities.stationdetail.BroadcastsEntity>();
            
            for (var i = 0, lengthI = allBroadcasts.length; i < lengthI; ++i)
            {
                var currentBroadcast = allBroadcasts[i];
                var found = false;
                
                for (var j = 0, lengthJ = MockBroadcastsLocalRepository.categoryConnections.length; j < lengthJ && !found; ++j)
                {
                    var currentConnection = MockBroadcastsLocalRepository.categoryConnections[j];
                    
                    if (currentConnection.broadcastsID === currentBroadcast.id)
                    {
                        for (var k = 0, lengthK = categoryIDs.length; k < lengthK; ++k)
                        {
                            if (categoryIDs[k] === currentConnection.categoriesID)
                            {
                                broadcasts.push(currentBroadcast);
                                found = true;
                                break;
                            }
                        }
                    }
                }                    
            }
            
            return broadcasts;
        }
    }
}