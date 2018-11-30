/// <reference path="../../02-business/contracts/station/IStationWebRepository.ts"/>
/// <reference path="../../02-business/entities/station/StationEntity.ts"/>

namespace freeradios.dal_web_mock.station {
  import entities = business.entities.station;

  export class MockStationWebRepository implements business.contracts.station.IStationWebRepository {
    public getStationList(callback: (stations: Array<entities.StationEntity>) => any, errorCallback: () => any) {
      var stations = new Array<entities.StationEntity>();

      stations[0] = new entities.StationEntity();
      stations[0].id = 0;
      stations[0].lastUpdate = new Date('2015-03-09T12:55:00.6875000+02:00');
      stations[0].name = 'Radio StHörfunk';
      stations[0].city = 'Schwäbisch Hallo';
      stations[0].xmlURI = '/data/station.xml';
      stations[0].frequency = '97.5';
      stations[0].latitude = 48.466813;
      stations[0].longitude = 9.410399;
      stations[0].streamURL = 'http://stream.sthoerfunk.de:7000/sthoerfunk.ogg';

      stations[1] = new entities.StationEntity();
      stations[1].id = 1;
      stations[1].lastUpdate = new Date('2015-03-09T12:55:00.6875000+02:00');
      stations[1].name = 'FluxFM';
      stations[1].city = 'Stuttgart';
      stations[1].xmlURI = '/data/station2.xml';
      stations[1].frequency = '99.2';
      stations[1].latitude = 46.266813;
      stations[1].longitude = 7.210399;
      stations[1].streamURL = 'http://fluxfm.radio.de/';

      stations[2] = new entities.StationEntity();
      stations[2].id = 2;
      stations[2].lastUpdate = new Date('2015-03-09T12:55:00.6875000+02:00');
      stations[2].name = 'Free FM';
      stations[2].city = 'Ulm';
      stations[2].xmlURI = '/data/station3.xml';
      stations[2].frequency = '126,4';
      stations[2].latitude = 49.810399;
      stations[2].longitude = 8.950399;
      stations[2].streamURL = 'http://stream.freefm.de:8100/listen.pls';

      callback(stations);
    }
  }
}
