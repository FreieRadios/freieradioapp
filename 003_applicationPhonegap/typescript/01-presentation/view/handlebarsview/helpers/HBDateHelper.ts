module freeradios.presentation.view.handlebarsview.helpers
{
    export class HBDateHelper
    {
        private static _monthNames : Array<string> =
        [
            "Januar",
            "Februar",
            "März",
            "April",
            "Mai",
            "Juni",
            "Juli",
            "August",
            "September",
            "Oktober",
            "November",
            "Dezember"
        ];    
        
        public static timeHourAndMinute(timeString : string) : string
        {
            if (timeString.length > 5)
            {
                return timeString.substring(0, 5);
            }
            
            return timeString;
        }
        
        public static dateNumeric(date : Date) : string
        {
            var dateString = HBDateHelper._formatDateSegment(date.getDate())
                                + "." + HBDateHelper._formatDateSegment(date.getMonth() + 1)      
                                + "." + date.getFullYear();
            
            return dateString;
        }
        
        public static dateFull(date : Date) : string
        {
            var dateString = HBDateHelper._formatDateSegment(date.getDate())
                                + ". " + HBDateHelper._monthNames[date.getMonth()]     
                                + " " + date.getFullYear();
            
            return dateString;
        }
        
        public static dateTimeNumeric(date : Date) : string
        {
            var dateTimeString = HBDateHelper.dateNumeric(date)
                                    + ", " + HBDateHelper._formatDateSegment(date.getHours())
                                    + ":" + HBDateHelper._formatDateSegment(date.getMinutes())
                                    + "Uhr";
            
            return dateTimeString;
        }
        
        public static dateTimeFull(date : Date) : string
        {
            var dateTimeString = HBDateHelper.dateFull(date)
                                    + ", " + HBDateHelper._formatDateSegment(date.getHours())
                                    + ":" + HBDateHelper._formatDateSegment(date.getMinutes())
                                    + "Uhr";
            
            return dateTimeString;
        }
        
        private static _formatDateSegment(segment : number) : string
        {
            return segment < 10 ? "0" + segment : String(segment);
        }
    }
}