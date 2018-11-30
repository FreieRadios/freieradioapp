/// <reference path="LiveStreamOverlay.ts"/>
/// <reference path="LoadingSpinner.ts"/>

/// <reference path="formatplayers/IFormatPlayer.ts"/>
/// <reference path="formatplayers/SoundFileFormatPlayer.ts"/>
/// <reference path="formatplayers/PlsFormatPlayer.ts"/>
/// <reference path="formatplayers/BrowserFormatPlayer.ts"/>

/// <reference path="../runtime/RuntimeInfo.ts"/>

module freeradios.utilities.audio
{
    export class StreamPlayer
    {
        private static _formatPlayer : formatplayers.IFormatPlayer = null;
        
        public static play(url : string, stationName : string)
        {
            this.stop();
            this._formatPlayer = this._createPlayer(url, stationName);
            
            if (this._formatPlayer !== null)
            {
                this._formatPlayer.play();
            }
        }
        
        public static stop()
        {
            if (this._formatPlayer !== null)
            {
                this._formatPlayer.stop();
                this._formatPlayer.destruct();
                this._formatPlayer = null;
            }
        }
        
        private static _createPlayer(url : string, stationName : string) : formatplayers.IFormatPlayer
        {
//            url = "http://85.25.176.186:9140/listen.pls"
            var dotPosition = url.lastIndexOf(".");
            var extension = dotPosition >= 0 ? url.substr(dotPosition + 1).toLowerCase() : "";
            switch (extension)
            {
                case "ogg" : case "mp3" : case "wav" : LiveStreamOverlay.show(stationName); return new formatplayers.SoundFileFormatPlayer(url);
                case "pls" : 
                    if (runtime.RuntimeInfo.isExecutingInBrowser())
                    {
                        alert("Can't fetch PLS stream in browser. Please try another stream.");
                        return null;
                    }
                    else
                    {
                        LiveStreamOverlay.show(stationName); return new formatplayers.PlsFormatPlayer(url);
                    }
                default : LiveStreamOverlay.hide(); return new formatplayers.BrowserFormatPlayer(url);
            }
        }
    }
}