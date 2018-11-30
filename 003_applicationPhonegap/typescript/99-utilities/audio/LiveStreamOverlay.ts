/// <reference path="../../98-frameworks/jquery/jquery.d.ts"/>
/// <reference path="StreamPlayer.ts"/>

module freeradios.utilities.audio
{
    export class LiveStreamOverlay
    {
        private static _layer : JQuery = null;
        
        public static show(stationName : string)
        {
            this._createLayer();
            this._layer.find(".positionedText").text(stationName + " - Livestream");
            this._layer.fadeIn();
            $("#container").addClass("withCurrentLiveStream");
        }
        
        public static hide()
        {
            if (this._layer !== null)
            {
                this._layer.remove();
                this._layer = null;
                $("#container").removeClass("withCurrentLiveStream");
            }
        }
        
        private static _createLayer()
        {
            if (this._layer === null)
            {
                this._layer = $("<div class=\"currentLiveStream\"><div class=\"text\"><span class=\"positionedText\"></span></div><a class=\"close\"></a></div>");
                this._layer.hide();
                
                (function(self)
                {
                    self._layer.find(".close").click(function()
                    {
                        self.hide();
                        StreamPlayer.stop();
                    });
                }(this));
                
                $(document.body).append(this._layer);
            }
        }
    }
}