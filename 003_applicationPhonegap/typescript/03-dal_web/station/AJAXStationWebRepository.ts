/// <reference path="../../02-business/contracts/station/IStationWebRepository.ts"/>
/// <reference path="../../02-business/entities/station/StationEntity.ts"/>

/// <reference path="../../98-frameworks/jquery/jquery.d.ts"/>

/// <reference path="../../99-utilities/di/DIContainer.ts"/>

module freeradios.dal_web.station
{
    import di = freeradios.utilities.di;
    import entities = business.entities.station;    
    
    export class AJAXStationWebRepository implements business.contracts.station.IStationWebRepository
    {
        private _url : string;    
        
        constructor(url : string)
        {
            this._url = url;
        }    
        
        public getStationList(callback : (stations: Array<entities.StationEntity>) => any, errorCallback : () => any)
        {
            (function(self : AJAXStationWebRepository)
            {
                $.ajax(
                {
                    url : self._url,
                    type : "GET",
                    dataType : "xml",
                    cache : false,
                    success : function(data : any)
                    {
                        callback(self._buildEntities($(data)));
                    },
                    error : function()
                    {
                        callback([]);
                    }
                });
            }(this));
        }
        
        private _buildEntities(xml : JQuery) : Array<entities.StationEntity>
        {
            var stations = new Array<entities.StationEntity>();
            var self = this;
            xml.find("station").each(function()
            {
                var stationNode = $(this);
                var station = new entities.StationEntity();
                
                station.lastUpdate = new Date(stationNode.attr("lastupdate"));
                station.id = parseInt(stationNode.attr("id"), 10);
                station.name = stationNode.find("name").text();
                station.city = stationNode.find("city").text();
                station.xmlURI = stationNode.find("xmluri").text();
                station.frequency = self._checkForMoreThanOneFrequency(stationNode);

                var geoPosString = stationNode.find("gml\\:pos, pos").text();
                
                if(geoPosString != null)
                {
                    var positionLat;
                    var positionLong;                    
                    var positions = geoPosString.split(" ");
                    positionLat = positions[0];
                    positionLong = positions[1];
                    station.latitude = positionLat;
                    station.longitude = positionLong;
                }
                else
                {
                    station.latitude = parseFloat(stationNode.find("lat").text());
                    station.longitude = parseFloat(stationNode.find("lng").text());
                }
                station.streamURL = stationNode.find("streamurl").text();
                
                stations.push(station);
            });
            
            return stations;
        }
        private _checkForMoreThanOneFrequency(stationNode : JQuery){
            var firstFrequency = stationNode.find("frequency:first").text();
            if(stationNode.find("frequency").text() == firstFrequency){
                return firstFrequency;
            }
            else{
                return firstFrequency + " | " + stationNode.find("frequency").text().substring(firstFrequency.length, stationNode.find("frequency").text().length);
            }
        }
    }
}