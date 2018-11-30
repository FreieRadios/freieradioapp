interface Window
{
    phonegap : any;
    PhoneGap : any;
    Cordova : any;
}

interface IStatusBar
{
    overlaysWebView(overlay : boolean);
}

declare var StatusBar : IStatusBar;

module freeradios.utilities.runtime
{
    export class RuntimeInfo
    {
        public static isExecutingInBrowser() : boolean
        {
            var phonegapObject = window.phonegap || null;
            var PhoneGapObject = window.PhoneGap || null;
            var cordovaObject = window.cordova || null;
            var CordovaObject = window.Cordova || null;
            
            return !(phonegapObject !== null || PhoneGapObject !== null || cordovaObject !== null || CordovaObject !== null);
        }
        
        public static isAndroid() : boolean
        {
            return /android/i.test(navigator.userAgent.toString().toLowerCase());
        }
        
        public static isIOS() : boolean
        {
            return !RuntimeInfo.isExecutingInBrowser() && !RuntimeInfo.isAndroid();
        }
        
        public static initDevice()
        {
        }
    }
} 