/// <reference path="../../02-business/entities/stationdetail/BroadcastsEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/Broadcasts2CategoriesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/CategoriesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/MediaChannelsEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/StationDetailEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/TransmitTimesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/WebstreamsEntity.ts"/>

/// <reference path="../../02-business/contracts/stationdetail/IStationDetailWebRepository.ts"/>

/// <reference path="../../02-business/entities/stationdetail/enums/TransmitTimesTimeType.ts"/>

namespace freeradios.dal_web_mock.stationdetail {
  import entities = business.entities.stationdetail;

  export class MockStationDetailWebRepository implements business.contracts.stationdetail.IStationDetailWebRepository {
    public loadData(dataURL: string, callback: () => any, errorCallback: () => any) {
      callback();
    }

    public getBroadcasts2CategoriesEntity(
      categoryNames2Categories: { [name: string]: entities.CategoriesEntity },
      stationID: number
    ): Array<entities.Broadcasts2CategoriesEntity> {
      var entityArray = [
        { broadcastsID: 10, categoriesID: categoryNames2Categories['Alternative'].id || 0, stationID: stationID },
        { broadcastsID: 10, categoriesID: categoryNames2Categories['World'].id || 0, stationID: stationID }
      ];

      return entityArray;
    }

    public getBroadcastsEntities(stationID: number): Array<entities.BroadcastsEntity> {
      var entityArray = [
        { id: 10, stationID: stationID, title: 'Hrvatska Glazba', description: 'kroatische Musik', isFavorite: false }
      ];

      return entityArray;
    }

    public getMediaChannelsEntities(stationID: number): Array<entities.MediaChannelsEntity> {
      var entityArray = [
        {
          stationID: stationID,
          type: 'ukw',
          frequency: '100,1',
          frequencyUnit: 'MHz',
          city: 'Freudenstadt',
          operator: 'MediaBroadcast',
          power: '1',
          powerUnit: 'kW',
          rdsid: 'FDS100,1',
          transmitTimesFrom: '00:00:00',
          transmitTimesTo: '23:59:59',
          latitude: 48.44519,
          longitude: 8.530226,
          transmitterReceptionArea:
            '48.494866 8.417647 48.539524 8.437176 48.538778 8.492046 48.594002 8.602148 48.526676 8.649936 48.449179 8.692174 48.392013 8.545043 48.326153 8.564997 48.310266 8.368171 48.461093 8.401893 48.494866 8.417647'
        }
      ];

      return entityArray;
    }

    public getStationDetailEntity(stationID: number): entities.StationDetailEntity {
      var entity = {
        stationID: stationID,
        displayName: 'Radio StHörfunk',
        fullName: 'Radio StHörfunk',
        logoSource: '/img/05_other/logos/05.3_logo-sthoerfunk.png',
        baseColor: '#0D2C5A',
        city: 'Freudenstadt',
        studioStreet: 'Forststrasse',
        studioStreetNumber: '23',
        studioCity: 'Freudenstadt',
        studioZIP: '72250',
        latitude: 48.466813,
        longitude: 8.410399,
        studioStudioPhone: '+49 7441 88 22 2',
        studioOfficePhone: '+49 7441 88 22 1',
        studioStudioEMail: 'info@radio-fds.de',
        studioOfficeEMail: 'info@radio-fds.de',
        studioOpenTimeFrom: '12:00:00',
        studioOpenTimeTo: '18:00:00',
        website: 'http://www.radio-fds.de',
        lastUpdate: new Date('2015-03-09T12:55:00.6875000+02:00')
      };

      return entity;
    }

    public getTransmitTimeEntities(stationID: number): Array<entities.TransmitTimesEntity> {
      var entityArray = [
        {
          stationID: stationID,
          broadcastsID: 10,
          recurrence: true,
          rerun: false,
          day: 'FR',
          priority: 0,
          timeFrom: '18:00:00',
          timeTo: '19:00:00',
          week1: false,
          week2: false,
          week3: false,
          week4: false,
          week5: false,
          firstWeek: false,
          lastWeek: false,
          timeType: entities.enums.TransmitTimesTimeType.weekly,
          dateOnceFrom: '',
          dateOnceTo: ''
        }
      ];

      return entityArray;
    }

    public getWebstreamsEntities(stationID: number): Array<entities.WebstreamsEntity> {
      var entityArray = [
        {
          stationID: stationID,
          transmitTimesFrom: '00:00:00',
          transmitTimesTo: '23:59:59',
          url: 'http://85.25.176.186:9140/listen.pls',
          format: 'audio/mpeg',
          quality: '128kbps'
        }
      ];

      return entityArray;
    }
  }
}
