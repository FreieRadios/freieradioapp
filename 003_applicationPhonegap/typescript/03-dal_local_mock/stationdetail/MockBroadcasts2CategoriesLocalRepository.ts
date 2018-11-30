/// <reference path="../../02-business/entities/stationdetail/Broadcasts2CategoriesEntity.ts"/>
/// <reference path="../../02-business/contracts/stationdetail/IBroadcasts2CategoriesLocalRepository.ts"/>

module freeradios.dal_local_mock.stationdetail
{
    import entities = business.entities.stationdetail;
    
    export class MockBroadcasts2CategoriesLocalRepository implements business.contracts.stationdetail.IBroadcasts2CategoriesLocalRepository
    {            
        public saveConnection(connection : entities.Broadcasts2CategoriesEntity, callback : (success : boolean) => any)
        {
            callback(true);
        }
                       
        public saveConnectionsArray(connections : Array<entities.Broadcasts2CategoriesEntity>, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            callback(true);
        }
    }
}