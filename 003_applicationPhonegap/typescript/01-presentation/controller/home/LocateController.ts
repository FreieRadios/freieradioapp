/// <reference path="../MasterController.ts"/>
/// <reference path="../../view/IView.ts"/>
/// <reference path="../../router/IRouter.ts"/>
/// <reference path="../../location/GeolocationHelper.ts"/>

/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../../99-utilities/runtime/PlatformEvent.ts"/>

/// <reference path="../../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.presentation.controller.home
{
    export class LocateController extends MasterController
    {
        private _geolocationHelper : location.GeolocationHelper    
        
        constructor(view? : view.IView, masterView? : view.IView, geolocationHelper? : location.GeolocationHelper)
        {
            super("Ortung", "templates/home/locate.html", view, masterView);
            
            this._geolocationHelper = utilities.di.DIContainer.get<freeradios.presentation.location.GeolocationHelper>(
                "freeradios.presentation.location.GeolocationHelper",
                geolocationHelper
            );
        }    
        
        public createView(callback : (view : view.IView) => any)
        {
            super.createView(function(view : view.IView)
            {
                callback(view);
            });
        }
        
        public destroyView()
        {         
            super.destroyView();
        }
        
        public onready()
        {
            super.onready();
            this._setSwitchState();
            this._createSwitchListeners();
        }
        
        private _setSwitchState()
        {
            if (this._geolocationHelper.getEnabled())
            {
                $("#geolocationSwitch").addClass("active");
                $("#geolocationSwitchCircle").css("left", "auto");
            }
            else
            {
                $("#geolocationSwitchCircle").css("right", "auto");
            }
        }
        
        private _createSwitchListeners()
        {
            (function(self : LocateController)
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($("#geolocationSwitchLabel, #geolocationSwitch"), function()
                {
                    self._toggleSwitch();
                });
            }(this));
        }
        
        private _toggleSwitch()
        {
            var enabled = !this._geolocationHelper.getEnabled();
            this._geolocationHelper.setEnabled(enabled);
            var circleWidth = $("#geolocationSwitchCircle").width();
            var switchWidth = $("#geolocationSwitch").width();
            
            
            if (enabled)
            {
                $("#geolocationSwitchCircle").animate(
                {
                   left : (0.96 * switchWidth - circleWidth) + "px"                     
                }, 300, "swing", function()
                {
                    $("#geolocationSwitch").addClass("active");
                    $("#geolocationSwitchCircle").removeAttr("style");
                });
            }
            else
            {
                $("#geolocationSwitchCircle").animate(
                {
                   left : (0.04 * switchWidth) + "px"                     
                }, 300, "swing", function()
                {
                    $("#geolocationSwitch").removeClass("active");
                    $("#geolocationSwitchCircle").removeAttr("style");
                });
            }
        }
    }
}