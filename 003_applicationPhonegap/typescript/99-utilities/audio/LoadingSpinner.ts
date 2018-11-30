/// <reference path="../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.utilities.audio
{
    export class LoadingSpinner
    {
        private static _layer : JQuery = null;
        
        public static show()
        {
            this._createLayer();
            this._layer.show();
        }
        
        public static hide()
        {
            if (this._layer !== null)
            {
                this._layer.remove();
                this._layer = null;
            }
        }
        
        private static _createLayer()
        {
            if (this._layer === null)
            {
                this._layer = $("<div class=\"liveStreamSpinnerLayer\"><div class=\"text\">Lade Livestream...</div></div>");
                this._layer.hide();
                $(document.body).append(this._layer);
            }
        }
    }
}