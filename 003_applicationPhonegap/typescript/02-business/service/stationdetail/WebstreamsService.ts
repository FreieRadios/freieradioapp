/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../contracts/stationdetail/IWebstreamsLocalRepository.ts"/>

/// <reference path="../../entities/stationdetail/WebstreamsEntity.ts"/>

module freeradios.business.service.stationdetail
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities.stationdetail;
    
    export class WebstreamsService
    {
        private _repository : contracts.stationdetail.IWebstreamsLocalRepository;
        
        constructor(repository? : contracts.stationdetail.IWebstreamsLocalRepository)
        {
            this._repository = di.DIContainer.get<contracts.stationdetail.IWebstreamsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IWebstreamsLocalRepository",
                repository);                  
        }
        
        public getList(callback : (webstreams : Array<entities.WebstreamsEntity>) => any)
        {
            this._repository.getList(callback); 
        }
        
        public getForStation(stationID : number, callback : (webstreams : Array<entities.WebstreamsEntity>) => any)
        {
            this._repository.getListByStationID(stationID, callback);
        }
    }
}