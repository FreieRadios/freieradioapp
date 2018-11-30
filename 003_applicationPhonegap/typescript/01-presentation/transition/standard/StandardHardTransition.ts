/// <reference path="../ITransition.ts"/>

/// <reference path="../../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.presentation.transition.standard
{
    export class StandardHardTransition implements ITransition
    {
        public play(mainContainerID : string, lastHTML : string, nextHTML : string, reverse : boolean, finishCallback : () => any)
        {
            var mainContainer = $("#" + mainContainerID);
            mainContainer.children().remove();
            mainContainer.append(nextHTML);
            window.scrollTo(0, 0);
            finishCallback();
        }
    }
}