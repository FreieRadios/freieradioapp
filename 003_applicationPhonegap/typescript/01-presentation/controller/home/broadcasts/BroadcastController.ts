/// <reference path="../../MasterUpdatableController.ts"/>
/// <reference path="../../../view/IView.ts"/>
/// <reference path="../../../router/IRouter.ts"/>

/// <reference path="../../../../99-utilities/navigation/URLParameters.ts"/>
/// <reference path="../../../../99-utilities/runtime/PlatformEvent.ts"/>

/// <reference path="../../../../98-frameworks/jquery/jquery.d.ts"/>

/// <reference path="../../../../02-business/service/stationdetail/BroadcastsService.ts"/>

module freeradios.presentation.controller.home.broadcasts
{
    export class BroadcastController extends MasterUpdatableController
    {
        private _broadcastsService : business.service.stationdetail.BroadcastsService;    
        
        private _stationID : number;
        private _date : Date;        
        
        constructor(view? : view.IView, masterView? : view.IView)
        {
            super("Senderdetails", "templates/home/broadcasts/broadcast.html", view, masterView);
            
            this._broadcastsService = new business.service.stationdetail.BroadcastsService();
            
            this._stationID = utilities.navigation.URLParameters.getParameterNumber("station_id");
            
            var dateTimeStamp = utilities.navigation.URLParameters.getParameterNumber("date_timestamp");            
            this._date = dateTimeStamp > 0 ? new Date(dateTimeStamp) : new Date();
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
            (function(self : BroadcastController)
            {
                self._broadcastsService.getListForDayWithTimesForStation(self._stationID, self._date, function(broadcasts)
                {
                    view.assign("stationID", self._stationID);
                    view.assign("broadcastDate", self._date);
                    view.assign("isBroadcastDayToday", self._isBroadcastDayToday());
                    view.assign("broadcasts", broadcasts);
                    finishCallback();
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
            (function(self : BroadcastController)
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".broadcast-navigation-arrow-back"), function()
                {
                    self._switchDate(-1);
                });
                
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".broadcast-navigation-arrow-forward"), function()
                {
                    self._switchDate(1);
                });
            }(this));
        }
        
        private _switchDate(daysToAdd : number)
        {
            var nextDate = new Date(this._date.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
            this._date = nextDate;
            this.getRouter().setParameter("date_timestamp", this._date.getTime());            
            this._updateList();
        }
        
        private _updateList()
        {
            (function(self : BroadcastController)
            {
                self._broadcastsService.getListForDayWithTimesForStation(self._stationID, self._date, function(broadcasts)
                {
                    var view = self.getView();
                    view.assign("stationID", self._stationID);
                    view.assign("broadcastDate", self._date);
                    view.assign("isBroadcastDayToday", self._isBroadcastDayToday());
                    view.assign("broadcasts", broadcasts);
                    view.updateView("#list");
                    self.bindListeners();
                });
            }(this));
        }
        
        private _isBroadcastDayToday() : boolean
        {
            var today = new Date();
            
            var returnValue = this._date.getFullYear() === today.getFullYear()
                                && this._date.getMonth() === today.getMonth()
                                && this._date.getDate() === today.getDate();
            
            return returnValue;
        }      
    }
}