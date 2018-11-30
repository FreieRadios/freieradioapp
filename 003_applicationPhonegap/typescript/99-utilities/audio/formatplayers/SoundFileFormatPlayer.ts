/// <reference path="IFormatPlayer.ts"/>
/// <reference path="../LoadingSpinner.ts"/>
/// <reference path="../helpers/AudioPlayerFactory.ts"/>

module freeradios.utilities.audio.formatplayers
{
    export class SoundFileFormatPlayer implements IFormatPlayer
    {
        private _player : HTMLAudioElement;    
        
        constructor(url : string)
        {
            this._player = helpers.AudioPlayerFactory.create();
        
            this._player.addEventListener("loadeddata", function()
            {
                LoadingSpinner.hide();
            });
        
            this._player.src = url; 
        }
    
        public play()
        {   
            LoadingSpinner.show();
            this._player.play();
        }
    
        public stop()
        {
            this._player.pause();
            LoadingSpinner.hide();
        }
        
        public destruct()
        {
            helpers.AudioPlayerFactory.destroy(this._player);
            this._player = null;
        }
    }
}