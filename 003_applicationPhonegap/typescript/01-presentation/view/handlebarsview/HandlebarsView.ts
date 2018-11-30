/// <reference path="../IView.ts"/>
/// <reference path="../../../98-frameworks/handlebars/handlebars.d.ts"/>
/// <reference path="../../../98-frameworks/jquery/jquery.d.ts"/>

/// <reference path="helpers/HBConditionHelper.ts"/>
/// <reference path="helpers/HBDateHelper.ts"/>
/// <reference path="helpers/HBStringHelper.ts"/>
/// <reference path="helpers/HBTransmitTimeHelper.ts"/>

module freeradios.presentation.view.handlebarsview
{
    export class HandlebarsView implements IView
    {
        private static _templateCache : {[path : string] : string} = {};
        private static _templateDelegateCache : {[ identifier : string ] : HandlebarsTemplateDelegate} = {};
        
        private _templatePath : string;
        private _assignments : {[key : string] : any};
        private _masterView : IView;
        private _templateCode : string;
        private _updateCallbacks : Array<(partSelector : string) => any>;
        
        constructor()
        {
            this._templatePath = null;
            this._masterView = null;
            this._assignments = {};
            this._templateCode = "";
            this._updateCallbacks = new Array<(partSelector : string) => any>();
            
            this._registerHelpers();
        }
        
        public setTemplatePath(path : string)
        {
            this._templatePath = path;
        }
        
        public setMasterView(view : IView)
        {
            this._masterView = view;
        }
        
        public assign(key : string, value : any)
        {
            this._assignments[key] = value;
        }               
        
        public render(callback : (generatedHTML : string) => any)
        {
            if (this._templatePath === null)
            {
                throw "Template path must be set before rendering.";
            }
            
            if (HandlebarsView._templateCache[this._templatePath] !== undefined)
            {
                this._renderWithTemplateCode(HandlebarsView._templateCache[this._templatePath], callback);
            }
            else
            {
                (function(self : HandlebarsView)
                {
                    self._fetchTemplateCode(function(html : string)
                    {
                        self._renderWithTemplateCode(html, callback);
                    });
                }(this));
            }
        }
        
        public updateView(partSelector : string)
        {
            var templateCode = $("<div>" + this._templateCode + "</div>").find(partSelector).wrap("<div></div>").parent().html();
            var node = $(partSelector);
            var htmlCode = this._buildHTMLCode(templateCode, partSelector);
            node.replaceWith(htmlCode);
            this._triggerUpdateCallbacks(partSelector);
        }
        
        public updateAssignments(parentSelector : string)
        {
            var htmlCode = this._buildHTMLCode(this._templateCode, parentSelector);
            var parent = $(parentSelector);
            parent.html(htmlCode);
            this._triggerUpdateCallbacks(parentSelector);
        }
        
        public addUpdateCallback(callback : (partSelector : string) => any)
        {
            this._updateCallbacks.push(callback);
        }
        
        public preloadTemplate(path : string, partSelectors? : Array<string>)
        {
            if (HandlebarsView._templateCache[path] !== undefined)
            {
                var templateCode = HandlebarsView._templateCache[path];
                
                this._cacheTemplate(templateCode, path);
                
                if (partSelectors !== undefined)
                {
                    for (var i = 0, length = partSelectors.length; i < length; ++i)
                    {
                        var partSelector = partSelectors[i];
                        var partTemplateCode = $("<div>" + templateCode + "</div>").find(partSelector).wrap("<div></div>").parent().html();
                        this._cacheTemplate(partTemplateCode, path, partSelector);
                    }
                }
            }
            else
            {
                (function(self : HandlebarsView)
                {
                    self._fetchTemplateCode(function(html : string)
                    {
                        self.preloadTemplate(path, partSelectors);
                    }, path);                    
                }(this));   
            }
        }
        
        private _triggerUpdateCallbacks(partSelector : string)
        {
            for (var i = 0, length = this._updateCallbacks.length; i < length; ++i)
            {
                this._updateCallbacks[i](partSelector);
            }
        }
        
        private _fetchTemplateCode(callback : (generatedHTML : string) => any, path? : string)
        {
            if (path === undefined)
            {
                path = this._templatePath;
            }
            
            (function(self : HandlebarsView)
            {
                $.ajax(
                {
                    url : path,
                    dataType : "html", 
                    type : "GET",
                    success : function(templateCode : string)
                    {
                        HandlebarsView._templateCache[path] = templateCode;
                        callback(templateCode);
                    }
                });
            }(this));
        }
        
        private _renderWithTemplateCode(templateCode : string, callback : (generatedHTML : string) => any)
        {
            this._templateCode = templateCode;
            
            var htmlCode = this._buildHTMLCode(templateCode);
            
            if (this._masterView !== null)
            {                
                this._masterView.assign("content", htmlCode);
                this._masterView.render(callback);
            }
            else
            {
                callback(htmlCode);
            }
        }
        
        private _buildHTMLCode(templateCode : string, partSelector? : string) : string
        {
            var template = this._cacheTemplate(templateCode, this._templatePath, partSelector);
            return template(this._assignments);
        }
        
        private _cacheTemplate(templateCode : string, path : string, partSelector? : string) : HandlebarsTemplateDelegate
        {
            if (partSelector === undefined)
            {
                partSelector = "";
            }
            
            var cacheKey = path + partSelector;
            
            if (HandlebarsView._templateDelegateCache[cacheKey] === undefined)
            {
                var options =
                {
                    data : false,
                    compat : false,
                    knownHelpers : this._getKnownHelpers(),
                    knownHelpersOnly : true,
                    trackIds : false,
                    assumeObjects : true         
                };
                
                var templateSpec;
                
                eval("templateSpec=" + Handlebars.precompile(templateCode, options));
                
                HandlebarsView._templateDelegateCache[cacheKey] = Handlebars.template(templateSpec);
            }
            
            return HandlebarsView._templateDelegateCache[cacheKey];
        }
        
        private _getKnownHelpers() : { [ name : string ] : boolean }
        {
            var knownHelpers : { [ name : string ] : boolean } =
            {
                ifInArray : true,
                timeHourAndMinute : true,
                dateNumeric : true,
                dateFull : true,
                dateTimeNumeric : true,
                dateTimeFull : true,
                shortenString : true,
                transmitTimeStringInfo : true
            };
            
            return knownHelpers;
        }
        
        private _registerHelpers()
        {
            Handlebars.registerHelper("ifInArray", helpers.HBConditionHelper.ifInArray)
            
            Handlebars.registerHelper("timeHourAndMinute", helpers.HBDateHelper.timeHourAndMinute)
            Handlebars.registerHelper("dateNumeric", helpers.HBDateHelper.dateNumeric)
            Handlebars.registerHelper("dateFull", helpers.HBDateHelper.dateFull)
            Handlebars.registerHelper("dateTimeNumeric", helpers.HBDateHelper.dateTimeNumeric)
            Handlebars.registerHelper("dateTimeFull", helpers.HBDateHelper.dateTimeFull)
            
            Handlebars.registerHelper("shortenString", helpers.HBStringHelper.shortenString)
            
            Handlebars.registerHelper("transmitTimeStringInfo", helpers.HBTransmitTimeHelper.transmitTimeStringInfo)
        }
    }
}