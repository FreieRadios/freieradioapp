/// <reference path="../controller/IController.ts"/>
/// <reference path="../transition/ITransition.ts"/>

/// <reference path="../../99-utilities/navigation/URLParameters.ts"/>

module freeradios.presentation.router
{
    export class RouteEntry
    {
        private _controllerType : new() => controller.IController;
        private _transition : transition.ITransition;
        private _parameters : { [key : string] : string };
        
        constructor(controllerType : new() => controller.IController, transition : transition.ITransition)
        {
            this._controllerType = controllerType;
            this._transition = transition;
            this._parameters = {};
        }
        
        public setParameter(key : string, value : any)
        {
            this._parameters[key] = String(value);
        }
        
        public getURL(oldURL : string) : string
        {
            var routeName = utilities.navigation.URLParameters.getRouteNameFromURL(oldURL);
            var oldParameters = utilities.navigation.URLParameters.getParametersFromURL(oldURL);
            
            for (var key in this._parameters)
            {
                oldParameters[key] = this._parameters[key];
            }
            
            return utilities.navigation.URLParameters.buildURL(routeName, oldParameters);            
        }
        
        public instanceController() : controller.IController
        {
            return new this._controllerType();
        }
        
        public getTransition() : transition.ITransition
        {
            return this._transition;
        }
    }
}