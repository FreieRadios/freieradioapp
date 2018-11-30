/// <reference path="../MasterController.ts"/>
/// <reference path="../../view/IView.ts"/>
/// <reference path="../../router/IRouter.ts"/>

/// <reference path="../../../02-business/service/favorites/BroadcastFavoritesService.ts"/>
/// <reference path="../../../02-business/businessentities/stationdetail/BroadcastsEntityWithStationName.ts"/>

/// <reference path="../../../99-utilities/runtime/PlatformEvent.ts"/>

module freeradios.presentation.controller.home
{
    import service = business.service.favorites;
    import entities = business.businessentities.stationdetail;
    
    export class FavoriteController extends MasterController
    {
        private _favoritesService : service.BroadcastFavoritesService;    
        
        constructor(view? : view.IView, masterView? : view.IView)
        {
            super("Favoriten", "templates/home/favorite.html", view, masterView);
            
            this._favoritesService = new service.BroadcastFavoritesService();
        }    
        
        public createView(callback : (view : view.IView) => any)
        {
        	var self = this;
            
            super.createView(function(view : view.IView)
            {
                self._favoritesService.getListWithStationName(function(broadcasts : Array<entities.BroadcastsEntityWithStationName>)
                {
                    view.assign("broadcasts", broadcasts);                    
                    callback(view);
                });
            });   
        }
        
        public destroyView()
        {         
            super.destroyView();
        }
        
        public onready()
        {
            super.onready();
            
            this._bindDeleteListeners();
        }
        
        private _bindDeleteListeners()
        {
            (function(self : FavoriteController)
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".favoriteStarList"), function(e : JQueryEventObject, target : JQuery)
                {
                    e.preventDefault();
                    e.cancelBubble = true;
                    e.stopPropagation();
                    
                    var button = target;
                    
                    var dialog: HTMLScriptElement = <HTMLScriptElement>document.getElementsByClassName("remove-favorites-dialog")[0];
                    dialog.style.display = "block";
                    
                    utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".submitDialogButton"), function()
                    {
                        var dialog = <HTMLScriptElement>document.getElementsByClassName("remove-favorites-dialog")[0];
                        dialog.style.display = "none";
                        self._delete(parseInt(button.attr("data-station-id"), 10), parseInt(button.attr("data-broadcasts-id"), 10), function()
                        {
                            button.parents(".stationListElement").remove();
                        });  
                    });
                    utilities.runtime.PlatformEvent.bindClickListenerJQuery($(".cancelDialogButton"), function()
                    {
                        var dialog = <HTMLScriptElement>document.getElementsByClassName("remove-favorites-dialog")[0];
                        dialog.style.display = "none";
                    });
                    return false;
                });
            }(this));
        }
                
        private _delete(stationID : number, broadcastsID : number, callback : () => any)
        {
            this._favoritesService.remove(stationID, broadcastsID, callback);
        }
    }
}