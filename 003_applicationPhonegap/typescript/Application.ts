/// <reference path="Config.ts"/>

/// <reference path="99-utilities/runtime/RuntimeInfo.ts"/>

/// <reference path="01-presentation/controller/home/MapController.ts"/>
/// <reference path="01-presentation/view/TemplatePreloader.ts"/>

/// <reference path="01-presentation/router/standard/StandardRouter.ts"/>
/// <reference path="01-presentation/router/RouterManager.ts"/>

/// <reference path="01-presentation/sync/SyncManager.ts"/>

module freeradios
{
    export class Application
    {
        public static main()
        {
            if (utilities.runtime.RuntimeInfo.isExecutingInBrowser())
            {
                $(document).ready(Application._onDeviceReady);
            }
            else
            {
                document.addEventListener("deviceready", Application._onDeviceReady, false);
            }
        }
        
        private static _onDeviceReady()
        {
            utilities.runtime.RuntimeInfo.initDevice();
            
            var router = new presentation.router.standard.StandardRouter();
            
            Config.initErrorHandling();
            Config.createBindings();   
            Config.registerRoutes(router);
            
            var routerManager = new presentation.router.RouterManager("container", router);
            routerManager.startRouting("map");

            Application._initSync();
            Application._preloadTemplates();
        }
        
        private static _initSync()
        {
            setTimeout(function()
            {                                
                presentation.sync.SyncManager.sync();
            }, 1500);
        }
        
        private static _preloadTemplates()
        {
            setTimeout(function()
            {
                var templateLoader = new presentation.view.TemplatePreloader();
                
                templateLoader.preloadTemplate("templates/home/list.html", ["#stationList"]);
                
                templateLoader.preloadTemplate("templates/home/broadcasts/broadcastinfo.html");
                templateLoader.preloadTemplate("templates/home/broadcasts/broadcast.html", ["#list"]);
                templateLoader.preloadTemplate("templates/home/broadcasts/broadcastcontact.html");
                templateLoader.preloadTemplate("templates/home/broadcasts/broadcastdetail.html");
                
                templateLoader.preloadTemplate("templates/home/schedule.html", ["#list"]);
                templateLoader.preloadTemplate("templates/home/scheduledetail.html");
                templateLoader.preloadTemplate("templates/home/search.html", ["#listStations", "#listBroadcasts"]);
                templateLoader.preloadTemplate("templates/home/favorite.html");
                templateLoader.preloadTemplate("templates/home/locate.html");
                templateLoader.preloadTemplate("templates/home/info.html");
            }, 1500);
        }
    }
}