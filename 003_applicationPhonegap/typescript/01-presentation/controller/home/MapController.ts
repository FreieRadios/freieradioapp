/// <reference path="../MasterUpdatableController.ts"/>
/// <reference path="../../view/IView.ts"/>
/// <reference path="../../../02-business/service/station/StationService.ts"/>
/// <reference path="../../../02-business/entities/station/StationEntity.ts"/>
/// <reference path="../../../98-frameworks/google/google.maps.d.ts"/>
/// <reference path="../../../99-utilities/audio/StreamPlayer.ts"/>

module freeradios.presentation.controller.home{  
 
    import stationEntities = business.entities.station;
    import stationService = business.service.station;
    
    export class MapController extends MasterUpdatableController {
        public map;
        private _stationService : stationService.StationService;
        private markers : Array<stationEntities.StationEntity> = [];
        private mapMarkers = [];
        private infoMarker;
        
        constructor(view? : view.IView, masterView? : view.IView){
            super("Freie Radios", "templates/home/map.html", view, masterView);
            this.map = null;
            this._stationService = new stationService.StationService();       
        }    
        
        public createView(callback : (view : view.IView) => any){
            super.createView(function(view : view.IView){
                callback(view);
            });            
        }
        
        public updateViewAssignments(view : view.IView, finishCallback : () => any)
        {
            finishCallback();
        }
        
        public destroyView(){
            super.destroyView();            
        }
        
        public onready(){
            super.onready();
            this.bindListeners();
        }
        
        public bindListeners()
        {
            var that = this;
            
            this._stationService.getStationList(function(stations : Array<stationEntities.StationEntity>){
                that.markers = stations;
                that.initMap();
                that.initInfoMarker();
                that.initZoomControl();
            });
        }
        
        public initMap(){
            this._initMapOverlay();
            
            var styles = this.getStyle();
            var latlng = new google.maps.LatLng(48.400574,9.991202);
            var styledMap = new google.maps.StyledMapType(styles , {name: "Styled Map"});
            var markerURL = "img/01_map/01.1_POI.png";
            
            var mapOptions = {
                zoom: 6,
                zoomControl: false,
                zoomControlOptions: {
                    style: google.maps.ZoomControlStyle.SMALL,
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                disableDoubleClickZoom: true,
                panControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };
            this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
            
            this.map.mapTypes.set('map_style', styledMap);
            this.map.setMapTypeId('map_style');
            
            var that = this;
            
            for(var i = 0; i < this.markers.length; i++){
                var markerData = this.markers[i];
                
                var marker = new google.maps.Marker({
                	position: new google.maps.LatLng(markerData.latitude, markerData.longitude),
                    map: this.map,
                    title: markerData.name,                    
                    icon:{url: markerURL, size: new google.maps.Size(95,80), scaledSize : new google.maps.Size(95, 80), anchor: new google.maps.Point(24,80)}                   
                });
                 
                (function(marker : google.maps.Marker, markerData : stationEntities.StationEntity)
                {
                    google.maps.event.addListener(marker,"click",function(){
                        var markerPosition = this.position;
                        if(markerData.eventIsOn != true){
                        that.map.addListener("zoom_changed", function(){
                            that.infoMarker.changePosition(markerPosition);
                            markerData.eventIsOn = true;                           
                        });
                        }
                        that.infoMarker.changePosition(this.position);
                        that.infoMarker.setVisible(true);
                        that.infoMarker.setName(markerData.name);
                        that.infoMarker.setInfo(markerData.city + " | " + markerData.frequency);
                        that.infoMarker.setStream(markerData.streamURL);
                        that.infoMarker.setStationID(markerData.id);
                        that.infoMarker.anchor = new google.maps.Point(100, 0);
                        for(var j = 0; j < that.mapMarkers.length; j++){
                            that.mapMarkers[j].setVisible(true);
                        }
                        this.setVisible(false);
                    });
                }(marker, markerData));

                this.mapMarkers.push(marker);
            }
            
        }

        
        private _initMapOverlay()
        {
            if ($("#mapOverlay").length === 0)
            {
                var mapOverlay = $("<div id=\"mapOverlay\"></div>");
                
                mapOverlay.css(
                {
                    width : $(window).width() + "px",
                    height : $(window).height() + "px"
                });
                
                $("#container").append(mapOverlay);
            }
        }
        
        private initInfoMarker(){
            var markerInfoURL = "img/01_map/01.1_POI-pressed.png";
            var playURL = "img/01_map/01.1_POI-pressed-play.png";
            cM.prototype = new google.maps.OverlayView();
            this.infoMarker = new cM(this.map);
            var that = this;
            
            function cM(map){
                this.map = map;
                this.div = null;
                this.title = null;
                this.setMap(map);
                this.draw = function(){};
                
                this.changePosition = function(pos)
                {
                    var point = this.getProjection().fromLatLngToDivPixel(pos);
                    var width = parseInt(window.getComputedStyle(this.div).width.replace("px",""))/2;
                    var height = parseInt(window.getComputedStyle(this.div).height.replace("px",""));
                    this.div.style.left = point.x - width + 30 + "px";
                    this.div.style.top = point.y - height + "px";
                }
                
                this.setVisible = function(bool)
                {
                    if(bool){this.div.style.display = "block";}
                    else {this.div.style.display = "none";}
                }
                
                this.setName = function(name){this.name.innerHTML = name; this.title = name;}
                this.setInfo = function(info){this.info.innerHTML = info;}
                this.setStream = function(stream){this.stream = stream;}
                this.setStationID = function(stationID){ this.stationID = stationID;}
            }
            
            var controller = this;
            
            cM.prototype.onAdd = function(){
                this.div = document.createElement("div");
                this.div.style.width = "303px"; //303px
                this.div.style.height = "83px"; //83px
                //div.style.border = "2px solid #f00";
                this.div.style.position = "absolute";
                this.img = document.createElement("img");
                this.img.src = markerInfoURL;
                this.img.style.width = "285px"; //285px
                this.img.style.height = "83px"; //83px
                this.div.appendChild(this.img);
                this.container = document.createElement("div");
                this.container.style.position = "absolute";
                this.container.style.top = "0";
                this.container.style.left = "0";
                this.container.style.display = "flex";
                this.container.style.width = "inherit";
                this.container.style.height = "inherit";
                this.div.appendChild(this.container);
                this.infos = document.createElement("div");
                var that = this;
                google.maps.event.addDomListener(this.infos,"click",function(){
                    controller.getRouter().followURL("broadcastinfo?station_id=" + that.stationID);
                });
                this.infos.style.width = "240px"; //240px
                this.infos.style.height = "80px"; //80px
                this.container.appendChild(this.infos);
                this.name = document.createElement("p");
                this.name.style.fontFamily = "SourceSansProBold";
                this.name.style.fontSize = "18px";
                this.name.innerHTML = "FreeFM";
                this.name.style.position = "absolute";
                this.name.style.color = "#fff";
                this.name.style.top = "-8px";
                this.name.style.left = "40px";
                this.infos.appendChild(this.name);
                this.info = document.createElement("span");
                this.info.style.fontFamily = "SourceSansProLight";
                this.info.style.fontSize = "15px";
                this.info.innerHTML = "Ulm";
                this.info.style.position = "absolute";
                this.info.style.color = "#999CA0";
                this.info.style.top = "35px";
                this.info.style.left = "40px";
                this.infos.appendChild(this.info);
                this.play = document.createElement("img");
                this.play.src = playURL;
                this.play.style.width = "63px";
                this.play.style.height = "63px";
                this.play.style.position = "absolute";
                this.play.style.right = "13px";
                this.play.style.borderBottomRightRadius = "3px";
                this.play.style.borderTopRightRadius = "3px";
                var that = this;
                google.maps.event.addDomListener(this.play,"click",function()
                {                
                    var streamURL = that.stream;
                    var stationName = that.title;
                    utilities.audio.StreamPlayer.play(streamURL, stationName);                    
                });
                this.div.appendChild(this.play);
                var panes = this.getPanes();
                panes.overlayLayer.appendChild(this.div);
                panes.overlayMouseTarget.appendChild(this.div);
                this.setVisible(false);
            }    
                        
            google.maps.event.addListener(this.map,"click",function(e){
                if(e.preventDefault){
                   e.preventDefault();     
                }
                if(e.stopPropagation){
                   e.stoppropagation();     
                }    
                that.infoMarker.setVisible(false);
                for(var i = 0; i < that.mapMarkers.length; i++){
                    that.mapMarkers[i].setVisible(true);    
                }
            });
        }
        
        private initZoomControl(){
            var zoomControl = document.createElement("div");
            zoomControl.classList.add("zoomControl");
            zoomControl.style.position = "fixed";
            zoomControl.style.paddingTop = "15px";
            zoomControl.style.paddingRight = "10px";
            var zoomIn = document.createElement("div");
            zoomIn.classList.add("zoomIn");
            var zoomOut = document.createElement("div");
            zoomOut.classList.add("zoomOut");
            zoomIn.style.backgroundImage = "url(img/01_map/01.1_button_zoom-in.png)";  
            zoomIn.style.backgroundRepeat = "no-repeat";
            zoomIn.style.backgroundSize = "100%";
            zoomIn.style.width = "";
            zoomIn.style.height = "";
            zoomIn.style.margin = "";
            zoomOut.style.backgroundImage = "url(img/01_map/01.1_button_zoom-out.png)";  
            zoomOut.style.width = "";
            zoomOut.style.height = "";
            zoomOut.style.margin = "";
            zoomOut.style.backgroundRepeat = "no-repeat";
            zoomOut.style.backgroundSize = "100%";
            zoomControl.appendChild(zoomIn);
            zoomControl.appendChild(zoomOut);
            
            var that = this;
            google.maps.event.addDomListener(zoomIn, 'click', function() {
                that.map.setZoom(that.map.getZoom() + 1);
            });
            google.maps.event.addDomListener(zoomOut, 'click', function() {
                that.map.setZoom(that.map.getZoom() - 1);
            });
            
            this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push(zoomControl);
        }
        
        private getStyle() : Array<google.maps.MapTypeStyle> {
            var styles: Array<google.maps.MapTypeStyle> = [
                {
                    featureType: "landscape",
                    stylers : [
                        { color: "#EDEDED" }
                    ]
                },
                {
                    featureType: "road",
                    stylers: [
                        { color: "#CCCCCC" }
                    ]
                },
                {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                },
                {
                    featureType: "poi",
                    stylers: [
                    { color: "#EDEDED" }
                    ]
                },
                {
                    featureType: "administrative.country",
                    elementType: "geometry",
                    stylers: [
                        { color: "#111111" }
                    ]
                },
                {
                    featureType: "administrative.province",
                    elementType: "geometry.stroke",
                    stylers: [
                        { color: "#808080" }
                    ]
                },
                {
                    featureType: "water",
                    stylers: [
                        { color: "#111111" }
                    ]
                }
            ];
            return styles;
        }
    }
}