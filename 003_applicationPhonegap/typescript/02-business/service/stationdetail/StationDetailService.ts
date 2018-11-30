/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../contracts/stationdetail/IStationDetailLocalRepository.ts"/>

/// <reference path="../../entities/stationdetail/StationDetailEntity.ts"/>

module freeradios.business.service.stationdetail
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities.stationdetail;
    
    export class StationDetailService
    {
        private _repository : contracts.stationdetail.IStationDetailLocalRepository;
        
        constructor(repository? : contracts.stationdetail.IStationDetailLocalRepository)
        {
            this._repository = di.DIContainer.get<contracts.stationdetail.IStationDetailLocalRepository>(
                "freeradios.business.contracts.stationdetail.IStationDetailLocalRepository",
                repository);                  
        }
        
        public getList(callback : (stationsDetails : Array<entities.StationDetailEntity>) => any)
        {
            this._repository.getList(callback); 
        }
        
        public getForStation(stationID : number, callback : (stationsDetail : entities.StationDetailEntity) => any)
        {
            this._repository.getByStationID(stationID, callback);
        }
        
        public search(searchText : string, callback : (stations: Array<entities.StationDetailEntity>) => any)
        {
            this._repository.searchInDisplayNameAndFullNameAndCity(searchText, callback);           
        }
    }
}