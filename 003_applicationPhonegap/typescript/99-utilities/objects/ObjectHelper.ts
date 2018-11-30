module freeradios.utilities.objects
{
    export class ObjectHelper    
    {
        public static cloneObject<TType>(obj : TType) : TType
        {
            if (obj === null || typeof(obj) !== "object")
            {
                return obj;
            }
            
            var newObject : TType = <TType>{};
            
            for (var key in obj) 
            {
                if(Object.prototype.hasOwnProperty.call(obj, key)) 
                {
                    newObject[key] = ObjectHelper.cloneObject(obj[key]);                    
                }
            }
            
            return newObject;
        }
    }
}