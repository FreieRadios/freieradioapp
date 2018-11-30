/// <reference path="../MasterUpdatableController.ts"/>
/// <reference path="../../view/IView.ts"/>
/// <reference path="../../router/IRouter.ts"/>

/// <reference path="../../../02-business/service/stationdetail/BroadcastsService.ts"/>
/// <reference path="../../../02-business/service/stationdetail/CategoriesService.ts"/>

/// <reference path="../../../99-utilities/navigation/URLParameters.ts"/>

module freeradios.presentation.controller.home
{
    export class ScheduleDetailController extends MasterUpdatableController
    {
        private _broadcastsService : business.service.stationdetail.BroadcastsService;
        private _categoriesService : business.service.stationdetail.CategoriesService;    
        
        constructor(view? : view.IView, masterView? : view.IView)
        {
            super("Sendeplan", "templates/home/scheduledetail.html", view, masterView);
            
            this._broadcastsService = new business.service.stationdetail.BroadcastsService();
            this._categoriesService = new business.service.stationdetail.CategoriesService();
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
            (function(self : ScheduleDetailController)
            {
                var categoryIDs = self._getCategoryIDsFromParameters();            
                var date = new Date(utilities.navigation.URLParameters.getParameterNumber("date_timestamp"));
                var timeFrom = utilities.navigation.URLParameters.getParameter("time_from");
                var timeTo = utilities.navigation.URLParameters.getParameter("time_to");
                
                self._broadcastsService.getFilteredByCategoriesForDayWithTimesAndStationName(date, categoryIDs, function(broadcasts)
                {
                    self._categoriesService.getByIDList(categoryIDs, function(categories)
                    {
                        var filteredBroadcasts = self._filterBroadcastsForTime(timeFrom, timeTo, broadcasts);
                        
                        view.assign("broadcasts", filteredBroadcasts);
                        view.assign("categories", categories);
                        view.assign("timeFrom", timeFrom);
                        view.assign("timeTo", timeTo);
                        view.assign("broadcastDate", date);
                        finishCallback();
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
        }
        
        public bindListeners()
        {
        }
        
        private _getCategoryIDsFromParameters() : Array<number>
        {
            var categoryIDs : Array<number>;
            
            try
            {
                categoryIDs = JSON.parse(utilities.navigation.URLParameters.getParameter("categories"));
            }
            catch(e)
            {
                categoryIDs = new Array<number>();
            }
            
            if (categoryIDs === null)
            {
                categoryIDs = new Array<number>();
            }
            
            return categoryIDs;
        }
        
        private _filterBroadcastsForTime(timeFrom : string, timeTo : string, broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTimeAndStationName>)
            : Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTimeAndStationName>
        {
            var results = new Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTimeAndStationName>();
            
            for (var i = 0, length = broadcasts.length; i < length; ++i)
            {
                var currentBroadcast = broadcasts[i];
                
                if (utilities.date.TransmitTimesDateHelper.doTimesIntersect(currentBroadcast.timeFrom, currentBroadcast.timeTo, timeFrom, timeTo))
                {
                    results.push(currentBroadcast);
                }
            }
            
            return results;
        }
    }
}