/// <reference path="99-utilities/di/DIContainer.ts"/>

/// <reference path="99-utilities/database/ISQLContext.ts"/>
/// <reference path="99-utilities/database/cordovasqlitestorage/CSSDBContext.ts"/>

/// <reference path="02-business/contracts/station/IStationWebRepository.ts"/>
/// <reference path="03-dal_web_mock/station/MockStationWebRepository.ts"/>
/// <reference path="03-dal_web/station/AJAXStationWebRepository.ts"/>

/// <reference path="02-business/contracts/station/IStationLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/station/MockStationLocalRepository.ts"/>
/// <reference path="03-dal_local/station/SQLStationLocalRepository.ts"/>

/// <reference path="02-business/contracts/stationdetail/IStationDetailWebRepository.ts"/>
/// <reference path="03-dal_web_mock/stationdetail/MockStationDetailWebRepository.ts"/>
/// <reference path="03-dal_web/stationdetail/AJAXStationDetailWebRepository.ts"/>

/// <reference path="02-business/contracts/stationdetail/IBroadcastsLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/stationdetail/MockBroadcastsLocalRepository.ts"/>
/// <reference path="03-dal_local/stationdetail/SQLBroadcastsLocalRepository.ts"/>

/// <reference path="02-business/contracts/stationdetail/ICategoriesLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/stationdetail/MockCategoriesLocalRepository.ts"/>
/// <reference path="03-dal_local/stationdetail/SQLCategoriesLocalRepository.ts"/>

/// <reference path="02-business/contracts/stationdetail/IBroadcasts2CategoriesLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/stationdetail/MockBroadcasts2CategoriesLocalRepository.ts"/>
/// <reference path="03-dal_local/stationdetail/SQLBroadcasts2CategoriesLocalRepository.ts"/>

/// <reference path="02-business/contracts/stationdetail/IMediaChannelsLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/stationdetail/MockMediaChannelsLocalRepository.ts"/>
/// <reference path="03-dal_local/stationdetail/SQLMediaChannelsLocalRepository.ts"/>

/// <reference path="02-business/contracts/stationdetail/IStationDetailLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/stationdetail/MockStationDetailLocalRepository.ts"/>
/// <reference path="03-dal_local/stationdetail/SQLStationDetailLocalRepository.ts"/>

/// <reference path="02-business/contracts/stationdetail/ITransmitTimesLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/stationdetail/MockTransmitTimesLocalRepository.ts"/>
/// <reference path="03-dal_local/stationdetail/SQLTransmitTimesLocalRepository.ts"/>

/// <reference path="02-business/contracts/stationdetail/IWebstreamsLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/stationdetail/MockWebstreamsLocalRepository.ts"/>
/// <reference path="03-dal_local/stationdetail/SQLWebstreamsLocalRepository.ts"/>

/// <reference path="02-business/contracts/favorites/IBroadcastsFavoritesLocalRepository.ts"/>
/// <reference path="03-dal_local_mock/favorites/MockBroadcastsFavoritesLocalRepository.ts"/>
/// <reference path="03-dal_local/favorites/SQLBroadcastsFavoritesLocalRepository.ts"/>

/// <reference path="01-presentation/view/IView.ts"/>
/// <reference path="01-presentation/view/handlebarsview/HandlebarsView.ts"/>

/// <reference path="01-presentation/router/IRouter.ts"/>
/// <reference path="01-presentation/router/RouteEntry.ts"/>

/// <reference path="01-presentation/transition/standard/StandardSlideTransition.ts"/>

/// <reference path="01-presentation/location/GeolocationHelper.ts"/>

/// <reference path="01-presentation/controller/home/MapController.ts"/>
/// <reference path="01-presentation/controller/home/ListController.ts"/>

/// <reference path="01-presentation/controller/home/SearchController.ts"/>
/// <reference path="01-presentation/controller/home/FavoriteController.ts"/>
/// <reference path="01-presentation/controller/home/InfoController.ts"/>
/// <reference path="01-presentation/controller/home/LocateController.ts"/>
/// <reference path="01-presentation/controller/home/ScheduleController.ts"/>
/// <reference path="01-presentation/controller/home/ScheduleDetailController.ts"/>

/// <reference path="01-presentation/controller/home/broadcasts/BroadcastInfoController.ts"/>
/// <reference path="01-presentation/controller/home/broadcasts/BroadcastController.ts"/>
/// <reference path="01-presentation/controller/home/broadcasts/BroadcastDetailController.ts"/>
/// <reference path="01-presentation/controller/home/broadcasts/BroadcastContactController.ts"/>

/// <reference path="99-utilities/runtime/RuntimeInfo.ts"/>

module freeradios
{
    import di = freeradios.utilities.di;
    
    export class Config
    {
        private static _metaXMLURL: string = "http://app.freefm.de/meta.xml";    
        private static _geolocationUpdateInterval : number = 3000;
        
        public static initErrorHandling()
        {
            window.onerror = function(message, filename, lineNumber)
            {
                alert(message);
            };
        }
        
        public static createBindings()
        {   
            this._createDALToBusinessLayerBindings()                     
            this._createPresentationLayerBindings();           
        }
        
        public static registerRoutes(router : presentation.router.IRouter)
        {
            var slideTransition = new presentation.transition.standard.StandardSlideTransition();
            
            router.registerRoute("map", new presentation.router.RouteEntry(
                presentation.controller.home.MapController,
                slideTransition
            ));
            
            router.registerRoute("list", new presentation.router.RouteEntry(
                presentation.controller.home.ListController,
                slideTransition
            ));
            
            router.registerRoute("search", new presentation.router.RouteEntry(
                presentation.controller.home.SearchController,
                slideTransition
            ));
            
            router.registerRoute("favorite", new presentation.router.RouteEntry(
                presentation.controller.home.FavoriteController,
                slideTransition
            ));
            
            router.registerRoute("locate", new presentation.router.RouteEntry(
                presentation.controller.home.LocateController,
                slideTransition
            ));
            
            router.registerRoute("info", new presentation.router.RouteEntry(
                presentation.controller.home.InfoController,
                slideTransition
            ));
            
            router.registerRoute("schedule", new presentation.router.RouteEntry(
                presentation.controller.home.ScheduleController,
                slideTransition
            ));
            
            router.registerRoute("scheduledetail", new presentation.router.RouteEntry(
                presentation.controller.home.ScheduleDetailController,
                slideTransition
            ));
            
            router.registerRoute("broadcastinfo", new presentation.router.RouteEntry(
                presentation.controller.home.broadcasts.BroadcastInfoController,
                slideTransition
            ));
            
            router.registerRoute("broadcast", new presentation.router.RouteEntry(
                presentation.controller.home.broadcasts.BroadcastController,
                slideTransition
            ));
            
            router.registerRoute("broadcastdetail", new presentation.router.RouteEntry(
                presentation.controller.home.broadcasts.BroadcastDetailController,
                slideTransition
            ));
            
            router.registerRoute("broadcastcontact", new presentation.router.RouteEntry(
                presentation.controller.home.broadcasts.BroadcastContactController,
                slideTransition
            ));
        }
        
        private static _createDALToBusinessLayerBindings()
        {
            if (utilities.runtime.RuntimeInfo.isExecutingInBrowser())
            {
                this._createMockDALBindings();
            }
            else
            {
                this._createRealDALBindings();
            }
        }
        
        private static _createMockDALBindings()
        {
            // station web            
            di.DIContainer.bindConstructor<freeradios.business.contracts.station.IStationWebRepository>(
                "freeradios.business.contracts.station.IStationWebRepository",
                freeradios.dal_web_mock.station.MockStationWebRepository
            );
            
            // station local
            di.DIContainer.bindConstructor<freeradios.business.contracts.station.IStationLocalRepository>(
                "freeradios.business.contracts.station.IStationLocalRepository",
                freeradios.dal_local_mock.station.MockStationLocalRepository
            );            
            
            // stationdetail web
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IStationDetailWebRepository>(
                "freeradios.business.contracts.stationdetail.IStationDetailWebRepository",
                freeradios.dal_web_mock.stationdetail.MockStationDetailWebRepository
            );
            
            // stationdetail local
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IBroadcastsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IBroadcastsLocalRepository",
                freeradios.dal_local_mock.stationdetail.MockBroadcastsLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IBroadcasts2CategoriesLocalRepository>(
                "freeradios.business.contracts.stationdetail.IBroadcasts2CategoriesLocalRepository",
                freeradios.dal_local_mock.stationdetail.MockBroadcasts2CategoriesLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.ICategoriesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ICategoriesLocalRepository",
                freeradios.dal_local_mock.stationdetail.MockCategoriesLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IMediaChannelsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IMediaChannelsLocalRepository",
                freeradios.dal_local_mock.stationdetail.MockMediaChannelsLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IStationDetailLocalRepository>(
                "freeradios.business.contracts.stationdetail.IStationDetailLocalRepository",
                freeradios.dal_local_mock.stationdetail.MockStationDetailLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.ITransmitTimesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ITransmitTimesLocalRepository",
                freeradios.dal_local_mock.stationdetail.MockTransmitTimeslLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IWebstreamsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IWebstreamsLocalRepository",
                freeradios.dal_local_mock.stationdetail.MockWebstreamsEntitylLocalRepository
            );
            
            // favorites
            di.DIContainer.bindConstructor<freeradios.business.contracts.favorites.IBroadcastsFavoritesLocalRepository>(
                "freeradios.business.contracts.favorites.IBroadcastsFavoritesLocalRepository",
                freeradios.dal_local_mock.favorites.MockFavoritesLocalRepository
            );
        }
        
        private static _createRealDALBindings()
        {
            // database
            di.DIContainer.bindValue<freeradios.utilities.database.ISQLContext>(
                "freeradios.utilities.database.ISQLContext", 
                new utilities.database.cordovasqlitestorage.CSSDBContext("database.sqlite")
            );
            
            // station web            
            di.DIContainer.bindFactory<freeradios.business.contracts.station.IStationWebRepository>(
                "freeradios.business.contracts.station.IStationWebRepository",
                function() 
                { 
                    return new freeradios.dal_web.station.AJAXStationWebRepository(Config._metaXMLURL); 
                }
            );
            
            // station local
            di.DIContainer.bindConstructor<freeradios.business.contracts.station.IStationLocalRepository>(
                "freeradios.business.contracts.station.IStationLocalRepository",
                freeradios.dal_local.station.SQLStationLocalRepository
            );                        
            
            // stationdetail web
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IStationDetailWebRepository>(
                "freeradios.business.contracts.stationdetail.IStationDetailWebRepository",
                freeradios.dal_web.stationdetail.AJAXStationDetailWebRepository
            );
            
            // stationdetail local
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IBroadcastsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IBroadcastsLocalRepository",
                freeradios.dal_local.stationdetail.SQLBroadcastsLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IBroadcasts2CategoriesLocalRepository>(
                "freeradios.business.contracts.stationdetail.IBroadcasts2CategoriesLocalRepository",
                freeradios.dal_local.stationdetail.SQLBroadcasts2CategoriesLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.ICategoriesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ICategoriesLocalRepository",
                freeradios.dal_local.stationdetail.SQLCategoriesLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IMediaChannelsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IMediaChannelsLocalRepository",
                freeradios.dal_local.stationdetail.SQLMediaChannelsLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IStationDetailLocalRepository>(
                "freeradios.business.contracts.stationdetail.IStationDetailLocalRepository",
                freeradios.dal_local.stationdetail.SQLStationDetailLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.ITransmitTimesLocalRepository>(
                "freeradios.business.contracts.stationdetail.ITransmitTimesLocalRepository",
                freeradios.dal_local.stationdetail.SQLTransmitTimesLocalRepository
            );
            
            di.DIContainer.bindConstructor<freeradios.business.contracts.stationdetail.IWebstreamsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IWebstreamsLocalRepository",
                freeradios.dal_local.stationdetail.SQLWebstreamsLocalRepository
            );
            
            // favorites
            di.DIContainer.bindConstructor<freeradios.business.contracts.favorites.IBroadcastsFavoritesLocalRepository>(
                "freeradios.business.contracts.favorites.IBroadcastsFavoritesLocalRepository",
                freeradios.dal_local.favorites.SQLFavoritesLocalRepository
            );
        }
        
        private static _createPresentationLayerBindings()
        {
            di.DIContainer.bindConstructor<freeradios.presentation.view.IView>(
                "freeradios.presentation.view.IView",
                freeradios.presentation.view.handlebarsview.HandlebarsView
            );
            
            di.DIContainer.bindValue<freeradios.presentation.location.GeolocationHelper>(
                "freeradios.presentation.location.GeolocationHelper",
                new freeradios.presentation.location.GeolocationHelper(Config._geolocationUpdateInterval)
            );
        }        
    }
}