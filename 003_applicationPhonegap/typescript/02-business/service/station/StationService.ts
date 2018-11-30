/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../contracts/station/IStationLocalRepository.ts"/>
/// <reference path="../../entities/station/StationEntity.ts"/>

module freeradios.business.service.station
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities.station;
    
    export class StationService
    {
        private _repository : contracts.station.IStationLocalRepository;
        
        constructor(repository? : contracts.station.IStationLocalRepository)
        {
           this._repository = di.DIContainer.get<contracts.station.IStationLocalRepository>(
                "freeradios.business.contracts.station.IStationLocalRepository",                
                repository);
        }
        
        public getByID(id : number, callback : (station: entities.StationEntity) => any)
        {
            this._repository.getByID(id, callback);            
        }
        
        public getStationList(callback : (stations: Array<entities.StationEntity>) => any)
        {
            this._repository.getStationList(callback);            
        }
        
        public search(searchText : string, callback : (stations: Array<entities.StationEntity>) => any)
        {
            this._repository.searchInNameAndCity(searchText, callback);          
        }
    }
}