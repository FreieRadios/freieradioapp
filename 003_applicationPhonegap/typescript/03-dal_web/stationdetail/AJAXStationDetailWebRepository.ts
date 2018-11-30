/// <reference path="../../02-business/entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/Broadcasts2CategoriesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/CategoriesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/MediaChannelsEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/StationDetailEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/TransmitTimesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/WebstreamsEntity.ts"/>

/// <reference path="../../02-business/contracts/stationdetail/IStationDetailWebRepository.ts"/>

/// <reference path="../../02-business/entities/stationdetail/enums/TransmitTimesTimeType.ts"/>

/// <reference path="../../98-frameworks/jquery/jquery.d.ts"/>

module freeradios.dal_web.stationdetail
{
    import entities = business.entities.stationdetail;
    
    export class AJAXStationDetailWebRepository implements business.contracts.stationdetail.IStationDetailWebRepository
    {
        private _xml : JQuery;    
        
        constructor()
        {
            this._xml = null;
        }    
        
        public loadData(dataURL : string, callback : () => any, errorCallback : () => any)
        {
            this._xml = null;
            
            (function(self : AJAXStationDetailWebRepository)
            {
                $.ajax(
                {
                    url : dataURL,
                    type : "GET",
                    dataType : "text",
                    cache : false,
                    success : function(data : any)
                    {
                        self._xml = $("<xml>" + data + "</xml>");
                        callback();
                    },
                    error : function()
                    {
                        errorCallback();
                    }
                });
            }(this));
        }
        
        public getBroadcasts2CategoriesEntity(categoryNames2Categories : {[name : string] : entities.CategoriesEntity}, stationID : number) : Array<entities.Broadcasts2CategoriesEntity>
        {       
            var broadcasts2categories = new Array<entities.Broadcasts2CategoriesEntity>();
            
            (function(self : AJAXStationDetailWebRepository)
            {
                self._xml.find("programme").find("broadcast").each(function()
                {
                    var broadcastNode = $(this);
                    
                    var broadCastID = parseInt(broadcastNode.attr("id"), 10);
                    
                    $(this).find("categories").find("category").each(function()
                    {
                        var node = $(this);
                        var categoryName = node.attr("name");
                        
                        var entity = new entities.Broadcasts2CategoriesEntity();
                        
                        entity.broadcastsID = broadCastID;
                        entity.stationID = stationID;
                        
                        if (categoryNames2Categories[categoryName] === undefined || categoryNames2Categories[categoryName] === null)
                        {
                            var categoryID = node.attr("id");                            
                            entity.categoriesID = (categoryID === undefined || categoryID === null) ? 0 : parseInt(categoryID, 10); 
                        }
                        else
                        {
                            entity.categoriesID = categoryNames2Categories[categoryName].id;
                        }
                        
                        if (entity.categoriesID !== undefined && entity.categoriesID !== null && !isNaN(entity.categoriesID))
                        {
                            broadcasts2categories.push(entity);
                        }
                    });                    
                });
            }(this));
            
            return broadcasts2categories;              
        }
        
        public getBroadcastsEntities(stationID : number) : Array<entities.BroadcastsEntity>
        {
            var broadcasts = new Array<entities.BroadcastsEntity>();
            
            (function(self : AJAXStationDetailWebRepository)
            {
                self._xml.find("programme").find("broadcast").each(function()
                {
                    var node = $(this);
                    
                    var entity = new entities.BroadcastsEntity();
                    
                    entity.id = parseInt(node.attr("id"), 10);
                    entity.stationID = stationID;
                    entity.title = self._getValueOrDefault(node, "title", "");
                    entity.description = self._getValueOrDefault(node, "description", "");
                    
                    broadcasts.push(entity);
                });
            }(this));
                
            return broadcasts;  
        }
        
        public getMediaChannelsEntities(stationID : number) : Array<entities.MediaChannelsEntity>
        {      
            var channels = new Array<entities.MediaChannelsEntity>();
            
            (function(self : AJAXStationDetailWebRepository)
            {
                self._xml.find("media-channels").find("transmitter").each(function()
                {
                    var node = $(this);
                    var locationNode = node.find("transmitter-location").find("gml\\:Point, Point").find("gml\\:pos, pos");
                    var receptionAreaNode = node.find("receptionarea")
                                                .find("gml\\:Polygon, Polygon")
                                                .find("gml\\:exterior, exterior")
                                                .find("gml\\:LinearRing, LinearRing")
                                                .find("gml\\:posList, posList");
                    
                    var entity = new entities.MediaChannelsEntity();
                    
                    entity.stationID = stationID;
                    entity.type = node.attr("type") || "";
                    entity.frequency = self._getValueOrDefault(node, "frequency", "");
                    entity.frequencyUnit = self._getValueOrDefault(node, "frequencyunit", "");
                    entity.city = self._getValueOrDefault(node, "city", "");
                    entity.operator = self._getValueOrDefault(node, "operator", "");
                    entity.power = self._getValueOrDefault(node, "transmit-power", "");
                    entity.powerUnit = self._getValueOrDefault(node, "transmit-power-unit", "");
                    entity.rdsid = self._getValueOrDefault(node, "transmit-rds-id", "");
                    entity.transmitTimesFrom = self._getAttributeOfTagOrDefault(node, "transmit-times transmit-time", "time-from", "");
                    entity.transmitTimesTo = self._getAttributeOfTagOrDefault(node, "transmit-times transmit-time", "time-to", "");
                    
                    if (locationNode.length > 0)
                    {
                        var locationText = locationNode.text();
                        
                        if (locationText == "")
                        {
                            entity.latitude = 0;
                            entity.longitude = 0;
                        }
                        else
                        {
                            var locationParts = locationText.split(" ");
                            entity.latitude = locationParts.length > 0 ? parseFloat(locationParts[0]) : 0;
                            entity.longitude = locationParts.length > 1 ? parseFloat(locationParts[1]) : 0;
                        }
                    }
                    else
                    {
                        entity.latitude = 0;
                        entity.longitude = 0;
                    }
                    
                    entity.latitude = entity.latitude || 0;
                    entity.longitude = entity.longitude || 0;
                    
                    if (receptionAreaNode.length > 0)
                    {
                        entity.transmitterReceptionArea = receptionAreaNode.text();
                    }
                    else
                    {
                        entity.transmitterReceptionArea = "";
                    }
                    
                    channels.push(entity);
                });
            }(this));
            
            
            return channels;      
        }
        
        public getStationDetailEntity(stationID : number) : entities.StationDetailEntity
        {
            if (this._xml === null)
            {
                return null;
            }
            
            var entity = new entities.StationDetailEntity();
            
            var stationNode = this._xml.find("station");
            var infoNode = stationNode.find("info");
            var studioNode = infoNode.find("studio");            
            var studioLocationNode = studioNode.find("studio-location").find("gml\\:Point, Point").find("gml\\:pos, pos");
            
            entity.stationID = stationID;            
            
            entity.displayName = this._getValueOrDefault(infoNode, "displayname", "");
            entity.fullName = this._getValueOrDefault(infoNode, "fullname", "");
            entity.displayName = this._getValueOrDefault(infoNode, "displayname", "");
            entity.logoSource = this._getAttributeOfTagOrDefault(infoNode, "logo", "src", "");
            entity.baseColor = this._getValueOrDefault(infoNode, "basecolor", "");
            entity.city = this._getValueOrDefault(infoNode, "city", "");
            
            entity.studioStreet = this._getValueOrDefault(studioNode, "street", "");
            entity.studioStreetNumber = this._getValueOrDefault(studioNode, "number", "");
            entity.studioCity = this._getValueOrDefault(studioNode, "city", "");
            entity.studioZIP = this._getValueOrDefault(studioNode, "zip", "");
            
            if (studioLocationNode.length > 0)
            {
                var studioLocationParts = studioLocationNode.text().split(" ");
                entity.latitude = studioLocationParts.length > 0 ? parseFloat(studioLocationParts[0]) : 0;
                entity.longitude = studioLocationParts.length > 1 ? parseFloat(studioLocationParts[1]) : 0;             
            }
            else
            {
                entity.latitude = 0;
                entity.longitude = 0;
            }
            
            entity.studioStudioPhone = this._getValueOrDefault(studioNode, "phone[type=studio]", "");
            entity.studioOfficePhone = this._getValueOrDefault(studioNode, "phone[type=office]", "");
            entity.studioStudioEMail = this._getValueOrDefault(studioNode, "email[type=studio]", "");
            entity.studioOfficeEMail = this._getValueOrDefault(studioNode, "email[type=office]", "");
            
            entity.studioOpenTimeFrom = this._getAttributeOfTagOrDefault(studioNode, "open", "time-from", "");
            entity.studioOpenTimeTo = this._getAttributeOfTagOrDefault(studioNode, "open", "time-to", "");
            
            entity.website = this._getValueOrDefault(this._xml.find("media-channels website"), "url", "");
            entity.lastUpdate = new Date(stationNode.attr("lastupdate"));

            return entity;
        }
        
        public getTransmitTimeEntities(stationID : number) : Array<entities.TransmitTimesEntity>
        {           
            var transmitTimes = new Array<entities.TransmitTimesEntity>();
            
            (function(self : AJAXStationDetailWebRepository)
            {
                self._xml.find("programme").find("broadcast").each(function()
                {
                    var broadcastNode = $(this);
                    
                    var broadCastID = parseInt(broadcastNode.attr("id"), 10);
                    
                    $(this).find("transmit-times").find("transmit-time").each(function()
                    {
                        var node = $(this);
                        
                        var entity = new entities.TransmitTimesEntity();
                        
                        entity.broadcastsID = broadCastID;
                        entity.stationID = stationID;
                        entity.recurrence = self._getAttributeOrDefault(node, "recurrence", "") === "true";
                        entity.rerun = self._getAttributeOrDefault(node, "rerun", "") === "true";
                                                
                        var timesNodeDaily : JQuery = node.find("daily");
                        var timesNodeWeekly : JQuery = node.find("weekly");
                        var timesNodeWeekOfMonth : JQuery = node.find("weekOfMonth");
                        var dateFromAttribute = self._getAttributeOrDefault(node, "date-from", "");
                        var dateToAttribute =  self._getAttributeOrDefault(node, "date-to", "");
                        var timesNode : JQuery;
                        
                        var valid = true;
                        
                        if (timesNodeWeekly.length > 0)
                        {
                            entity.timeType = entities.enums.TransmitTimesTimeType.weekly;
                            timesNode = timesNodeWeekly;
                        }
                        else if (timesNodeWeekOfMonth.length > 0)
                        {
                            entity.timeType = entities.enums.TransmitTimesTimeType.weekOfMonth;
                            timesNode = timesNodeWeekOfMonth;
                        }
                        else if (timesNodeDaily.length > 0)
                        {
                            entity.timeType = entities.enums.TransmitTimesTimeType.daily;
                            timesNode = timesNodeDaily;
                        }
                        else if (dateFromAttribute !== "" && dateToAttribute !== "")
                        {
                            // Sondersendung / special broadcasts
                            dateFromAttribute = utilities.date.TransmitTimesDateHelper.parseDateOnceString(dateFromAttribute);
                            dateToAttribute = utilities.date.TransmitTimesDateHelper.parseDateOnceString(dateToAttribute);
                            
                            entity.dateOnceFrom = dateFromAttribute;
                            entity.dateOnceTo = dateToAttribute;
                            
                            entity.timeType = entities.enums.TransmitTimesTimeType.once;
                            
                            entity.timeFrom = utilities.date.TransmitTimesDateHelper.getTimeStringFromDate(new Date(dateFromAttribute));
                            entity.timeTo = utilities.date.TransmitTimesDateHelper.getTimeStringFromDate(new Date(dateToAttribute));
                            
                            timesNode = null;
                        }
                        else
                        {
                            valid = false;
                        }
                        
                        if (valid)
                        {
                            entity.day = timesNode === null ? "" : self._getAttributeOrDefault(timesNode, "day", "");
                            entity.priority = timesNode === null ? 0 : parseInt(self._getAttributeOrDefault(timesNode, "priority", "0"), 10);
                            
                            if (entity.timeType !== entities.enums.TransmitTimesTimeType.once)
                            {
                                entity.timeFrom = self._getAttributeOrDefault(timesNode, "time-from", "");
                                entity.timeTo = self._getAttributeOrDefault(timesNode, "time-to", "");
                            }
                            
                            entity.week1 = timesNode === null ? false : self._getAttributeOrDefault(timesNode, "week1", "") === "true";
                            entity.week2 = timesNode === null ? false : self._getAttributeOrDefault(timesNode, "week2", "") === "true";
                            entity.week3 = timesNode === null ? false : self._getAttributeOrDefault(timesNode, "week3", "") === "true";
                            entity.week4 = timesNode === null ? false : self._getAttributeOrDefault(timesNode, "week4", "") === "true";
                            entity.week5 = timesNode === null ? false : self._getAttributeOrDefault(timesNode, "week5", "") === "true";                        
                            entity.firstWeek = timesNode === null ? false :  self._getAttributeOrDefault(timesNode, "firstWeek", "") === "true";                        
                            entity.lastWeek = timesNode === null ? false : self._getAttributeOrDefault(timesNode, "lastWeek", "") === "true";
                            
                            transmitTimes.push(entity);
                        }
                    });                    
                });
            }(this));
            
            return transmitTimes;
        }
        
        public getWebstreamsEntities(stationID : number) : Array<entities.WebstreamsEntity>
        {   
            var webstreams = new Array<entities.WebstreamsEntity>();
            
            (function(self : AJAXStationDetailWebRepository)
            {
                self._xml.find("media-channels").find("webstream").each(function()
                {
                    var node = $(this);
                    var transmitTimesNode = node.find("transmit-times").find("transmit-time");
                    
                    var entity = new entities.WebstreamsEntity();
                    
                    entity.stationID = stationID;
                    entity.transmitTimesFrom = transmitTimesNode.attr("time-from") || "";
                    entity.transmitTimesTo = transmitTimesNode.attr("time-to") || "";
                    entity.url = self._getValueOrDefault(node, "url", "");
                    entity.format = self._getValueOrDefault(node, "format", "");
                    entity.quality = self._getValueOrDefault(node, "quality", "");
                    
                    webstreams.push(entity);
                });
            }(this));
            
            return webstreams;
        }
        
        private _getValueOrDefault(xmlNode : JQuery, tag : string, defaultValue : any)
        {
            if (xmlNode.length === 0)
            {
                return defaultValue;
            }
            
            var node = xmlNode.find(tag);
            
            if (node.length === 0)
            {
                return defaultValue;
            }
            
            return node.text();
        }
        
        private _getAttributeOrDefault(xmlNode : JQuery,  attribute : string, defaultValue : any)
        {
            if (xmlNode.length === 0)
            {
                return defaultValue;
            }
            
            return xmlNode.attr(attribute) || defaultValue;
        }
        
        private _getAttributeOfTagOrDefault(xmlNode : JQuery, tag : string, attribute : string, defaultValue : any)
        {
            if (xmlNode.length === 0)
            {
                return defaultValue;
            }
            
            var node = xmlNode.find(tag);
            
            if (node.length === 0)
            {
                return defaultValue;
            }
            
            return node.attr(attribute) || defaultValue;
        }
    }
}