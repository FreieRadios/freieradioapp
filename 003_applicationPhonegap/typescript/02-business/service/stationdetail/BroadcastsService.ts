/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../../99-utilities/date/TransmitTimesDateHelper.ts"/>
/// <reference path="../../../99-utilities/objects/ObjectHelper.ts"/>

/// <reference path="../../contracts/stationdetail/IBroadcastsLocalRepository.ts"/>
/// <reference path="../../contracts/stationdetail/ITransmitTimesLocalRepository.ts"/>
/// <reference path="../../contracts/station/IStationLocalRepository.ts"/>

/// <reference path="../../entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../businessentities/stationdetail/BroadcastsEntityWithStationName.ts"/>
/// <reference path="../../businessentities/stationdetail/BroadcastsEntityWithTransmitTime.ts"/>
/// <reference path="../../businessentities/stationdetail/BroadcastsEntityWithTransmitTimeAndStationName.ts"/>

/// <reference path="../../entities/station/StationEntity.ts"/>

/// <reference path="../../entities/stationdetail/TransmitTimesEntity.ts"/>

module freeradios.business.service.stationdetail
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities;
    import date = freeradios.utilities.date;
    
    export class BroadcastsService
    {
        private _broadcastsRepository : contracts.stationdetail.IBroadcastsLocalRepository;
        private _transmitTimesRepository : contracts.stationdetail.ITransmitTimesLocalRepository;
        private _stationsRepository : contracts.station.IStationLocalRepository;
        
        constructor(
            broadcastsRepository? : contracts.stationdetail.IBroadcastsLocalRepository,
            transmitTimesRepository? : contracts.stationdetail.ITransmitTimesLocalRepository,
            stationsRepository? : contracts.station.IStationLocalRepository)
        {
            this._broadcastsRepository = di.DIContainer.get<contracts.stationdetail.IBroadcastsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IBroadcastsLocalRepository",
                broadcastsRepository);
            
            this._transmitTimesRepository = di.DIContainer.get<contracts.stationdetail.ITransmitTimesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ITransmitTimesLocalRepository",
                transmitTimesRepository);
            
            this._stationsRepository = di.DIContainer.get<contracts.station.IStationLocalRepository>(
                "freeradios.business.contracts.station.IStationLocalRepository",
                stationsRepository
            );
        }
        
        public getCurrentBroadcast(stationID : number, callback : (broadcast : entities.stationdetail.BroadcastsEntity, timeFrom : string, timeTo : string) => any)
        {
            (function(self : BroadcastsService)
            {
                self._transmitTimesRepository.getListByStationID(stationID, function(transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>)
                {
                    var dateNow = new Date();
                    
                    for (var i = 0, length = transmitTimes.length; i < length; ++i)
                    {
                        var currentTransmitTime = transmitTimes[i];
                        
                        if (date.TransmitTimesDateHelper.isTransmitTimeNow(currentTransmitTime))
                        {   
                            self._broadcastsRepository.getSingle(currentTransmitTime.stationID, currentTransmitTime.broadcastsID, function(broadcast : entities.stationdetail.BroadcastsEntity)
                            {
                                callback(broadcast, currentTransmitTime.timeFrom, currentTransmitTime.timeTo);
                            });
                            return;
                        }
                    }
                    
                    callback(null, null, null);
                });
            }(this));
        }
        
        public getList(callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this._broadcastsRepository.getList(callback); 
        }
        
        public getForStation(stationID : number, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this._broadcastsRepository.getListByStationID(stationID, callback);
        }
        
        public getSingle(stationID : number, broadcastID : number, callback : (broadcast : entities.stationdetail.BroadcastsEntity) => any)
        {
            this._broadcastsRepository.getSingle(stationID, broadcastID, callback);
        }
        
        public search(searchText : string, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this._broadcastsRepository.searchInTitleAndDescriptionAndCategories(searchText, callback);
        }
        
        public searchForStation(stationID : number, searchText : string, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this._broadcastsRepository.searchInTitleAndDescriptionAndCategoriesForStation(stationID, searchText, callback);
        }
        
        public searchFilteredByCategories(searchText : string, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this._broadcastsRepository.searchInTitleAndDescriptionAndCategoriesFilteredByCategories(searchText, categoryIDs, callback);
        }
        
        public searchFilteredByCategoriesForStation(stationID : number, searchText : string, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this._broadcastsRepository.searchInTitleAndDescriptionAndCategoriesFilteredByCategoriesForStation(stationID, searchText, categoryIDs, callback);
        }
        
        public getFilteredByCategories(categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this._broadcastsRepository.getFilteredByCategories(categoryIDs, callback);
        }
        
        public getFilteredByCategoriesForStation(stationID : number, categoryIDs : Array<number>, callback : (broadcasts : Array<entities.stationdetail.BroadcastsEntity>) => any)
        {
            this._broadcastsRepository.getFilteredByCategoriesForStation(stationID, categoryIDs, callback);
        }
        
        public getListWithStationName(callback : (broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithStationName>) => any)
        {
            (function(self : BroadcastsService)
            {
                self.getList(function(broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithStationName>)
                {
                   self._appendStationNames(broadcasts, callback);                   
                });
            }(this));
        }
        
        public searchWithStationName(searchText : string, callback : (broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithStationName>) => any)
        {
            (function(self : BroadcastsService)
            {
                self._broadcastsRepository.searchInTitleAndDescriptionAndCategoriesAndStationName(searchText, function(broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithStationName>)
                {
                   self._appendStationNames(broadcasts, callback);                   
                });
            }(this));
        }
        
        public getFilteredByCategoriesForStationWithStationName(stationID : number, categoryIDs : Array<number>, callback : (broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithStationName>) => any)
        {
            (function(self : BroadcastsService)
            {
                self.getFilteredByCategoriesForStation(stationID, categoryIDs, function(broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithStationName>)
                {
                   self._appendStationNames(broadcasts, callback);                   
                });
            }(this));
        }
        
        public getFilteredByCategoriesForDayWithTimesAndStationName(day : Date, categoryIDs : Array<number>, callback : (broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTimeAndStationName>) => any)
        {
            (function(self : BroadcastsService)
            {
                var dayString = utilities.date.TransmitTimesDateHelper.getDayStringFromDate(day);
                
                self.getFilteredByCategories(categoryIDs, function(broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTimeAndStationName>)
                {
                   self._transmitTimesRepository.getListForDayAndBroadcasts(dayString, broadcasts, function(transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>)
                   {
                       self._appendStationNames(broadcasts, function(stationBroadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTimeAndStationName>)
                       {
                           self._sharedGetListForDayWithTransmitTimes(day, stationBroadcasts, transmitTimes, callback);
                       });                                              
                   });                                     
                });
            }(this));
        }        
        
        public getListForDayWithTransmitTimes(day : Date, callback : (broadcasts : Array<businessentities.stationdetail.BroadcastsEntityWithTransmitTime>) => any)
        {
            (function(self : BroadcastsService)
            {
                self.getList(function(broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTime>)
                {
                    self._transmitTimesRepository.getList(function(transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>)
                    {
                        self._sharedGetListForDayWithTransmitTimes(day, broadcasts, transmitTimes, callback);
                    });
                });
            }(this));
        }
        
        public getListForDayWithTimesForStation(stationID : number, day : Date, callback : (broadcasts : Array<businessentities.stationdetail.BroadcastsEntityWithTransmitTime>) => any)
        {
            (function(self : BroadcastsService)
            {
                self.getForStation(stationID, function(broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTime>)
                {
                    self._transmitTimesRepository.getListByStationID(stationID, function(transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>)
                    {
                        self._sharedGetListForDayWithTransmitTimes(day, broadcasts, transmitTimes, callback);
                    });
                });
            }(this));
        }
        
        private _sharedGetListForDayWithTransmitTimes(
            day : Date,
            broadcasts : Array<businessentities.stationdetail.BroadcastsEntityWithTransmitTime>,
            transmitTimes : Array<entities.stationdetail.TransmitTimesEntity>,
            callback : (broadcasts : Array<businessentities.stationdetail.BroadcastsEntityWithTransmitTime>) => any)
        {
            var results = new Array<businessentities.stationdetail.BroadcastsEntityWithTransmitTime>();
            
            for (var i = 0, lengthI = broadcasts.length; i < lengthI; ++i)
            {
                var currentBroadcast = broadcasts[i];
                
                for (var j = 0, lengthJ = transmitTimes.length; j < lengthJ; ++j)
                {
                    var currentTransmitTime = transmitTimes[j];
                    
                    if (currentTransmitTime.stationID === currentBroadcast.stationID && currentTransmitTime.broadcastsID === currentBroadcast.id)
                    {
                        if (date.TransmitTimesDateHelper.isTransmitTimeOfDay(day, currentTransmitTime))
                        {
                            var broadcastClone = freeradios.utilities.objects.ObjectHelper.cloneObject(currentBroadcast);
                            
                            broadcastClone.timeFrom = currentTransmitTime.timeFrom;
                            broadcastClone.timeTo = currentTransmitTime.timeTo;
                            
                            results.push(broadcastClone);                            
                        }
                    }
                }
            }
            
            results.sort(function(broadcast1, broadcast2)
            {
                return broadcast1.timeFrom.localeCompare(broadcast2.timeFrom);
            });
            
            callback(results);                 
        }
        
        private _appendStationNames(broadcasts : Array<businessentities.stationdetail.BroadcastsEntityWithStationName>, callback : (favoriteBroadcastsWithStationName : Array<businessentities.stationdetail.BroadcastsEntityWithStationName>) => any)
        {
            this._stationsRepository.getStationList(function(stations : Array<entities.station.StationEntity>)
            {
                for (var i = 0, length = broadcasts.length; i < length; ++i)
                {
                    var currentBroadcast = broadcasts[i];
                    
                    currentBroadcast.stationName = stations.filter(function(element : entities.station.StationEntity)
                    {
                        return element.id === currentBroadcast.stationID;
                    })[0].name;                    
                }
                
                callback(broadcasts);
            });          
        }
    }
}