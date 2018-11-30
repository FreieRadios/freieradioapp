/// <reference path="../controller/IUpdateableController.ts"/>

/// <reference path="../../02-business/service/station/StationService.ts"/>
/// <reference path="../../02-business/service/station/StationSyncService.ts"/>
/// <reference path="../../02-business/service/stationdetail/StationDetailSyncService.ts"/>

/// <reference path="../../02-business/entities/station/StationEntity.ts"/>

module freeradios.presentation.sync
{
    export class SyncManager
    {
        private static _updateableControllers = new Array<controller.IUpdateableController>(); 
        
        public static sync()
        {
            var stationSyncService = new business.service.station.StationSyncService();
            var stationService = new business.service.station.StationService();
            
            stationSyncService.sync(function(success : boolean)
            {
                var stationDetailService = new business.service.stationdetail.StationDetailSyncService();

                var stations = stationService.getStationList(function(stations : Array<business.entities.station.StationEntity>)
                {
                    SyncManager._syncNextStationDetail(stationDetailService, stations, 0, stations.length);
                });
            });
        }
        
        public static addUpdatableController(controller : controller.IUpdateableController)
        {
            SyncManager._updateableControllers.push(controller);
        }
        
        public static removeUpdatableController(controller : controller.IUpdateableController)
        {
            for (var i = 0, length = SyncManager._updateableControllers.length; i < length; ++i)
            {
                var currentController = SyncManager._updateableControllers[i];
                
                if (currentController === controller)
                {
                    SyncManager._updateableControllers.splice(i, 1);
                    // run again to remove multiple adds
                    this.removeUpdatableController(controller);
                    break;
                }
            }
        }
        
        private static _syncNextStationDetail(
            stationDetailService : business.service.stationdetail.StationDetailSyncService,
            stations : Array<business.entities.station.StationEntity>, 
            index : number,
            length : number
        )
        {
            if (index < length)
            {
                stationDetailService.sync(stations[index], function(success : boolean)
                {
                    SyncManager._syncNextStationDetail(stationDetailService, stations, index + 1, length);
                });
            }
            else
            {
                SyncManager._triggerControllerUpdates();
            }
        }
        
        private static _triggerControllerUpdates()
        {
            for (var i = 0, length = SyncManager._updateableControllers.length; i < length; ++i)
            {
                SyncManager._updateableControllers[i].updateController();
            }
        }
    }
}