/// <reference path="../../02-business/entities/stationdetail/WebstreamsEntity.ts"/>
/// <reference path="../../02-business/contracts/stationdetail/IWebstreamsLocalRepository.ts"/>

module freeradios.dal_local_mock.stationdetail
{
    import entities = business.entities.stationdetail;
    
    export class MockWebstreamsEntitylLocalRepository implements business.contracts.stationdetail.IWebstreamsLocalRepository
    {   
        public saveWebstreamsArray(webstreams : Array<entities.WebstreamsEntity>, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public saveWebstream(webstream : entities.WebstreamsEntity, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            callback(true);
        }
        
        public getList(callback : (webstreams : Array<entities.WebstreamsEntity>) => any)
        {
            callback(
            [
                {
                    stationID : 0,
                    transmitTimesFrom : "00:00:00",
                    transmitTimesTo : "23:59:59",
                    url : "http://stream.sthoerfunk.de:7000/sthoerfunk.ogg",
                    format : "audio/ogg",
                    quality : "128kbps"
                },
                {
                    stationID : 1,
                    transmitTimesFrom : "00:00:00",
                    transmitTimesTo : "23:59:59",
                    url : "http://fluxfm.radio.de/",
                    format : "text/html",
                    quality : "128kbps"
                },
                {
                    stationID : 2,
                    transmitTimesFrom : "00:00:00",
                    transmitTimesTo : "23:59:59",
                    url : "http://stream.freefm.de:8100/listen.pls",
                    format : "audio/mpeg",
                    quality : "128kbps"
                }
            ]);
        }
        
        public getListByStationID(stationID : number, callback : (webstreams : Array<entities.WebstreamsEntity>) => any)
        {
            this.getList(function(webstreams : Array<entities.WebstreamsEntity>)
            {
                var filtered = new Array<entities.WebstreamsEntity>();
                
                for (var i = 0, length = webstreams.length; i < length; ++i)
                {
                    var currentWebstream = webstreams[i];
                    
                    if (currentWebstream.stationID === stationID)
                    {
                        filtered.push(currentWebstream);
                    }
                }
                
                callback(filtered);
            });
        }
    }
}