/// <reference path="GeolocationHelper.ts"/>
/// <reference path="ILocationObject.ts"/>

/// <reference path="../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../02-business/entities/station/StationEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/StationDetailEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/MediaChannelsEntity.ts"/>

module freeradios.presentation.location
{   
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities;
    
    export class DistanceSorting
    {
        private _helper : GeolocationHelper;    
        
        constructor(helper? : GeolocationHelper)
        {
            this._helper = di.DIContainer.get<freeradios.presentation.location.GeolocationHelper>(
                "freeradios.presentation.location.GeolocationHelper",
                helper
            );
        }
        
        public sortStationDetailsByCurrentDistance(stationDetails : Array<entities.stationdetail.StationDetailEntity>) : Array<entities.stationdetail.StationDetailEntity>
        {
            return <Array<entities.stationdetail.StationDetailEntity>>this._sortArrayByCurrentDistance(stationDetails);
        }
        
        public sortMediaChannelsByCurrentDistance(mediaChannels : Array<entities.stationdetail.MediaChannelsEntity>) : Array<entities.stationdetail.MediaChannelsEntity>
        {
            return <Array<entities.stationdetail.MediaChannelsEntity>>this._sortArrayByCurrentDistance(mediaChannels);
        }
        
        public sortStationsByCurrentDistance(stations : Array<entities.station.StationEntity>) : Array<entities.station.StationEntity>
        {
            return <Array<entities.station.StationEntity>>this._sortArrayByCurrentDistance(stations);
        }
        
        private _sortArrayByCurrentDistance(dataArray : Array<ILocationObject>) : Array<ILocationObject>
        {
            var latitude = this._helper.getLatitude();
            var longitude = this._helper.getLongitude();
            
            if (latitude !== null && longitude !== null)
            {         
                return DistanceSorting._sortArrayByDistance(dataArray, latitude, longitude);
            }
                        
            return dataArray;
        }
        
        private static _sortArrayByDistance(dataArray : Array<ILocationObject>, latitude : number, longitude : number) : Array<ILocationObject>
        { 
            dataArray.sort(function(dataSetA : ILocationObject, dataSetB : ILocationObject) 
            { 
                var distanceA = DistanceSorting._getDistance(dataSetA, latitude, longitude); 
                var distanceB = DistanceSorting._getDistance(dataSetB, latitude, longitude);
                return distanceA - distanceB; 
            });
            
            return dataArray; 
        }
        
        private static _getDistance(dataSet : ILocationObject, latitude : number, longitude : number) : number
        { 
            var distanceTemp = 
                    Math.sin(DistanceSorting._degreesToRadians(dataSet.latitude)) * Math.sin(DistanceSorting._degreesToRadians(latitude)) 
                     + Math.cos(DistanceSorting._degreesToRadians(dataSet.latitude)) * Math.cos(DistanceSorting._degreesToRadians(latitude)) 
                     * Math.cos(DistanceSorting._degreesToRadians(dataSet.longitude) - DistanceSorting._degreesToRadians(longitude)); 
    
            return Math.acos(distanceTemp) * 6380; 
        }
    
        private static _degreesToRadians(degrees : number) : number
        { 
            return degrees * Math.PI / 180; 
        }
    }
}