/// <reference path="RouteEntry.ts"/>
/// <reference path="IHistory.ts"/>

module freeradios.presentation.router
{
    export interface IRouter
    {
        setMainContainerID(mainContainerID : string);
        start(url : string);
        followURL(url : string);
        registerRoute(name : string, route : RouteEntry);
        parseLinks();
        navigateBack();
        getHistory() : IHistory;
        setParameter(key : string, value : any);
    }
}