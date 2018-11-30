/// <reference path="../../MasterUpdatableController.ts"/>
/// <reference path="../../../view/IView.ts"/>
/// <reference path="../../../router/IRouter.ts"/>

/// <reference path="../../../../02-business/service/stationdetail/StationDetailService.ts"/>

/// <reference path="../../../../99-utilities/navigation/URLParameters.ts"/>

module freeradios.presentation.controller.home.broadcasts
{
    export class BroadcastContactController extends MasterUpdatableController
    {
        private _stationDetailService : business.service.stationdetail.StationDetailService;
        
        private _stationID : number;    
        
        constructor(view? : view.IView, masterView? : view.IView)
        {
            super("Senderdetails", "templates/home/broadcasts/broadcastcontact.html", view, masterView);
            
            this._stationDetailService = new business.service.stationdetail.StationDetailService();
            
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
            (function(self : BroadcastContactController)
            {
                self._stationDetailService.getForStation(self._stationID, function(stationDetail)
                {
                    view.assign("stationDetail", stationDetail);
                    view.assign("stationID", self._stationID);
                    finishCallback();
                });
            }(this));
        }
        
        public bindListeners()
        {
        }
        
        public destroyView()
        {         
            super.destroyView();
        }
        
        public onready()
        {
            super.onready();
        }
    }
}