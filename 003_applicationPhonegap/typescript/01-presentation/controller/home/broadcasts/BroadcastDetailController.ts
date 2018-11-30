/// <reference path="../../MasterUpdatableController.ts"/>
/// <reference path="../../../view/IView.ts"/>
/// <reference path="../../../router/IRouter.ts"/>

/// <reference path="../../../../02-business/service/favorites/BroadcastFavoritesService.ts"/>

/// <reference path="../../../../02-business/service/stationdetail/BroadcastsService.ts"/>
/// <reference path="../../../../02-business/service/stationdetail/TransmitTimesService.ts"/>
/// <reference path="../../../../02-business/service/stationdetail/CategoriesService.ts"/>

/// <reference path="../../../../99-utilities/navigation/URLParameters.ts"/>
/// <reference path="../../../../99-utilities/runtime/PlatformEvent.ts"/>
/// <reference path="../../../../99-utilities/date/TransmitTimesDateHelper.ts"/>

/// <reference path="../../../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.presentation.controller.home.broadcasts
{
    export class BroadcastDetailController extends MasterUpdatableController
    {
        private _stationID : number;
        private _broadcastsID : number;
        
        private _favoritesService : business.service.favorites.BroadcastFavoritesService;      
        private _broadcastsService : business.service.stationdetail.BroadcastsService;
        private _transmitTimesService : business.service.stationdetail.TransmitTimesService;    
        private _categoriesService : business.service.stationdetail.CategoriesService;
        
        constructor(view? : view.IView, masterView? : view.IView)
        {
            super("Senderdetails", "templates/home/broadcasts/broadcastdetail.html", view, masterView);
                        
            this._favoritesService = new business.service.favorites.BroadcastFavoritesService();
            this._broadcastsService = new business.service.stationdetail.BroadcastsService();
            this._transmitTimesService = new business.service.stationdetail.TransmitTimesService();    
            this._categoriesService = new business.service.stationdetail.CategoriesService();
            
            this._stationID = utilities.navigation.URLParameters.getParameterNumber("station_id");
            this._broadcastsID = utilities.navigation.URLParameters.getParameterNumber("broadcasts_id");
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
            (function(self : BroadcastDetailController)
            {
                self._broadcastsService.getSingle(self._stationID, self._broadcastsID, function(broadcast)
                {
                    self._transmitTimesService.getForBroadcast(self._stationID, self._broadcastsID, function(transmitTimes)
                    {
                        transmitTimes = utilities.date.TransmitTimesDateHelper.sortTransmitTimes(transmitTimes);
                        
                        self._categoriesService.getForBroadcast(self._stationID, self._broadcastsID, function(categories)
                        {
                            view.assign("stationID", self._stationID);
                            view.assign("broadcastsID", self._broadcastsID);
                            view.assign("broadcast", broadcast);
                            view.assign("transmitTimes", transmitTimes);
                            view.assign("categories", categories);
                            finishCallback();
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
            this._initFavoritesButton();
            this._initFavoritesDialogue();          
            this._initAccordion();
        }
        
        private _initFavoritesButton()
        {
            (function(self : BroadcastDetailController)
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".addToFavorites"), function()
                {
                    self._favoritesService.add(self._stationID, self._broadcastsID, function()
                    {
                        var dialog = <HTMLScriptElement>document.getElementsByClassName("favorites-dialog")[0];
                        dialog.style.display = "block";
                    });
                });
            }(this));
        }
        
        private _initFavoritesDialogue()
        {
        		(function(self : BroadcastDetailController)
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".closeDialogButton"), function()
                {
                	var dialog = <HTMLScriptElement>document.getElementsByClassName("favorites-dialog")[0];
                    dialog.style.display = "none";
                });
            }(this));
        }
        private _initAccordion()
        {
            (function(self : BroadcastDetailController)
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".programInfo-banner"), function(e: JQueryEventObject, target: JQuery)
                {
                    var banner = target.hasClass("programInfo-banner") ? target : target.parents(".programInfo-banner"); 
                    self._toggleAccordion(banner.find(".programInfo-accordionOpen"));
                });
            }(this));
            
            // open first accordion
            this._toggleAccordion($(".programInfo-accordionOpen[data-accordion-for-id='programInfo-detail']"), 0);
        }
        
        private _toggleAccordion(accordionButton : JQuery, animationDuration? : number)
        {
            var openID = accordionButton.attr("data-accordion-for-id");
            var openContainer = $("#" + openID);
            
            if (openContainer.is(":visible"))
            {
                $("#" + openID).slideUp(animationDuration);
                accordionButton.attr("src", "img/03_dropdown/03.1_dropdown-arrow.png");
            }
            else
            {
                $("#" + openID).slideDown(animationDuration);
                accordionButton.attr("src", "img/03_dropdown/03.1_dropdown-arrow-active.png");
                var otherAccordionElements = $(".programInfo-data").not("#" + openID);
                otherAccordionElements.slideUp(animationDuration);
                otherAccordionElements.prev(".programInfo-banner").find(".programInfo-accordionOpen").attr("src", "img/03_dropdown/03.1_dropdown-arrow.png");
                this._scrollTo(0, animationDuration);                
            }
        }
        
        private _scrollTo(top : number, animationDuration? : number)
        {
            $("html,body").animate(
            {
                scrollTop : top                
            }, animationDuration, "swing");
        }
    }
}