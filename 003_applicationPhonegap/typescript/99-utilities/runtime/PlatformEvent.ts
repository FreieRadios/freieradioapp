/// <reference path="RuntimeInfo.ts"/>
/// <reference path="../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.utilities.runtime
{
    export class PlatformEvent
    {
        public static bindClickListener(selector : string, callback : () => any)
        {
            PlatformEvent.bindClickListenerJQuery($(selector), function(e : JQueryEventObject, target : JQuery)
            {
                callback();
            });                
        }
        
        public static bindClickListenerJQuery(elements : JQuery, callback : (e : JQueryEventObject, target : JQuery) => any)
        {
            if (RuntimeInfo.isExecutingInBrowser())
            {
                elements.click(function(e : JQueryEventObject)
                {
                    callback(e, $(e.target));
                });
            }
            else
            {
                var dragging = false;
                var moveStarted = false;
                var moved = 0;
                var lastX = 0;
                var lastY = 0;
                
                $("body").on("touchmove", function(e : any)
                {
                    var originalEvent = <TouchEvent>e.originalEvent;
                    var touch = originalEvent.touches[0];
                    var x = touch.pageX;
                    var y = touch.pageY;
                    
                    if (moved > 3)
                    {
                        dragging = true;
                    }
                    else if (moveStarted)
                    {
                        
                        moved += Math.abs(x - lastX) + Math.abs(y - lastY);
                    }
                    else
                    {
                        moveStarted = true;
                    }
                    
                    lastX = x;
                    lastY = y;
                });
                
                $("body").on("touchend", function()
                {
                    dragging = false;
                    moveStarted = false;
                    moved = 0;
                });
                
                $("body").on("touchcancel", function()
                {
                    dragging = false;
                    moveStarted = false;
                    moved = 0;
                });
                
                elements.on("touchend", function(e : any)
                {
                    if (!dragging)
                    {                        
                        var originalEvent = <TouchEvent>e.originalEvent;
                        var x = e.originalEvent.changedTouches[0].pageX - window.pageXOffset;
                        var y = e.originalEvent.changedTouches[0].pageY - window.pageYOffset;
                        var target = $(document.elementFromPoint(x, y));
                        
                        if (target !== null && (target.is(elements) || target.parents().is(elements)))
                        {      
                            callback(<JQueryEventObject>e, target);
                        }
                        
                        dragging = false;
                        moved = 0;
                        moveStarted = false;
                    }
                });
            }                
        }
    }
} 