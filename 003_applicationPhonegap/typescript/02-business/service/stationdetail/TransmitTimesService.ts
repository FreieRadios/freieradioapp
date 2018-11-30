/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../contracts/stationdetail/ITransmitTimesLocalRepository.ts"/>

/// <reference path="../../entities/stationdetail/TransmitTimesEntity.ts"/>

module freeradios.business.service.stationdetail
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities.stationdetail;
    
    export class TransmitTimesService
    {
        private _repository : contracts.stationdetail.ITransmitTimesLocalRepository;
        
        constructor(repository? : contracts.stationdetail.ITransmitTimesLocalRepository)
        {
            this._repository = di.DIContainer.get<contracts.stationdetail.ITransmitTimesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ITransmitTimesLocalRepository",
                repository);                  
        }
        
        public getList(callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            this._repository.getList(callback); 
        }
        
        public getForStation(stationID : number, callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            this._repository.getListByStationID(stationID, callback);
        }
        
        public getForBroadcast(stationID : number, broadcastID : number, callback : (transmitTimes : Array<entities.TransmitTimesEntity>) => any)
        {
            this._repository.getListByStationIDAndBroadcastID(stationID, broadcastID, callback);
        }
    }
}