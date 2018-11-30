/// <reference path="IFormatPlayer.ts"/>
/// <reference path="../LoadingSpinner.ts"/>

/// <reference path="../../web/LinkHandler.ts"/>

module freeradios.utilities.audio.formatplayers
{
    export class BrowserFormatPlayer implements IFormatPlayer
    {
        private _url : string;
        
        constructor(url : string)
        {
            this._url = url;
        }
    
        public play()
        {   
            web.LinkHandler.openURLInBrowser(this._url);
        }
    
        public stop()
        {
            // no need to be implemented
        }    
        
        public destruct()
        {
            // no need to be implemented
        }
    }
}