/// <reference path="IController.ts"/>
/// <reference path="../view/IView.ts"/>
/// <reference path="../../99-utilities/di/DIContainer.ts"/>
/// <reference path="../../99-utilities/runtime/PlatformEvent.ts"/>

/// <reference path="../router/IRouter.ts"/>

/// <reference path="../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.presentation.controller
{
    import di = utilities.di;
    
    export class MasterController implements IController
    {
        private _view : view.IView;
        private _masterView : view.IView;
        private _router : router.IRouter;
        private _pageTitle : string;
        
        constructor(pageTitle : string, childTemplatePath : string, view? : view.IView, masterView? : view.IView)
        {
            this._pageTitle = pageTitle;
            
            this._view = di.DIContainer.get<freeradios.presentation.view.IView>("freeradios.presentation.view.IView", view);
            this._view.setTemplatePath(childTemplatePath);
            
            this._masterView = di.DIContainer.get<freeradios.presentation.view.IView>("freeradios.presentation.view.IView", masterView);
            this._masterView.setTemplatePath("templates/master.html");
            this._view.setMasterView(this._masterView);   
            
            this._router = null;
        }
        
        public setRouter(router : router.IRouter)
        {
            this._router = router;
        }
        
        public getRouter() : router.IRouter
        {
            return this._router;
        }
        
        public getView() : view.IView
        {
            return this._view;
        }
        
        public getMasterView() : view.IView
        {
            return this._masterView;
        }
        
        public createView(callback : (view : view.IView) => any)
        {
            if (this._router.getHistory().hasEntries())
            {
                this._masterView.assign("logoCSSClass", "hidden");
                this._masterView.assign("backButtonCSSClass", "");   
            }
            else
            {
                this._masterView.assign("backButtonCSSClass", "hidden");
                this._masterView.assign("logoCSSClass", "");
            }
            
            this._masterView.assign("popupCSSClass", "hidden");

            this._masterView.assign("pageTitle", this._pageTitle);
            
            callback(this._view);            
        }
        
        public destroyView()
        {   
            this._view = null;
            this._masterView = null;         
        }
        
        public onready()
        {	 	 
            $("*[data-popup-menu-show]").each(function()
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(this), function()
                {
                    $(".popup").slideDown(500, "swing");
                });
            });
            
            $("*[data-popup-menu-close]").each(function()
            {
                utilities.runtime.PlatformEvent.bindClickListenerJQuery($(this), function()
                {
                   $(".popup").slideUp(500, "swing");
                });
            });           
        }
    }
}