/// <reference path="../../02-business/entities/stationdetail/StationDetailEntity.ts"/>
/// <reference path="../../02-business/contracts/stationdetail/IStationDetailLocalRepository.ts"/>

namespace freeradios.dal_local_mock.stationdetail {
  import entities = business.entities.stationdetail;

  export class MockStationDetailLocalRepository
    implements business.contracts.stationdetail.IStationDetailLocalRepository {
    public saveStationDetailsArray(
      stationDetails: Array<entities.StationDetailEntity>,
      callback: (success: boolean) => any
    ) {
      callback(true);
    }

    public saveStationDetail(stationDetail: entities.StationDetailEntity, callback: (success: boolean) => any) {
      callback(true);
    }

    public deleteByStationID(stationID: number, callback: (success: boolean) => any) {
      callback(true);
    }

    public getByStationID(stationID: number, callback: (stationDetail: entities.StationDetailEntity) => any) {
      this.getList(function(entities: Array<entities.StationDetailEntity>) {
        var entity: entities.StationDetailEntity = null;

        for (var i = 0, length = entities.length; i < length; ++i) {
          var currentEntity = entities[i];

          if (currentEntity.stationID === stationID) {
            entity = currentEntity;
            break;
          }
        }

        callback(entity);
      });
    }

    public getList(callback: (stationsDetails: Array<entities.StationDetailEntity>) => any) {
      callback([
        {
          stationID: 0,
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
          lastUpdate: new Date('2015-02-09T12:55:00.6875000+02:00')
        },
        {
          stationID: 1,
          displayName: 'FluxFM',
          fullName: 'FluxFM',
          logoSource: '/img/05_other/logos/05.3_logo-freudenstadt.png',
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
          lastUpdate: new Date('2015-02-09T12:55:00.6875000+02:00')
        },
        {
          stationID: 2,
          displayName: 'freeFM',
          fullName: 'freeFMk',
          logoSource: '/img/05_other/logos/05.3_logo-freeFM.png',
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
          lastUpdate: new Date('2015-02-09T12:55:00.6875000+02:00')
        }
      ]);
    }

    public searchInDisplayNameAndFullNameAndCity(
      searchText: string,
      callback: (stationsDetails: Array<entities.StationDetailEntity>) => any
    ) {
      this.getList(function(stationDetails: Array<entities.StationDetailEntity>) {
        var searchRegExp = new RegExp(searchText, 'i');
        var filteredStationsDetails = new Array<entities.StationDetailEntity>();

        for (var i = 0, length = stationDetails.length; i < length; ++i) {
          var currentStationDetail = stationDetails[i];

          if (
            searchRegExp.test(currentStationDetail.fullName) ||
            searchRegExp.test(currentStationDetail.displayName) ||
            searchRegExp.test(currentStationDetail.city)
          ) {
            filteredStationsDetails.push(currentStationDetail);
          }
        }

        callback(filteredStationsDetails);
      });
    }
  }
}
