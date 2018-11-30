/// <reference path="../../98-frameworks/cordova/cordova.d.ts"/>
/// <reference path="RuntimeInfo.ts"/>

module freeradios.utilities.runtime
{
    export class SplashScreen
    {
        public static hide()
        {
            if (!RuntimeInfo.isExecutingInBrowser())
            {
                navigator.splashscreen.hide();
            }
        }
    }
}