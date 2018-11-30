/// <reference path="StandardHistory.ts"/>
/// <reference path="StandardHistoryEntry.ts"/>

/// <reference path="../IRouter.ts"/>
/// <reference path="../IHistory.ts"/>
/// <reference path="../RouteEntry.ts"/>

/// <reference path="../../view/IView.ts"/>

/// <reference path="../../../98-frameworks/jquery/jquery.d.ts"/>

/// <reference path="../../../99-utilities/navigation/URLParameters.ts"/>

/// <reference path="../../../99-utilities/runtime/RuntimeInfo.ts"/>
/// <reference path="../../../99-utilities/runtime/PlatformEvent.ts"/>
/// <reference path="../../../99-utilities/runtime/SplashScreen.ts"/>

/// <reference path="../../../99-utilities/web/LinkHandler.ts"/>

interface Navigator
{
    app : any;
}

module freeradios.presentation.router.standard
{
    export class StandardRouter implements IRouter
    {
        private _mainContainer : JQuery;
        private _routes : {[name : string] : RouteEntry};
        private _lastURL : string;
        private _lastController : controller.IController;
        private _lastHTML : string;
        private _mainContainerID : string;
        private _lastRoute : RouteEntry;
        
        private _history : StandardHistory;
        
        constructor()
        {
            this._routes = {};
            this._lastURL = null;
            this._lastController = null;
            this._lastHTML = null;
            this._history = new StandardHistory();
            this._lastRoute = null;
            
            this._createListeners();
        }
        
        public setMainContainerID(mainContainerID : string)
        {
            this._mainContainerID = mainContainerID;
            this._mainContainer = $("#" + this._mainContainerID);            
        }
        
        public registerRoute(name : string, route : RouteEntry)
        {
            this._routes[name] = route;
        }
        
        public getHistory() : IHistory
        {
            return this._history;
        }
        
        public parseLinks(partSelector? : string)
        {
            this._parseInternalLinks(partSelector);
            this._parseWebTelAndEMailLinks(partSelector);
        }
        
        public setParameter(key : string, value : any)
        {
            if (this._lastRoute !== null)
            {
                this._lastRoute.setParameter(key, value);
            }
        }
        
        private _parseInternalLinks(partSelector? : string)
        {
            var containerToParse = partSelector ? $(partSelector) : this._mainContainer;
            
            (function(self : StandardRouter)
            {
                containerToParse.find("*[data-href]").each(function()
                {
                    var link = $(this);
                    
                    utilities.runtime.PlatformEvent.bindClickListenerJQuery(link, function()
                    {
                        self.followURL(link.attr("data-href"));
                    });
                });
                
                containerToParse.find("*[data-back-link]").each(function()
                {
                    utilities.runtime.PlatformEvent.bindClickListenerJQuery($(this), function()
                    {
                        self.navigateBack();
                    });
                });                
            }(this));
        }
        
        private _parseWebTelAndEMailLinks(partSelector? : string)
        {
            var containerToParse = partSelector ? $(partSelector) : this._mainContainer;
            
            containerToParse.find("a[href]").each(function()
            {
                var link = $(this);
                var target = link.attr("target");
                var href = link.attr("href");
                
                if (href && href.indexOf("mailto:") === 0)
                {
                    utilities.runtime.PlatformEvent.bindClickListenerJQuery(link, function()
                    {
                        var address = href.substr(7).replace(/[ \t\r\n]/g, "");
                        utilities.web.LinkHandler.openEMailClient(address)
                        link.attr("href", "javascript:;");
                    });
                }
                if (href && href.indexOf("tel:") === 0)
                {
                    utilities.runtime.PlatformEvent.bindClickListenerJQuery(link, function()
                    {
                        var phoneNumber = href.substr(4).replace(/[ \t\r\n]/g, "");
                        utilities.web.LinkHandler.callPhoneNumber(phoneNumber);
                        link.attr("href", "javascript:;");
                    });
                }
                else if (href && target && target.toLowerCase() === "_blank")
                {
                    utilities.runtime.PlatformEvent.bindClickListenerJQuery(link, function()
                    {
                        utilities.web.LinkHandler.openURLInBrowser(href);
                        link.attr("href", "javascript:;");
                        link.removeAttr("target");
                    });
                } 
            });
        }
        
        public start(url : string)
        {
            var hash = window.location.hash;
            
            if (hash.length > 0)
            {
                var url = hash;
                
                while (url.indexOf("#") === 0)
                {
                    url = url.substr(1);
                }
            }
            
            this.followURL(url);            
        }
        
        public followURL(url : string)
        {
            if (this._mainContainerID === undefined)
            {
                throw "A main container ID must be set for routers.";
            }
            
            var route = this._routes[utilities.navigation.URLParameters.getRouteNameFromURL(url)];
            
            if (route !== undefined && this._lastURL !== url)
            {
                this._performURLChange(route, url);
            }
        }
        
        public navigateHome()
        {
             
        }
        public navigateBack()
        {
            if (this._history.hasEntries())
            {
                var entry = this._history.pop();
                
                var url = entry.getRoute().getURL(entry.getURL());
                
                this._performURLChange(entry.getRoute(), url, true);               
            }
            else if (utilities.runtime.RuntimeInfo.isAndroid())
            {
                navigator.app.exitApp();
            }
        }
        
        private _performURLChange(route : RouteEntry, url : string, isBackNavigation? : boolean)
        {
            window.location.hash = url;
            
            var nextController = route.instanceController();
            
            nextController.setRouter(this);
                
            if (this._lastController !== null && !isBackNavigation)
            {
                this._history.push(new StandardHistoryEntry(this._lastRoute, this._lastURL));
            }
            
            (function(self : StandardRouter)
            {
                nextController.createView(function(view : view.IView)
                {
                    view.render(function(html : string)
                    {
                        view.addUpdateCallback(function(partSelector : string)
                        {
                            self.parseLinks(partSelector);
                        });
                                                
                        self._performPageTransition(route, nextController, html, url, isBackNavigation);
                    });                        
                });
            }(this));
        }
        
        private _performPageTransition(route : RouteEntry, nextController : controller.IController, html : string, url : string, isBackNavigation? : boolean)
        {
            if (this._lastController === null)
            {
                this._mainContainer.append(html);                                
                this._finishControllerChange(route, nextController, html, url, isBackNavigation === true);                               
            }
            else
            {   
                (function(self : StandardRouter)
                {
                    route.getTransition().play(self._mainContainerID, self._lastHTML, html, isBackNavigation === true, function()
                    {
                        self._finishControllerChange(route, nextController, html, url, isBackNavigation === true);                                      
                    });
                }(this));
            }
        }
        
        private _finishControllerChange(route : RouteEntry, nextController : controller.IController, html : string, url : string, isBackNavigation : boolean)
        {
            if (this._lastController !== null)
            {
                this._lastController.destroyView();
            }
            
            this.parseLinks();
            nextController.onready();
            this._lastHTML = html;
            this._lastURL = url;
            this._lastRoute = route;
    
            if (this._lastController === null)
            {
                utilities.runtime.SplashScreen.hide();
            }
    
            this._lastController = nextController;
        }
        
        private _createListeners()
        {
            (function(self : StandardRouter)
            {
                document.addEventListener("backbutton", function()
                {
                    self.navigateBack();
                }, false);
            }(this));
        }
    }
}