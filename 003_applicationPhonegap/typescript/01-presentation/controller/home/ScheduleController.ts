/// <reference path="../MasterUpdatableController.ts"/>
/// <reference path="../../view/IView.ts"/>
/// <reference path="../../router/IRouter.ts"/>

/// <reference path="../../../02-business/service/stationdetail/BroadcastsService.ts"/>
/// <reference path="../../../02-business/service/stationdetail/CategoriesService.ts"/>

/// <reference path="../../../99-utilities/date/TransmitTimesDateHelper.ts"/>
/// <reference path="../../../99-utilities/navigation/URLParameters.ts"/>

module freeradios.presentation.controller.home
{
    export class ScheduleController extends MasterUpdatableController
    {
        private _broadcastsService : business.service.stationdetail.BroadcastsService;
        private _categoriesService : business.service.stationdetail.CategoriesService;
        
        private _date : Date;
        private _genresListIsOpen : boolean;
        private _selectedCategoryIDs : Array<number>;
        
        constructor(view? : view.IView, masterView? : view.IView)
        {
            super("Sendeplan", "templates/home/schedule.html", view, masterView);
            
            this._broadcastsService = new business.service.stationdetail.BroadcastsService();
            this._categoriesService = new business.service.stationdetail.CategoriesService();
            
            var dateTimeStamp = utilities.navigation.URLParameters.getParameterNumber("date_timestamp");            
            this._date = dateTimeStamp > 0 ? new Date(dateTimeStamp) : new Date();
            
            this._genresListIsOpen = false;
            
            this._selectedCategoryIDs = this._getCategoryIDsFromParameters();            
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
            (function(self : ScheduleController)
            {
                self._broadcastsService.getFilteredByCategoriesForDayWithTimesAndStationName(self._date, self._selectedCategoryIDs, function(broadcasts)
                {
                    self._categoriesService.getList(function(categories)
                    {
                        var transmitTimesToBroadcasts = self._groupBroadcastsByTransmitTimes(broadcasts);
                        
                        view.assign("broadcastDate", self._date);
                        view.assign("dateTimeStamp", self._date.getTime());
                        view.assign("isBroadcastDayToday", self._isBroadcastDayToday());
                        view.assign("transmitTimesToBroadcasts", transmitTimesToBroadcasts);
                        view.assign("categories", categories);
                        view.assign("selectedCategoryIDs", self._selectedCategoryIDs);
                        view.assign("categoriesQueryValue", JSON.stringify(self._selectedCategoryIDs));
                        view.assign("genresListIsOpen", self._genresListIsOpen);  
                        
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
            this.bindListeners();
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
            (function(self : ScheduleController)
            {
                var view = self.getView();
                
                self.updateViewAssignments(view, function()
                {
                    view.updateView("#list");
                    self.bindListeners();
                });
            }(this));
        }
        
        public bindListeners()
        {
            (function(self : ScheduleController)
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".broadcast-navigation-arrow-back"), function()
                {
                    self._switchDate(-1);
                });
                
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".broadcast-navigation-arrow-forward"), function()
                {
                    self._switchDate(1);
                });
                
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".genres-item"), function(e, target)
                {
                    var categoryID = parseInt(target.attr("data-category-id"), 10);
                    
                    if (target.hasClass("active"))
                    {
                        target.removeClass("active");
                        
                        for (var i = 0, length = self._selectedCategoryIDs.length; i < length; ++i)
                        {
                            if (self._selectedCategoryIDs[i] === categoryID)
                            {
                                self._selectedCategoryIDs.splice(i, 1);
                                break;
                            }
                        }
                    }
                    else
                    {
                        target.addClass("active");
                        self._selectedCategoryIDs.push(categoryID);
                    }
                    
                    self.getRouter().setParameter("categories", JSON.stringify(self._selectedCategoryIDs));
                    
                    self._updateList();
                });
                
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".genres-title"), function()
                {
                    var title = $(".genres-title");
                    var list = $(".genres-list");
                    
                    if (self._genresListIsOpen)
                    {
                        list.slideUp();
                        title.find(".genres-icon").attr("src", "img/03_dropdown/03.1_dropdown-arrow.png");
                    }
                    else
                    {
                        list.slideDown();
                        title.find(".genres-icon").attr("src", "img/03_dropdown/03.1_dropdown-arrow-active.png");
                    }
                    
                    self._genresListIsOpen = !self._genresListIsOpen;
                });
            }(this));
        }
        
        private _groupBroadcastsByTransmitTimes(broadcasts : Array<business.businessentities.stationdetail.BroadcastsEntityWithTransmitTimeAndStationName>)
            : {[timeString : string] : { timeFrom : string; timeTo : string; broadcasts : Array<business.entities.stationdetail.BroadcastsEntity> }}
        {
            var transmitTimes : Array<{ timeFrom : string; timeTo : string; displayTimeTo : string }> =
            [
                { timeFrom : "00:00", timeTo : "00:59", displayTimeTo : "01:00" },
                { timeFrom : "01:00", timeTo : "01:59", displayTimeTo : "02:00" },
                { timeFrom : "02:00", timeTo : "05:59", displayTimeTo : "06:00" },
                { timeFrom : "06:00", timeTo : "06:59", displayTimeTo : "07:00" },
                { timeFrom : "07:00", timeTo : "07:59", displayTimeTo : "08:00" },
                { timeFrom : "08:00", timeTo : "08:59", displayTimeTo : "09:00" },
                { timeFrom : "09:00", timeTo : "09:59", displayTimeTo : "10:00" },
                { timeFrom : "10:00", timeTo : "10:59", displayTimeTo : "11:00" },
                { timeFrom : "11:00", timeTo : "11:59", displayTimeTo : "12:00" },
                { timeFrom : "12:00", timeTo : "12:59", displayTimeTo : "13:00" },
                { timeFrom : "13:00", timeTo : "13:59", displayTimeTo : "14:00" },
                { timeFrom : "14:00", timeTo : "14:59", displayTimeTo : "15:00" },
                { timeFrom : "15:00", timeTo : "15:59", displayTimeTo : "16:00" },
                { timeFrom : "16:00", timeTo : "16:59", displayTimeTo : "17:00" },
                { timeFrom : "17:00", timeTo : "17:59", displayTimeTo : "18:00" },
                { timeFrom : "18:00", timeTo : "18:59", displayTimeTo : "19:00" },
                { timeFrom : "19:00", timeTo : "19:59", displayTimeTo : "20:00" },
                { timeFrom : "20:00", timeTo : "20:59", displayTimeTo : "21:00" },
                { timeFrom : "21:00", timeTo : "21:59", displayTimeTo : "22:00"},
                { timeFrom : "22:00", timeTo : "22:59", displayTimeTo : "23:00" },
                { timeFrom : "23:00", timeTo : "23:59", displayTimeTo : "24:00" }
            ];
            
            var results : {[timeString : string] : { timeFrom : string; checkTimeTo: string; timeTo : string; broadcasts : Array<business.entities.stationdetail.BroadcastsEntity> }} = {};
            
            for (var j = 0, lengthJ = transmitTimes.length; j < lengthJ; ++j)
            {
                var currentTime = transmitTimes[j];
                var timeString = currentTime.timeFrom + "|" + currentTime.timeTo;
                
                results[timeString] =
                {
                    timeFrom : currentTime.timeFrom,
                    timeTo : currentTime.displayTimeTo,
                    checkTimeTo : currentTime.timeTo,
                    broadcasts : new Array<business.entities.stationdetail.BroadcastsEntity>()
                };
            }
            
            for (var i = 0, lengthI = broadcasts.length; i < lengthI; ++i)
            {
                var currentBroadcast = broadcasts[i];
                
                for (var j = 0, lengthJ = transmitTimes.length; j < lengthJ; ++j)
                {
                    var currentTime = transmitTimes[j];
                    
                    if (utilities.date.TransmitTimesDateHelper.doTimesIntersect(currentBroadcast.timeFrom, currentBroadcast.timeTo, currentTime.timeFrom, currentTime.timeTo))
                    {
                        var timeString = currentTime.timeFrom + "|" + currentTime.timeTo;
                        results[timeString].broadcasts.push(currentBroadcast);                        
                    }
                }
            }            
            
            return results;
        }
        
        private _isBroadcastDayToday() : boolean
        {
            var today = new Date();
            
            var returnValue = this._date.getFullYear() === today.getFullYear()
                                && this._date.getMonth() === today.getMonth()
                                && this._date.getDate() === today.getDate();
            
            return returnValue;
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
    }
}