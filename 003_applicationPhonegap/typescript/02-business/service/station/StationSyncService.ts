/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../contracts/station/IStationLocalRepository.ts"/>
/// <reference path="../../contracts/station/IStationWebRepository.ts"/>
/// <reference path="../../entities/station/StationEntity.ts"/>

module freeradios.business.service.station
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities.station;
    
    export class StationSyncService
    {
        private _localRepository : contracts.station.IStationLocalRepository;
        private _webRepository : contracts.station.IStationWebRepository;    
        
        constructor(localRepository? : contracts.station.IStationLocalRepository, webRepository? : contracts.station.IStationWebRepository)
        {
           this._localRepository = di.DIContainer.get<contracts.station.IStationLocalRepository>(
                "freeradios.business.contracts.station.IStationLocalRepository",                
                localRepository);
           
            this._webRepository = di.DIContainer.get<contracts.station.IStationWebRepository>(
                "freeradios.business.contracts.station.IStationWebRepository",
                webRepository);
        }
        
        public sync(callback : (success : boolean) => any)
        {
            (function(self : StationSyncService)
            {
                self._webRepository.getStationList(function(stations: Array<entities.StationEntity>)
                {
                    self._localRepository.deleteAll(function(success : boolean)
                    {
                        self._localRepository.saveStationArray(stations, function(success : boolean)
                        {
                            callback(success);
                        });
                    });
                }, function()
                {
                    callback(false);
                });
            }(this));
        }
    }
}