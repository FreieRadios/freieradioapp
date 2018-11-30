module freeradios.presentation.view.handlebarsview.helpers
{
    export class HBStringHelper
    {
        public static shortenString(text : string, maxLength : string) : string
        {
            var numericMaxLength = parseInt(maxLength, 10);
            
            if (text.length > numericMaxLength)
            {
                return text.substring(0, numericMaxLength - 3) + "...";
            }
            
            return text;
        }
    }
}