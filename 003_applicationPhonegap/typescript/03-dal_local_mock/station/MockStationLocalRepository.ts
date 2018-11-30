/// <reference path="../../02-business/contracts/station/IStationLocalRepository.ts"/>
/// <reference path="../../02-business/entities/station/StationEntity.ts"/>

namespace freeradios.dal_local_mock.station {
  import entities = freeradios.business.entities.station;

  export class MockStationLocalRepository implements business.contracts.station.IStationLocalRepository {
    private static _stations: Array<entities.StationEntity> = [
      {
        id: 1,
        lastUpdate: new Date('2015-03-09T12:55:00.6875000+02:00'),
        name: 'FluxFM',
        city: 'Stuttgart',
        xmlURI: '/data/station2.xml',
        frequency: '99.2',
        latitude: 46.266813,
        longitude: 7.210399,
        streamURL: 'http://fluxfm.radio.de/'
      },
      {
        id: 2,
        lastUpdate: new Date('2015-03-09T12:55:00.6875000+02:00'),
        name: 'Free FM',
        city: 'Ulm',
        xmlURI: '/data/station3.xml',
        frequency: '126,4',
        latitude: 49.810399,
        longitude: 8.950399,
        streamURL: 'http://stream.freefm.de:8100/listen.pls'
      },
      {
        id: 0,
        lastUpdate: new Date('2015-03-09T12:55:00.6875000+02:00'),
        name: 'Radio StHörfunk',
        city: 'Schwäbisch Hallo',
        xmlURI: '/data/station.xml',
        frequency: '97.5',
        latitude: 48.466813,
        longitude: 9.410399,
        streamURL: 'http://stream.sthoerfunk.de:7000/sthoerfunk.ogg'
      }
    ];

    public saveStationArray(stations: Array<entities.StationEntity>, callback: (success: boolean) => any) {
      callback(true);
    }

    public saveStation(station: entities.StationEntity, callback: (success: boolean) => any) {
      callback(true);
    }

    public deleteAll(callback: (success: boolean) => any) {
      callback(true);
    }

    public getByID(id: number, callback: (station: entities.StationEntity) => any) {
      this.getStationList(function(stations: Array<entities.StationEntity>) {
        for (var i = 0, length = stations.length; i < length; ++i) {
          var currentStation = stations[i];

          if (currentStation.id === id) {
            callback(currentStation);
            return;
          }
        }

        callback(null);
      });
    }

    public getStationList(callback: (stations: Array<entities.StationEntity>) => any) {
      callback(MockStationLocalRepository._stations);
    }

    public searchInNameAndCity(searchText: string, callback: (stations: Array<entities.StationEntity>) => any) {
      this.getStationList(function(stations: Array<entities.StationEntity>) {
        var searchRegExp = new RegExp(searchText, 'i');
        var filteredStations = new Array<entities.StationEntity>();

        for (var i = 0, length = stations.length; i < length; ++i) {
          var currentStation = stations[i];

          if (searchRegExp.test(currentStation.name) || searchRegExp.test(currentStation.city)) {
            filteredStations.push(currentStation);
          }
        }

        callback(filteredStations);
      });
    }
  }
}
