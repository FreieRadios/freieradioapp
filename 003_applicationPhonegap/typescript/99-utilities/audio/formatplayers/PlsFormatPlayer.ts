/// <reference path="IFormatPlayer.ts"/>
/// <reference path="../LoadingSpinner.ts"/>
/// <reference path="../../../98-frameworks/jquery/jquery.d.ts"/>
/// <reference path="../helpers/AudioPlayerFactory.ts"/>

interface Window
{
    _currentPLSPlayer : freeradios.utilities.audio.formatplayers.PlsFormatPlayer;
}

module freeradios.utilities.audio.formatplayers
{
    export class PlsFormatPlayer implements IFormatPlayer
    {
        private _player : HTMLAudioElement; 
        
        constructor(url : string)
        {
            this._player = helpers.AudioPlayerFactory.create();
                
            this._player.addEventListener("loadeddata", function()
            {
                LoadingSpinner.hide();
            });
            
            this._player.play();
            
            (function(self : PlsFormatPlayer)
            {
                self._loadPlayerURL(url, function(streamURL : string)
                {
                    self._initPlayer(streamURL);
                });
            }(this));
        }
    
        public play()
        {   
            LoadingSpinner.show();
            
            if (!this._player.paused)
            {
                this._player.play();
            }
        }
    
        public stop()
        {
            LoadingSpinner.hide();
            this._player.pause();            
        }
        
        public destruct()
        {
            helpers.AudioPlayerFactory.destroy(this._player);
            this._player = null;
        }
        
        private _initPlayer(playerURL : string)
        {
            var dotPosition = playerURL.lastIndexOf(".");
            var extension = dotPosition >= 0 ? playerURL.substr(dotPosition + 1).toLowerCase : "";
            
            switch(extension)
            {
                case "ogg" : case "mp3" : case "wav" : 
                this._player.src = playerURL;
                break;
                case "pls":
                   this._player.src = playerURL + ";";
                   break;
                default:
                    this._player.src = playerURL + ";";
                    break;
            }
        }
        
        private _loadPlayerURL(plsURL : string, callback : (streamURL : string) => any)
        {
            $.ajax(
            {
                url : plsURL,
                type : "GET",
                dataType : "text",
                async : true,
                success : function(data)
                {
                    var playerUrl = data.replace(/[\r\t ]*/g, "").substr(data.indexOf("File1=") + 6);
                    var linebreakPos = playerUrl.indexOf("\n");
                    
                    if (linebreakPos >= 0)
                    {
                        playerUrl = playerUrl.substr(0, linebreakPos);
                    }
                    
                    callback(playerUrl.replace(/[\r\t\n ]*/, ''));
                }
            });
        }
    }
}