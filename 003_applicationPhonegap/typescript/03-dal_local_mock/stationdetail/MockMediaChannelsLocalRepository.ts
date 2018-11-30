/// <reference path="../../02-business/entities/stationdetail/MediaChannelsEntity.ts"/>
/// <reference path="../../02-business/contracts/stationdetail/IMediaChannelsLocalRepository.ts"/>

module freeradios.dal_local_mock.stationdetail
{
    import entities = business.entities.stationdetail;
    
    export class MockMediaChannelsLocalRepository implements business.contracts.stationdetail.IMediaChannelsLocalRepository
    {   
        public saveMediaChannelsArray(mediaChannels : Array<entities.MediaChannelsEntity>, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public saveMediaChannel(mediaChannel : entities.MediaChannelsEntity, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public getList(callback : (mediaChannels : Array<entities.MediaChannelsEntity>) => any)
        {
            callback(
            [
                {
                    stationID : 0, type : "ukw", frequency : "100,1", frequencyUnit : "MHz", city : "Freudenstadt Station #0", operator : "MediaBroadcast", 
                    power : "1", powerUnit : "kW", rdsid : "FDS100,1", transmitTimesFrom : "00:00:00", transmitTimesTo : "23:59:59", 
                    latitude : 48.445190, longitude : 8.530226, transmitterReceptionArea : "48.494866 8.417647 48.539524 8.437176 48.538778 8.492046 48.594002 8.602148 48.526676 8.649936 48.449179 8.692174 48.392013 8.545043 48.326153 8.564997 48.310266 8.368171 48.461093 8.401893 48.494866 8.417647"
                },
                {
                    stationID : 1, type : "ukw", frequency : "100,1", frequencyUnit : "MHz", city : "Freudenstadt Station #1", operator : "MediaBroadcast", 
                    power : "1", powerUnit : "kW", rdsid : "FDS100,1", transmitTimesFrom : "00:00:00", transmitTimesTo : "23:59:59", 
                    latitude : 48.445190, longitude : 8.530226, transmitterReceptionArea : "48.494866 8.417647 48.539524 8.437176 48.538778 8.492046 48.594002 8.602148 48.526676 8.649936 48.449179 8.692174 48.392013 8.545043 48.326153 8.564997 48.310266 8.368171 48.461093 8.401893 48.494866 8.417647"
                },
                {
                    stationID : 2, type : "ukw", frequency : "100,1", frequencyUnit : "MHz", city : "Freudenstadt Station #2", operator : "MediaBroadcast", 
                    power : "1", powerUnit : "kW", rdsid : "FDS100,1", transmitTimesFrom : "00:00:00", transmitTimesTo : "23:59:59", 
                    latitude : 48.445190, longitude : 8.530226, transmitterReceptionArea : "48.494866 8.417647 48.539524 8.437176 48.538778 8.492046 48.594002 8.602148 48.526676 8.649936 48.449179 8.692174 48.392013 8.545043 48.326153 8.564997 48.310266 8.368171 48.461093 8.401893 48.494866 8.417647"
                }
            ]);
        }
        
        public getListByStationID(stationID : number, callback : (mediaChannels : Array<entities.MediaChannelsEntity>) => any)
        {
            this.getList(function(mediaChannels : Array<entities.MediaChannelsEntity>)
            {
                var filtered = new Array<entities.MediaChannelsEntity>();
                
                for (var i = 0, length = mediaChannels.length; i < length; ++i)
                {
                    var currentMediaChannel = mediaChannels[i];
                    
                    if (currentMediaChannel.stationID === stationID)
                    {
                        filtered.push(currentMediaChannel);
                    }
                }
                
                callback(filtered);
            });
        }
    }
}