/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../contracts/favorites/IBroadcastsFavoritesLocalRepository.ts"/>
/// <reference path="../../contracts/stationdetail/IBroadcastsLocalRepository.ts"/>
/// <reference path="../../contracts/station/IStationLocalRepository.ts"/>

/// <reference path="../../entities/favorites/BroadcastsFavoritesEntity.ts"/>

/// <reference path="../../entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../businessentities/stationdetail/BroadcastsEntityWithStationName.ts"/>

/// <reference path="../../entities/station/StationEntity.ts"/>

module freeradios.business.service.favorites
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities;
    
    export class BroadcastFavoritesService
    {
        private _favoritesRepository : contracts.favorites.IBroadcastsFavoritesLocalRepository;
        private _broadcastsRepository : contracts.stationdetail.IBroadcastsLocalRepository;
        private _stationsRepository : contracts.station.IStationLocalRepository;
                
        constructor(
            favoritesRepository? : contracts.favorites.IBroadcastsFavoritesLocalRepository, 
            broadcastsRepository? : contracts.stationdetail.IBroadcastsLocalRepository,
            stationsRepository? : contracts.station.IStationLocalRepository)
        {
            this._favoritesRepository = di.DIContainer.get<contracts.favorites.IBroadcastsFavoritesLocalRepository>(
                "freeradios.business.contracts.favorites.IBroadcastsFavoritesLocalRepository",
                favoritesRepository);               
            
            this._broadcastsRepository = di.DIContainer.get<contracts.stationdetail.IBroadcastsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IBroadcastsLocalRepository",
                broadcastsRepository);
            
            this._stationsRepository = di.DIContainer.get<contracts.station.IStationLocalRepository>(
                "freeradios.business.contracts.station.IStationLocalRepository",
                stationsRepository
            );
        }
        
        public add(stationID : number, broadcastID : number, callback? : (success : boolean) => any)
        {
            (function(self : BroadcastFavoritesService)
            {
                self._favoritesRepository.saveBroadcastFavorite(self._createFavoritesEntity(stationID, broadcastID), function(success : boolean)
                {                    
                    if (success)
                    {
                        self._broadcastsRepository.setIsFavorite(stationID, broadcastID, true, function(success : boolean)
                        {
                            if (callback)
                            {
                                callback(success);
                            }
                        });
                    }
                    else
                    {
                        callback(true);
                    }
                });
            }(this));
        }
     
        public remove(stationID : number, broadcastID : number, callback? : (success : boolean) => any)
        {
            (function(self : BroadcastFavoritesService)
            {
                self._favoritesRepository.deleteBroadcastFavorite(self._createFavoritesEntity(stationID, broadcastID), function(success : boolean)
                {                    
                    if (success)
                    {
                        self._broadcastsRepository.setIsFavorite(stationID, broadcastID, false, function(success : boolean)
                        {
                            if (callback)
                            {
                                callback(success);
                            }
                        });
                    }
                    else
                    {
                        callback(true);
                    }
                });
            }(this));
        }
        
        public getList(callback : (favoriteBroadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            (function(self : BroadcastFavoritesService)
            {
                self._favoritesRepository.getList(function(favorites : Array<entities.favorites.BroadcastsFavoritesEntity>)
                {
                    self._broadcastsRepository.getListForFavorites(favorites, callback);
                });
            }(this));
        }
        
        public getListWithStationName(callback : (favoriteBroadcasts : Array<businessentities.stationdetail.BroadcastsEntityWithStationName>) => any)
        {
            (function(self : BroadcastFavoritesService)
            {
                self._favoritesRepository.getList(function(favorites : Array<entities.favorites.BroadcastsFavoritesEntity>)
                {
                    self._broadcastsRepository.getListForFavorites(favorites, function(favoriteBroadcasts : Array<businessentities.stationdetail.BroadcastsEntityWithStationName>)
                    {
                        self._appendStationNames(favoriteBroadcasts, callback);
                    });
                });
            }(this));
        }
        
        public getListForStation(stationID : number, callback : (favoriteBroadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            (function(self : BroadcastFavoritesService)
            {
                self._favoritesRepository.getListForStation(stationID, function(favorites : Array<entities.favorites.BroadcastsFavoritesEntity>)
                {
                    self._broadcastsRepository.getListForFavorites(favorites, callback);
                });
            }(this));
        }
        
        private _createFavoritesEntity(stationID : number, broadcastID : number) : entities.favorites.BroadcastsFavoritesEntity
        {
            var entity = new entities.favorites.BroadcastsFavoritesEntity();
            entity.stationID = stationID;
            entity.broadcastsID = broadcastID;
            return entity;            
        }
        
        private _appendStationNames(favoriteBroadcasts : Array<businessentities.stationdetail.BroadcastsEntityWithStationName>, callback : (favoriteBroadcastsWithStationName : Array<businessentities.stationdetail.BroadcastsEntityWithStationName>) => any)
        {
            this._stationsRepository.getStationList(function(stations : Array<entities.station.StationEntity>)
            {
                for (var i = 0, length = favoriteBroadcasts.length; i < length; ++i)
                {
                    var currentBroadcast = favoriteBroadcasts[i];
                    
                    currentBroadcast.stationName = stations.filter(function(element : entities.station.StationEntity)
                    {
                        return element.id === currentBroadcast.stationID;
                    })[0].name;                    
                }
                
                callback(favoriteBroadcasts);
            });          
        }
    }
}