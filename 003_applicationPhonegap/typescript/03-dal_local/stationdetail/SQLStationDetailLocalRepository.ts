/// <reference path="../../02-business/contracts/stationdetail/IStationDetailLocalRepository.ts"/>
/// <reference path="../../02-business/entities/stationdetail/StationDetailEntity.ts"/>

/// <reference path="../../99-utilities/database/ISQLContext.ts"/>

/// <reference path="../BaseSQLRepository.ts"/>

module freeradios.dal_local.stationdetail
{
    import entities = freeradios.business.entities.stationdetail;
    
    export class SQLStationDetailLocalRepository extends BaseSQLRepository implements business.contracts.stationdetail.IStationDetailLocalRepository
    {   
        public saveStationDetailsArray(stationDetails : Array<entities.StationDetailEntity>, callback : (success : boolean) => any)
        {
            this.getContext().beginTransaction();
            
            for (var i = 0, length = stationDetails.length; i < length; ++i)
            {
                this.saveStationDetail(stationDetails[i], function(success : boolean) {});
            }
            
            this.getContext().commitTransaction(function(success : boolean) 
            {
                callback(success);
            });
        }
        
        public saveStationDetail(stationDetail : entities.StationDetailEntity, callback : (success : boolean) => any)
        {
            if (isNaN(stationDetail.stationID))
            {
                return;
            }
            
            var query = "INSERT INTO stations_detail "
                        + "(stations_detail_stations_id, stations_detail_displayname, stations_detail_fullname, stations_detail_logosrc, stations_detail_basecolor, "
                        + "stations_detail_city, stations_detail_studio_street, stations_detail_studio_street_number, stations_detail_studio_city, stations_detail_studio_zip, "
                        + "stations_detail_studio_latitude, stations_detail_studio_longitude, stations_detail_studio_studio_phone, stations_detail_studio_office_phone, "
                        + "stations_detail_studio_studio_email, stations_detail_studio_office_email, stations_detail_studio_open_time_from, stations_detail_studio_open_time_to, "
                        + "stations_detail_studio_website, stations_detail_studio_lastupdate) VALUES "
                        + "(:STATIONSID, :DISPLAYNAME, :FULLNAME, :LOGOSRC, :BASECOLOR, "
                        + ":CITY, :STUDIOSTREET, :STUDIOSTREETNUMBER, :STUDIOCITY, :STUDIOZIP, "
                        + ":STUDIOLATITUDE, :STUDIOLONGITUDE, :STUDIOPHONE, :OFFICEPHONE, "
                        + ":STUDIOEMAIL, :OFFICEEMAIL, :OPENTIMEFROM, :OPENTIMETO, "
                        + ":WEBSITE, :LASTUPDATE);";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":STATIONSID", stationDetail.stationID);
            statement.bindValue(":DISPLAYNAME", stationDetail.displayName || "");
            statement.bindValue(":FULLNAME", stationDetail.fullName || "");
            statement.bindValue(":LOGOSRC", stationDetail.logoSource || "");
            statement.bindValue(":BASECOLOR", stationDetail.baseColor || "");
            statement.bindValue(":CITY", stationDetail.city || "");
            statement.bindValue(":STUDIOSTREET", stationDetail.studioStreet || "");
            statement.bindValue(":STUDIOSTREETNUMBER", stationDetail.studioStreetNumber || "");
            statement.bindValue(":STUDIOCITY", stationDetail.studioCity || "");
            statement.bindValue(":STUDIOZIP", stationDetail.studioZIP || "");
            statement.bindValue(":STUDIOLATITUDE", stationDetail.latitude || 0);
            statement.bindValue(":STUDIOLONGITUDE", stationDetail.longitude || 0);
            statement.bindValue(":STUDIOPHONE", stationDetail.studioStudioPhone || "");
            statement.bindValue(":OFFICEPHONE", stationDetail.studioOfficePhone || "");
            statement.bindValue(":STUDIOEMAIL", stationDetail.studioStudioEMail || "");
            statement.bindValue(":OFFICEEMAIL", stationDetail.studioOfficeEMail || "");
            statement.bindValue(":OPENTIMEFROM", stationDetail.studioOpenTimeFrom || "");
            statement.bindValue(":OPENTIMETO", stationDetail.studioOpenTimeTo || "");
            statement.bindValue(":WEBSITE", stationDetail.website || "");
            statement.bindValue(":LASTUPDATE", stationDetail.lastUpdate || new Date(0));
            
            this.getContext().executeNonResults(statement, callback);
        }
        
        public deleteByStationID(stationID : number, callback : (success : boolean) => any)
        {
            var statement = this.getContext().query("DELETE FROM stations_detail WHERE stations_detail_stations_id=:STATIONID;");
            statement.bindValue(":STATIONID", stationID);
            this.getContext().executeNonResults(statement, callback);
        }
        
        public getByStationID(stationID : number, callback : (stationDetail : entities.StationDetailEntity) => any)
        {
            var statement = this.getContext().query("SELECT * FROM stations_detail WHERE stations_detail_stations_id=:STATIONID LIMIT 1;");
            statement.bindValue(":STATIONID", stationID);
            this.getSingleWithStatement<entities.StationDetailEntity>(statement, this._getStationDetailFromSQLResults, callback);
        }
        
        public getList(callback : (stationsDetails : Array<entities.StationDetailEntity>) => any)
        {
             var statement = this.getContext().query("SELECT * FROM stations_detail ORDER BY stations_detail_displayname COLLATE NOCASE;");
             this.getListWithStatement<entities.StationDetailEntity>(statement, this._getStationDetailFromSQLResults, callback);
        }
        
        public searchInDisplayNameAndFullNameAndCity(searchText : string, callback : (stationsDetails : Array<entities.StationDetailEntity>) => any)
        {
            var query = "SELECT * FROM stations_detail WHERE "
                            + "stations_detail_displayname LIKE :DISPLAYNAME "
                            + "OR stations_detail_fullname LIKE :FULLNAME "
                            + "OR stations_detail_city LIKE :CITY "
                            + "OR stations_detail_studio_city LIKE :STUDIOCITY "
                            + "ORDER BY stations_detail_displayname COLLATE NOCASE;";
            
            var statement = this.getContext().query(query);
            
            statement.bindValue(":DISPLAYNAME", "%" + searchText + "%");
            statement.bindValue(":FULLNAME", "%" + searchText + "%");
            statement.bindValue(":CITY", "%" + searchText + "%");
            statement.bindValue(":STUDIOCITY", "%" + searchText + "%");            
            
            this.getListWithStatement<entities.StationDetailEntity>(statement, this._getStationDetailFromSQLResults, callback);
        }              
        
        private _getStationDetailFromSQLResults(results : utilities.database.ISQLResult) : entities.StationDetailEntity
        {
            var stationDetail = new entities.StationDetailEntity();
            
            stationDetail.stationID = parseInt(results.getValue("stations_detail_stations_id"), 10);            
            stationDetail.displayName = results.getValue("stations_detail_displayname");            
            stationDetail.fullName = results.getValue("stations_detail_fullname");             
            stationDetail.logoSource = results.getValue("stations_detail_logosrc");             
            stationDetail.baseColor = results.getValue("stations_detail_basecolor");            
            stationDetail.city = results.getValue("stations_detail_city");            
            stationDetail.studioStreet = results.getValue("stations_detail_studio_street");            
            stationDetail.studioStreetNumber = results.getValue("stations_detail_studio_street_number");            
            stationDetail.studioCity = results.getValue("stations_detail_studio_city");            
            stationDetail.studioZIP = results.getValue("stations_detail_studio_zip");            
            stationDetail.latitude = parseFloat(results.getValue("stations_detail_studio_latitude"));            
            stationDetail.longitude = parseFloat(results.getValue("stations_detail_studio_longitude"));            
            stationDetail.studioStudioPhone = results.getValue("stations_detail_studio_studio_phone");            
            stationDetail.studioOfficePhone = results.getValue("stations_detail_studio_office_phone");            
            stationDetail.studioStudioEMail = results.getValue("stations_detail_studio_studio_email");;            
            stationDetail.studioOfficeEMail = results.getValue("stations_detail_studio_office_email");            
            stationDetail.studioOpenTimeFrom = results.getValue("stations_detail_studio_open_time_from");            
            stationDetail.studioOpenTimeTo = results.getValue("stations_detail_studio_open_time_to");            
            stationDetail.website = results.getValue("stations_detail_studio_website");            
            stationDetail.lastUpdate = new Date(results.getValue("stations_detail_studio_lastupdate"));

            return stationDetail;
        }
    }
}