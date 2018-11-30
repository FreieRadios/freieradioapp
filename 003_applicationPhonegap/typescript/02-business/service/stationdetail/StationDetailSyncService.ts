/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../entities/station/StationEntity.ts"/>

/// <reference path="../../contracts/stationdetail/IStationDetailWebRepository.ts"/>

/// <reference path="../../contracts/stationdetail/IBroadcastsLocalRepository.ts"/>
/// <reference path="../../contracts/stationdetail/IBroadcasts2CategoriesLocalRepository.ts"/>
/// <reference path="../../contracts/stationdetail/IMediaChannelsLocalRepository.ts"/>
/// <reference path="../../contracts/stationdetail/IStationDetailLocalRepository.ts"/>
/// <reference path="../../contracts/stationdetail/ITransmitTimesLocalRepository.ts"/>
/// <reference path="../../contracts/stationdetail/IWebstreamsLocalRepository.ts"/>

/// <reference path="../../entities/stationdetail/Broadcasts2CategoriesEntity.ts"/>
/// <reference path="../../entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../entities/stationdetail/CategoriesEntity.ts"/>
/// <reference path="../../entities/stationdetail/MediaChannelsEntity.ts"/>
/// <reference path="../../entities/stationdetail/StationDetailEntity.ts"/>
/// <reference path="../../entities/stationdetail/TransmitTimesEntity.ts"/>
/// <reference path="../../entities/stationdetail/WebstreamsEntity.ts"/>

module freeradios.business.service.stationdetail
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities.stationdetail;
    
    export class StationDetailSyncService
    {
        private _webRepository : contracts.stationdetail.IStationDetailWebRepository;    
        
        private _localRepositoryBroadcasts : contracts.stationdetail.IBroadcastsLocalRepository;
        private _localRepositoryBroadcasts2Categories : contracts.stationdetail.IBroadcasts2CategoriesLocalRepository;
        private _localRepositoryCategories : contracts.stationdetail.ICategoriesLocalRepository;
        private _localRepositoryMediaChannels : contracts.stationdetail.IMediaChannelsLocalRepository;
        private _localRepositoryStationDetail : contracts.stationdetail.IStationDetailLocalRepository;
        private _localRepositoryTransmitTimes : contracts.stationdetail.ITransmitTimesLocalRepository;
        private _localRepositoryWebstreams : contracts.stationdetail.IWebstreamsLocalRepository;
        
        private _categoryNamesToEntities : {[name : string] : entities.CategoriesEntity};
        
        constructor(
            webRepository? : contracts.stationdetail.IStationDetailWebRepository,
            localRepositoryBroadcasts? : contracts.stationdetail.IBroadcastsLocalRepository,
            localRepositoryBroadcasts2Categories? : contracts.stationdetail.IBroadcasts2CategoriesLocalRepository,
            localRepositoryCategories? : contracts.stationdetail.ICategoriesLocalRepository,
            localRepositoryMediaChannels? : contracts.stationdetail.IMediaChannelsLocalRepository,
            localRepositoryStationDetail? : contracts.stationdetail.IStationDetailLocalRepository,
            localRepositoryTransmitTimes? : contracts.stationdetail.ITransmitTimesLocalRepository,
            localRepositoryWebstreams? : contracts.stationdetail.IWebstreamsLocalRepository
        )
        {
            this._webRepository = di.DIContainer.get<contracts.stationdetail.IStationDetailWebRepository>(
                "freeradios.business.contracts.stationdetail.IStationDetailWebRepository",
                webRepository);
            
            this._localRepositoryBroadcasts = di.DIContainer.get<contracts.stationdetail.IBroadcastsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IBroadcastsLocalRepository",
                localRepositoryBroadcasts);
            
            this._localRepositoryBroadcasts2Categories = di.DIContainer.get<contracts.stationdetail.IBroadcasts2CategoriesLocalRepository>(
                "freeradios.business.contracts.stationdetail.IBroadcasts2CategoriesLocalRepository",
                localRepositoryBroadcasts2Categories);
            
            this._localRepositoryCategories = di.DIContainer.get<contracts.stationdetail.ICategoriesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ICategoriesLocalRepository",
                localRepositoryCategories);
            
            this._localRepositoryMediaChannels = di.DIContainer.get<contracts.stationdetail.IMediaChannelsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IMediaChannelsLocalRepository",
                localRepositoryMediaChannels);
            
            this._localRepositoryStationDetail = di.DIContainer.get<contracts.stationdetail.IStationDetailLocalRepository>(
                "freeradios.business.contracts.stationdetail.IStationDetailLocalRepository",
                localRepositoryStationDetail);
            
            this._localRepositoryTransmitTimes = di.DIContainer.get<contracts.stationdetail.ITransmitTimesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ITransmitTimesLocalRepository",
                localRepositoryTransmitTimes);
            
            this._localRepositoryWebstreams = di.DIContainer.get<contracts.stationdetail.IWebstreamsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IWebstreamsLocalRepository",
                localRepositoryWebstreams);                  
        }
        
        public sync(station : business.entities.station.StationEntity, callback : (success : boolean) => any)
        {            
            (function(self : StationDetailSyncService)
            {
                self._updateLocalCategories(function()
                {
                    self._webRepository.loadData(station.xmlURI, function()
                    {
                        self._syncStationDetails(station.id, callback);                    
                    }, function()
                    {
                        callback(false);
                    });
                });
            }(this));
        }
        
        private _requiresUpdate(stationID : number, stationDetailWebEntity : entities.StationDetailEntity, callback : (updateRequired : boolean) => any)
        {
            if (stationDetailWebEntity === null)
            {
                callback(false);                
            }
            else
            {
                this._localRepositoryStationDetail.getByStationID(stationID, function(stationDetailLocalEntity : entities.StationDetailEntity)
                {
                    if (stationDetailLocalEntity === null)
                    {
                        callback(true);
                    }
                    else
                    {
                        callback(stationDetailLocalEntity.lastUpdate.getTime() !== stationDetailWebEntity.lastUpdate.getTime());                        
                    }
                });
            }
        }
        
        private _syncStationDetails(stationID : number, callback : (success : boolean) => any)
        {
            (function(self : StationDetailSyncService)
            {
                self._localRepositoryStationDetail.deleteByStationID(stationID, function(success : boolean)
                {
                    var stationDetailEntity = self._webRepository.getStationDetailEntity(stationID);
                    
                    self._requiresUpdate(stationID, stationDetailEntity, function(updateRequired : boolean)
                    {
                        self._localRepositoryStationDetail.saveStationDetail(stationDetailEntity, function(success)
                        {
                            if (success)
                            {
                                if (updateRequired)
                                {
                                    self._syncMediaChannels(stationID, callback);
                                }
                                else
                                {
                                    callback(true);
                                }                        
                            }
                            else
                            {
                                callback(false);
                            }
                        });
                     });
                });
            }(this));            
        }
        
        private _syncMediaChannels(stationID : number, callback : (success : boolean) => any)
        {
            (function(self : StationDetailSyncService)
            {
                self._localRepositoryMediaChannels.deleteByStationID(stationID, function(success : boolean)
                {
                    self._localRepositoryMediaChannels.saveMediaChannelsArray(self._webRepository.getMediaChannelsEntities(stationID), function(success)
                    {
                        if (success)
                        {
                            self._syncWebstreams(stationID, callback);
                        }
                        else
                        {
                            callback(false);
                        }
                    });
                });
            }(this));
        }
        
        private _syncWebstreams(stationID : number, callback : (success : boolean) => any)
        {
            (function(self : StationDetailSyncService)
            {
                self._localRepositoryWebstreams.deleteByStationID(stationID, function(success : boolean)
                {
                    self._localRepositoryWebstreams.saveWebstreamsArray(self._webRepository.getWebstreamsEntities(stationID), function(success)
                    {
                        if (success)
                        {
                            self._syncBroadcasts(stationID, callback);
                        }
                        else
                        {
                            callback(false);
                        }
                    });
                });
            }(this));
        }
        
        private _syncBroadcasts(stationID : number, callback : (success : boolean) => any)
        {
            (function(self : StationDetailSyncService)
            {
                self._localRepositoryBroadcasts.deleteByStationID(stationID, function(success : boolean)
                {
                    var broadcasts = self._webRepository.getBroadcastsEntities(stationID);
                    
                    self._localRepositoryBroadcasts.saveBroadcastsArray(broadcasts, function(success)                    
                    {
                        if (success)
                        {
                            self._reflagFavorites(stationID, function(success)
                            {
                                if (success)
                                {
                                    self._syncBroadcasts2Categories(stationID, callback);
                                }
                                else
                                {
                                    callback(false);
                                }
                            });
                        }
                        else
                        {
                            callback(false);
                        }
                    });
                });
            }(this));
        }
        
        private _reflagFavorites(stationID : number, callback : (success : boolean) => any)
        {
            (function(self : StationDetailSyncService)
            {
                self._localRepositoryBroadcasts.reflagIsFavoriteFromBroadcastsFavorites(stationID, function(success : boolean)
                {
                    callback(success);
                });
            }(this));   
        }
        
        private _syncBroadcasts2Categories(stationID : number, callback : (success : boolean) => any)
        {
            (function(self : StationDetailSyncService)
            {
                self._localRepositoryBroadcasts2Categories.deleteByStationID(stationID, function(success : boolean)
                {
                   self._localRepositoryBroadcasts2Categories.saveConnectionsArray(self._webRepository.getBroadcasts2CategoriesEntity(self._getCategoryNamesToEntities(), stationID), function(success)
                    {
                        if (success)
                        {
                            self._syncTransmitTimes(stationID, callback);
                        }
                        else
                        {
                            callback(false);
                        }
                    });
                });
            }(this));
        }
        
        private _syncTransmitTimes(stationID : number, callback : (success : boolean) => any)
        {
            (function(self : StationDetailSyncService)
            {
                self._localRepositoryTransmitTimes.deleteByStationID(stationID, function(success : boolean)
                {
                    self._localRepositoryTransmitTimes.saveTransmitTimesArray(self._webRepository.getTransmitTimeEntities(stationID), function(success)
                    {
                        callback(success);
                    });
                });
            }(this));
        }
        
        private _updateLocalCategories(callback : () => any)
        {
            (function(self : StationDetailSyncService)
            {
                self._localRepositoryCategories.getCategoryList(function(categories : Array<entities.CategoriesEntity>)
                {
                    self._categoryNamesToEntities = {};
                    
                    for (var i = 0, length = categories.length; i < length; ++i)
                    {
                        var category = categories[i];
                        self._categoryNamesToEntities[category.name] = category;
                    }
                    
                    callback();
                });
            }(this));
        }
        
        private _getCategoryNamesToEntities() : {[name : string] : entities.CategoriesEntity}
        {
            return this._categoryNamesToEntities;
        }
    }
}