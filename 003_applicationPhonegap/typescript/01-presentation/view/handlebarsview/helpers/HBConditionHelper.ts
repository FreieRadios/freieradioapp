module freeradios.presentation.view.handlebarsview.helpers
{
    export class HBConditionHelper
    {
        public static ifInArray(needle : any, haystack : Array<any>, options : any) : boolean
        {
            for (var i = 0, length = haystack.length; i < length; ++i)
            {
                if (needle === haystack[i])
                {
                    return options.fn(this);
                }
            }
            
            return options.inverse(this);
        }
    }
}