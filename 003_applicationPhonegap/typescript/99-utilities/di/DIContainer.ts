module freeradios.utilities.di
{
    export class DIContainer
    {
        private static _factories : {[key : string] : () => any} = {};
        private static _constructors : {[key : string] : any} = {};
        private static _values : {[key : string] : any} = {};
        
        public static bindValue<T>(key : string, value : T)
        {
            this._values[key] = value;
        }
        
        public static bindConstructor<T>(fullClassNamespace : string, value : new() => T)
        {
            this._constructors[fullClassNamespace] = value;
        }
        
        public static bindFactory<T>(fullClassNamespace : string, value : () => T)
        {
            this._factories[fullClassNamespace] = value;
        }
        
        public static get<T>(key : string, parameter : T) : T
        {
            if (this._values[key] !== undefined)
            {
                return <T>this._values[key];
            }
            else if (this._constructors[key] !== undefined)
            {
                return <T>new this._constructors[key]();
            }
            else if (this._factories[key] !== undefined)
            {
                return <T>this._factories[key]();
            }
            else if (parameter !== undefined)
            {
                return parameter;
            }
            
            throw "No parameter or binding given for \"" + key + "\".";
        }
    }
}