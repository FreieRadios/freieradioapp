/// <reference path="../../02-business/entities/stationdetail/TransmitTimesEntity.ts"/>
/// <reference path="../../02-business/entities/stationdetail/enums/TransmitTimesTimeType.ts"/>

module freeradios.utilities.date
{
    import entities = business.entities.stationdetail;
    
    export class TransmitTimesDateHelper
    {
        public static isTransmitTimeNow(transmitTime : entities.TransmitTimesEntity) : boolean
        {           
            return this.isDateInTransmitTime(new Date(), transmitTime);            
        }
        
        public static isDateInTransmitTime(date : Date, transmitTime : entities.TransmitTimesEntity) : boolean
        {
            if (transmitTime.timeType == entities.enums.TransmitTimesTimeType.daily)
            {
                return this._isTimeBetweenTransmitTimes(date, transmitTime.timeFrom, transmitTime.timeTo);
            }
            else if (transmitTime.timeType == entities.enums.TransmitTimesTimeType.once)
            {
                var dateTime = date.getTime();
                var dateOnceFromTime = new Date(transmitTime.dateOnceFrom).getTime();
                var dateOnceToTime = new Date(transmitTime.dateOnceTo).getTime();
                
                return dateTime >= dateOnceFromTime && dateTime <= dateOnceToTime;
            }
            else if (transmitTime.timeType === entities.enums.TransmitTimesTimeType.weekly)
            {
                return this._getDayOfWeekFromAbbreviation(transmitTime.day) === date.getDay()
                    && this._isTimeBetweenTransmitTimes(date, transmitTime.timeFrom, transmitTime.timeTo);
            }
            else
            {
                return this._getDayOfWeekFromAbbreviation(transmitTime.day) === date.getDay()
                    && this._isTransmitTimeWeekActive(date, transmitTime)
                    && this._isTimeBetweenTransmitTimes(date, transmitTime.timeFrom, transmitTime.timeTo);
            }
        }
        
        public static isTransmitTimeOfDay(day : Date, transmitTime : entities.TransmitTimesEntity)
        {
            if (transmitTime.timeType == entities.enums.TransmitTimesTimeType.daily)
            {
                return true;
            }
            else if (transmitTime.timeType == entities.enums.TransmitTimesTimeType.once)
            {
                var dateOnceFrom = new Date(transmitTime.dateOnceFrom)
                return dateOnceFrom.getDay() === day.getDay();
            }
            else if (transmitTime.timeType === entities.enums.TransmitTimesTimeType.weekly)
            {
                return this._getDayOfWeekFromAbbreviation(transmitTime.day) === day.getDay();
            }
            else
            {
                return this._getDayOfWeekFromAbbreviation(transmitTime.day) === day.getDay()
                                && this._isTransmitTimeWeekActive(day, transmitTime);
            }
        }
        
        public static sortTransmitTimes(transmitTimes : Array<entities.TransmitTimesEntity>) : Array<entities.TransmitTimesEntity>
        {
            transmitTimes.sort(function(time1, time2)
            {
                var day1 = TransmitTimesDateHelper._getDayOfWeekFromAbbreviationStartingOnMonday(time1.day);
                var day2 = TransmitTimesDateHelper._getDayOfWeekFromAbbreviationStartingOnMonday(time2.day);
                
                if (day1 !== day2)
                {
                    return day1 - day2;
                }
                else
                {
                    return time1.timeFrom.localeCompare(time2.timeFrom);
                }
            });
            
            return transmitTimes;
        }
                
        public static doTimesIntersect(time1From : string, time1To : string, time2From : string, time2To : string) : boolean
        {
            var returnValue = this._isTimeStringBetweenTransmitTimes(time1From, time2From, time2To, true, true)
                || this._isTimeStringBetweenTransmitTimes(time1To, time2From, time2To, true, true)
                || this._isTimeStringBetweenTransmitTimes(time2From, time1From, time1To, false, true)
                || this._isTimeStringBetweenTransmitTimes(time2To, time1From, time1To, true, true);
            
            return returnValue;                
        }
        
        public static getDayStringFromDate(date : Date) : string
        {
            switch (date.getDay())
            {
                case 0 : return "SO";
                case 1 : return "MO";
                case 2 : return "DI";
                case 3 : return "MI";
                case 4 : return "DO";
                case 5 : return "FR";
                case 6 : return "SA";
                default : return null;
            }
        }
        
        public static getTimeStringFromDate(date : Date) : string
        {
            var hour = date.getHours();
            var minute = date.getMinutes();
            
            var dateString = hour < 10 ? '0' + hour + ':' : hour + ':';
            dateString += minute < 10 ? '0' + minute + ':' : minute;
            
            return dateString;
        }
        
        public static parseDateOnceString(dateString : string) : string
        {
            return dateString.replace(/T/g, ' ').replace(/[\-\+]\d\d:\d\d/g, '');
        }
        
        private static _isTimeStringBetweenTransmitTimes(timeString : string, timeFrom : string, timeTo : string, excludeStart? : boolean, excludeEnd? : boolean) : boolean
        {
            var hoursAndMinutes = this._getHoursAndMinutesFromTimeString(timeString);
            var hours = hoursAndMinutes[0];
            var minutes = hoursAndMinutes[1];
            
            var hoursAndMinutesFrom = this._getHoursAndMinutesFromTimeString(timeFrom);
            var fromHours = hoursAndMinutesFrom[0];
            var fromMinutes = hoursAndMinutesFrom[1];
            
            var hoursAndMinutesTo = this._getHoursAndMinutesFromTimeString(timeTo);
            var toHours = hoursAndMinutesTo[0];
            var toMinutes = hoursAndMinutesTo[1];
            
            return this._isHourAndMinuteBetweenHourAndMinute(hours, minutes, fromHours, fromMinutes, toHours, toMinutes, excludeStart, excludeEnd);
        }
        
        private static _isTimeBetweenTransmitTimes(date : Date, timeFrom : string, timeTo : string, excludeStart? : boolean, excludeEnd? : boolean) : boolean
        {
            var dateHours = date.getHours();
            var dateMinutes = date.getMinutes();
            
            var hoursAndMinutesFrom = this._getHoursAndMinutesFromTimeString(timeFrom);
            var fromHours = hoursAndMinutesFrom[0];
            var fromMinutes = hoursAndMinutesFrom[1];
            
            var hoursAndMinutesTo = this._getHoursAndMinutesFromTimeString(timeTo);
            var toHours = hoursAndMinutesTo[0];
            var toMinutes = hoursAndMinutesTo[1];
            
            return this._isHourAndMinuteBetweenHourAndMinute(dateHours, dateMinutes, fromHours, fromMinutes, toHours, toMinutes, excludeStart, excludeEnd);
        }
        
        private static _isHourAndMinuteBetweenHourAndMinute(hours : number, minutes : number, fromHours : number, fromMinutes : number, toHours : number, toMinutes : number, excludeStart? : boolean, excludeEnd? : boolean) : boolean
        {
            var returnValue : boolean
            
            if (excludeStart)
            {
                returnValue = (hours > fromHours || hours === fromHours && minutes > fromMinutes);
            }
            else
            {
                returnValue = (hours > fromHours || hours === fromHours && minutes >= fromMinutes);
            }
            
            if (excludeEnd)
            {
                returnValue = returnValue && (hours < toHours || hours === toHours && minutes < toMinutes);
            }
            else
            {
                returnValue = returnValue && (hours < toHours || hours === toHours && minutes <= toMinutes);
            }
            
            return returnValue;
        }
        
        private static _isTransmitTimeWeekActive(date : Date, transmitTime : entities.TransmitTimesEntity) : boolean
        {
            var weekOfMonth = this._getWeekOfMonth(date);
            
            var isWeekActive = (weekOfMonth === 1 && transmitTime.week1)
                                || (weekOfMonth === 2 && transmitTime.week2)
                                || (weekOfMonth === 3 && transmitTime.week3)
                                || (weekOfMonth === 4 && transmitTime.week4)
                                || (weekOfMonth === 5 && transmitTime.week5)
                                || (weekOfMonth === 1 && transmitTime.firstWeek)
                                || (TransmitTimesDateHelper._isLastWeekOfMonth(date) && transmitTime.lastWeek);
            
            return isWeekActive;
        }
        
        private static _getDayOfWeekFromAbbreviation(abbreviation : string) : number
        {
            switch (abbreviation.toUpperCase())
            {
                case "SO" : return 0;
                case "MO" : return 1;
                case "DI" : return 2;
                case "MI" : return 3;
                case "DO" : return 4;
                case "FR" : return 5;
                case "SA" : return 6;
                default : return -1;
            }
        }
        
        private static _getDayOfWeekFromAbbreviationStartingOnMonday(abbreviation : string) : number
        {
            switch (abbreviation.toUpperCase())
            {
                case "MO" : return 0;
                case "DI" : return 1;
                case "MI" : return 2;
                case "DO" : return 3;
                case "FR" : return 4;
                case "SA" : return 5;
                case "SO" : return 6;
                default : return 0;
            }
        }
        
        private static _getWeekOfMonth(date : Date) : number
        {
            var month = date.getMonth();
            var year = date.getFullYear();
            var firstWeekday = new Date(year, month, 1).getDay();
            var lastDateOfMonth = new Date(year, month + 1, 0).getDate();
            var offsetDate = date.getDate() + firstWeekday - 1;
            var index = 1;
            var weeksInMonth = index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7);
            var week = index + Math.floor(offsetDate / 7);
    
            return week;
        }
        
        private static _getHoursAndMinutesFromTimeString(timeString : string) : Array<number>
        {
            var timeParts = timeString.split(":");
            
            var hoursAndMinutes = new Array<number>();
            
            if (timeParts[0].substring(0, 1) === "0")
            {
                timeParts[0] = timeParts[0].substring(1);
            }
            
            if (timeParts[1].substring(0, 1) === "0")
            {
                timeParts[1] = timeParts[1].substring(1);
            }
            
            hoursAndMinutes[0] = parseInt(timeParts[0], 10);
            hoursAndMinutes[1] = parseInt(timeParts[1], 10);            
            
            return hoursAndMinutes;
        }
        
        private static _isLastWeekOfMonth(date : Date) : boolean
        {
            var nextDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
            return date.getMonth() !== nextDate.getMonth();
        }
    }
}