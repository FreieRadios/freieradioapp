/// <reference path="../../../99-utilities/di/DIContainer.ts"/>

/// <reference path="../../contracts/stationdetail/IMediaChannelsLocalRepository.ts"/>

/// <reference path="../../entities/stationdetail/MediaChannelsEntity.ts"/>

module freeradios.business.service.stationdetail
{
    import di = freeradios.utilities.di;
    import entities = freeradios.business.entities.stationdetail;
    
    export class MediaChannelsService
    {
        private _repository : contracts.stationdetail.IMediaChannelsLocalRepository;
        
        constructor(repository? : contracts.stationdetail.IMediaChannelsLocalRepository)
        {
            this._repository = di.DIContainer.get<contracts.stationdetail.IMediaChannelsLocalRepository>(
                "freeradios.business.contracts.stationdetail.IMediaChannelsLocalRepository",
                repository);                  
        }
        
        public getList(callback : (mediaChannels : Array<entities.MediaChannelsEntity>) => any)
        {
            this._repository.getList(callback); 
        }
        
        public getForStation(stationID : number, callback : (mediaChannels : Array<entities.MediaChannelsEntity>) => any)
        {
            this._repository.getListByStationID(stationID, callback);
        }
        
        public getMediaChannelTypes(stationID : number, callback : (mediaChannelTypes : Array<string>) => any)
        {
            this.getForStation(stationID, function(mediaChannels : Array<entities.MediaChannelsEntity>)
            {
                var mediaChannelTypes = new Array<string>();
                
                for (var i = 0, length = mediaChannels.length; i < length; ++i)
                {
                    var currentType = mediaChannels[i].type;
                    
                    if (mediaChannelTypes.indexOf(currentType) < 0)
                    {
                        mediaChannelTypes.push(currentType);
                    }
                }
                
                callback(mediaChannelTypes);
            });
        }
    }
}