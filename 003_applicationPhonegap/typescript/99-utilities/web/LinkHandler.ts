/// <reference path="../runtime/RuntimeInfo.ts"/>

module freeradios.utilities.web
{
    export class LinkHandler
    {
        public static openURLInBrowser(url : string)
        {
            if (utilities.runtime.RuntimeInfo.isExecutingInBrowser())
            {
                window.open(url, "_blank");  
            }
            else if (navigator.userAgent.match(/android/i))
            {
                navigator.app.loadUrl(url, {openExternal : true});
            }
            else
            {   
                window.open(url, "_system");
            }
        }
        
        public static openEMailClient(mailAddress : string)
        {
            if (utilities.runtime.RuntimeInfo.isExecutingInBrowser())
            {
                window.open("mailto:" + mailAddress, "_self");  
            }
            else if (navigator.userAgent.match(/android/i))
            {
                navigator.app.loadUrl("mailto:" + mailAddress);
            }
            else
            {   
                window.open("mailto:" + mailAddress, "_system");
            }
        }
        
        public static callPhoneNumber(phoneNumber : string)
        {
            if (utilities.runtime.RuntimeInfo.isExecutingInBrowser())
            {
                alert("Calling phone number \"" + phoneNumber + "\" is not possible in a web browser.");  
            }
            else if (navigator.userAgent.match(/android/i))
            {
                navigator.app.loadUrl("tel:" + phoneNumber);
            }
            else
            {   
                window.open("tel:" + phoneNumber, "_system");
            }
        }
    }   
}