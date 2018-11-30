/// <reference path="../ITransition.ts"/>

/// <reference path="../../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.presentation.transition.standard
{
    export class StandardSlideTransition implements ITransition
    {
        public play(mainContainerID : string, lastHTML : string, nextHTML : string, reverse : boolean, finishCallback : () => any)
        {
            var mainContainer = $("#" + mainContainerID);
            
            var sign = reverse ? "+" : "-";
            
            this._prepareElements(mainContainer, nextHTML, reverse, sign);
            
            this._playAnimation(mainContainer, nextHTML, sign, finishCallback);
        }
        
        private _prepareElements(mainContainer : JQuery, nextHTML : string, reverse : boolean, sign : string)
        {
            var lastPage = $("<div class=\"slideTransitionPage last\"></div>");
            mainContainer.children().wrapAll(lastPage);
            var nextPage = $("<div class=\"slideTransitionPage next\">" + nextHTML + "</div>");
                        
            if (reverse)
            {
                lastPage.addClass("reverse");
                nextPage.addClass("reverse");            
            }
                       
            mainContainer.append(nextPage);
            
            var pageWrapper = $("<div class=\"slideTransitionPageWrapper\"></div>");
            
            mainContainer.children().wrapAll(pageWrapper);
        }
        
        private _playAnimation(mainContainer : JQuery, nextHTML : string, sign : string, finishCallback : () => any)
        {
            var callbackFired = false;
            
            $(".slideTransitionPage").animate(
            {
                left : sign + "=" + $(window).width() + "px"                  
            }, 300, "swing", function()
            {
                if (!callbackFired)
                {
                    callbackFired = true;
                    mainContainer.children().remove();
                    mainContainer.append(nextHTML);  
                    finishCallback();
                }
            });
        }
    }
}