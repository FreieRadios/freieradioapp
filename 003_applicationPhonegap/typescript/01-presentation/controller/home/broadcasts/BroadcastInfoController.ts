/// <reference path="../../MasterUpdatableController.ts"/>
/// <reference path="../../../view/IView.ts"/>
/// <reference path="../../../router/IRouter.ts"/>

/// <reference path="../../../../02-business/service/station/StationService.ts"/>
/// <reference path="../../../../02-business/service/stationdetail/BroadcastsService.ts"/>
/// <reference path="../../../../02-business/service/stationdetail/StationDetailService.ts"/>
/// <reference path="../../../../02-business/service/stationdetail/MediaChannelsService.ts"/>

/// <reference path="../../../../99-utilities/navigation/URLParameters.ts"/>
/// <reference path="../../../../99-utilities/audio/StreamPlayer.ts"/>
/// <reference path="../../../../99-utilities/runtime/PlatformEvent.ts"/>

/// <reference path="../../../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.presentation.controller.home.broadcasts
{
    export class BroadcastInfoController extends MasterUpdatableController
    {
        private _stationService : business.service.station.StationService;
        private _stationDetailService : business.service.stationdetail.StationDetailService;    
        private _mediaChannelsService : business.service.stationdetail.MediaChannelsService;
        private _broadcastsService : business.service.stationdetail.BroadcastsService;
        
        private _stationID : number;
        
        constructor(view? : view.IView, masterView? : view.IView)
        {
            super("Senderdetails", "templates/home/broadcasts/broadcastinfo.html", view, masterView);
            
            this._stationService = new business.service.station.StationService();
            this._stationDetailService = new business.service.stationdetail.StationDetailService();
            this._mediaChannelsService = new business.service.stationdetail.MediaChannelsService();
            this._broadcastsService = new business.service.stationdetail.BroadcastsService();
            
            this._stationID = utilities.navigation.URLParameters.getParameterNumber("station_id");
        }
        
        public createView(callback : (view : view.IView) => any)
        {
            var self = this;
            
            super.createView(function(view : view.IView)
            {
                self.updateViewAssignments(view, function()
                {
                    callback(view);
                });
            });
        }
                
        public updateViewAssignments(view : view.IView, finishCallback : () => any)
        {
            (function(self : BroadcastInfoController)
            {
                self._stationService.getByID(self._stationID, function(station)
                {
                    self._stationDetailService.getForStation(self._stationID, function(stationDetail)
                    {  
                        if(stationDetail == null){
                            alert("Fehler bei der Verbindung zum Server oder fehlerhaften Daten. Bitte starten sie die App zu einem späteren Zeitpunkt erneut und versuchen sie es dann nochmal.");
 //                           self.getRouter().navigateBack();
                            return;
                        }
                        self._mediaChannelsService.getMediaChannelTypes(self._stationID, function(mediaChannelTypes)
                        {
                            self._broadcastsService.getCurrentBroadcast(self._stationID, function(broadcast, timeFrom, timeTo)
                            {       
                                view.assign("currentBroadcast", broadcast);
                                view.assign("currentBroadcastTimeFrom", timeFrom);
                                view.assign("currentBroadcastTimeTo", timeTo);                     
                                view.assign("mediaChannelTypes", mediaChannelTypes);
                                view.assign("station", station);
                                stationDetail.city = station.city;
                                view.assign("stationDetail", stationDetail);                                
                                view.assign("stationID", self._stationID);                  
                                finishCallback();
                            });
                        });
                    });
                });
            }(this));
        }

        public destroyView()
        {         
            super.destroyView();
        }
        
        public onready()
        {
            super.onready();
            this.bindListeners();
        }
        
        public bindListeners()
        {
            var streamContainer = $(".broadcast-stream");
            var streamURL = streamContainer.attr("data-stream-url");
            var streamTitle = streamContainer.attr("data-stream-title");
            
            utilities.runtime.PlatformEvent.bindClickListenerJQuery(streamContainer, function()
            {
                utilities.audio.StreamPlayer.play(streamURL, streamTitle);
            });
        }



    }
}
