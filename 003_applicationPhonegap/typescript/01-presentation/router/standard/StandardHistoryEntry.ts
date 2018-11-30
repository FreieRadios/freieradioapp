/// <reference path="../RouteEntry.ts"/>

module freeradios.presentation.router.standard
{
    export class StandardHistoryEntry
    {
        private _route : RouteEntry;
        private _url : string;
        
        constructor(route : RouteEntry, url : string)
        {
            this._route = route;
            this._url = url;
        }
        
        public getRoute() : RouteEntry
        {
            return this._route;
        }
        
        public getURL() : string
        {
            return this._url;
        }
    }
}