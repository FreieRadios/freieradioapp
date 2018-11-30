/// <reference path="../../../../02-business/entities/stationdetail/TransmitTimesEntity.ts"/>
/// <reference path="../../../../02-business/entities/stationdetail/enums/TransmitTimesTimeType.ts"/>

module freeradios.presentation.view.handlebarsview.helpers
{
    export class HBTransmitTimeHelper
    {
        public static transmitTimeStringInfo(transmitTime : business.entities.stationdetail.TransmitTimesEntity) : string
        {
            var dateString : string;
            
            if (transmitTime.timeType === business.entities.stationdetail.enums.TransmitTimesTimeType.weekly)
            {
                dateString = "Wöchentlich " + transmitTime.day;
            }
            else
            {
                var weeks = new Array<string>();
                
                if (transmitTime.week1 || transmitTime.firstWeek)
                {
                    weeks.push("1.");
                }
                
                if (transmitTime.week2)
                {
                    weeks.push("2.");
                }
                
                if (transmitTime.week3)
                {
                    weeks.push("3.");
                }
                
                if (transmitTime.week4)
                {
                    weeks.push("4.");
                }
                
                if (transmitTime.week5)
                {
                    weeks.push("5.");
                }

                if (transmitTime.lastWeek)
                {
                    weeks.push("letzten");
                }
                
                var weeksString : string;
                
                if (weeks.length > 1)
                {
                    weeksString = weeks.slice(0, weeks.length - 1).join(", ");
                    weeksString += " und " + weeks[weeks.length - 1]
                }
                else
                {
                    weeksString = weeks[0];
                }
                
                dateString = "Jeden " + weeksString + " " + transmitTime.day + " im Monat";
            }
            
            return dateString + " | " + HBDateHelper.timeHourAndMinute(transmitTime.timeFrom) + " - "  + HBDateHelper.timeHourAndMinute(transmitTime.timeTo);
        }
    }
}