/// <reference path="../../98-frameworks/cordova/cordova.d.ts"/>

/// <reference path="../../99-utilities/runtime/RuntimeInfo.ts"/>

module freeradios.presentation.location
{
    export class GeolocationHelper
    {
        private _enabled : boolean;
        private _latitude : number = null;
        private _longitude : number = null;
        private _updateInterval : number;
        private _setIntervalHandle : number = null;
        
        constructor(updateInterval : number)
        {
            this._updateInterval = updateInterval;
            this.setEnabled(this._loadSetting("geolocation_enabled") !== "false");            
        }
        
        public setEnabled(state : boolean)
        {
            if (state)
            {
                this._saveSetting('geolocation_enabled', 'true');
                this._createListeners();
            }
            else
            {
                this._saveSetting('geolocation_enabled', 'false');
                this._uncreateListeners();
                this._latitude = null;
                this._longitude = null;
            }
                                
            this._enabled = state;
        }
        
        public getEnabled() : boolean
        {
            return this._enabled;
        }
        
        public getLatitude() : number
        {
            return this._latitude;
        }
        
        public getLongitude() : number
        {
            return this._longitude;
        }
        
        private _createListeners()
        {
            if (this._setIntervalHandle === null)
            {
                (function(self : GeolocationHelper)
                {
                    self._setIntervalHandle = setInterval(function()
                    {
                        self._updateLocation();
                    }, self._updateInterval);
                        
                    self._updateLocation();
                }(this));
            }
        }
        
        private _uncreateListeners()
        {
            if (this._setIntervalHandle !== null)
            {
                clearInterval(this._setIntervalHandle);
                this._setIntervalHandle = null;
            }
        }
        
        private _updateLocation()
        {
            if (this._enabled)
            {
                (function(self : GeolocationHelper)
                {
                    if (!utilities.runtime.RuntimeInfo.isExecutingInBrowser())
                    {
                        navigator.geolocation.getCurrentPosition(function(position: Position)
                        {
                            self._latitude = position.coords.latitude;
                            self._longitude = position.coords.longitude;
                        }, function(error)
                        {
                            self._latitude = null;
                            self._longitude = null;
                            self.setEnabled(false);
                        }, { timeout : 5000 });
                    }
                }(this));           
            }
            else
            {
                this._latitude = null;
                this._longitude = null;
            }
        }
        
        private _saveSetting(key : string, value : string)
        {
            localStorage.setItem(key, value);
        }
        
        private _loadSetting(key : string) : string
        {
            return localStorage.getItem(key);           
        }
    }
}