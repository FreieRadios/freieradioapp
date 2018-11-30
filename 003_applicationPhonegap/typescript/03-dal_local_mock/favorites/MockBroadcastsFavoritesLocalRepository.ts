/// <reference path="../../02-business/contracts/favorites/IBroadcastsFavoritesLocalRepository.ts"/>
/// <reference path="../../02-business/entities/favorites/BroadcastsFavoritesEntity.ts"/>

module freeradios.dal_local_mock.favorites
{
    import entities = freeradios.business.entities.favorites;
    
    export class MockFavoritesLocalRepository implements business.contracts.favorites.IBroadcastsFavoritesLocalRepository
    {   
        private static _baseList : Array<entities.BroadcastsFavoritesEntity> =
        [
            { stationID : 0, broadcastsID : 1 },
            { stationID : 1, broadcastsID : 4 },
            { stationID : 1, broadcastsID : 7 },
            { stationID : 2, broadcastsID : 3 }
        ];
        
        public saveBroadcastFavorite(favorite : entities.BroadcastsFavoritesEntity, callback : (success : boolean) => any)
        {
            MockFavoritesLocalRepository._baseList.push(favorite);
            callback(true);
        }
        
        public deleteBroadcastFavorite(favorite : entities.BroadcastsFavoritesEntity, callback : (success : boolean) => any)
        {
            for (var i = 0, length = MockFavoritesLocalRepository._baseList.length; i < length; ++i)
            {
                var entity = MockFavoritesLocalRepository._baseList[i];
                
                if (entity.broadcastsID === favorite.broadcastsID && entity.stationID === favorite.stationID)
                {
                    MockFavoritesLocalRepository._baseList.splice(i, 1);
                    break;
                }
            }
            
            callback(true);
        }
        
        public getList(callback : (favorites : Array<entities.BroadcastsFavoritesEntity>) => any)
        {
            callback(MockFavoritesLocalRepository._baseList);
        }
        
        public getListForStation(stationID : number, callback : (favorites : Array<entities.BroadcastsFavoritesEntity>) => any)
        {
            this.getList(function(favorites : Array<entities.BroadcastsFavoritesEntity>)
            {
                var filteredFavorites = new Array<entities.BroadcastsFavoritesEntity>();
                
                for (var i = 0, length = favorites.length; i < length; ++i)
                {
                    var current = favorites[i];
                    
                    if (current.stationID === stationID)
                    {
                        filteredFavorites.push(current);
                    }
                }
                
                callback(filteredFavorites);
            });
        }
    }
}