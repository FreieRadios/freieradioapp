module freeradios.utilities.navigation
{
    export class URLParameters
    {
        public static buildURL(routeName : string, parameters : { [key : string] : string }) : string
        {
            var queryString = "";
            
            for (var key in parameters)
            {
                if (queryString === "")
                {
                    queryString += "?";
                }
                else
                {
                    queryString += "&";
                }
                
                queryString += key + "=" + parameters[key];                
            }
            
            return routeName + queryString;
        }
        
        public static getParametersFromURL(url : string) : { [key : string] : string }
        {
            var parameters : { [key : string] : string } = {};
            
            var queryString = this.getQueryStringFromURL(url);
            
            while (queryString.indexOf("?") === 0)
            {
                queryString = queryString.substr(1);
            }
            
            if (queryString.replace(/[ \r\n\t]/g, "") === "")
            {
                return parameters;
            }
            
            var keysAndValues = queryString.split("&");
            
            for (var i = 0, length = keysAndValues.length; i < length; ++i)
            {
                var keyValuePair = keysAndValues[i].split("=");
                parameters[keyValuePair[0]] = keyValuePair[1];
            }
            
            return parameters;
        }    
        
        public static getQueryStringFromURL(url : string) : string
        {
            var questionmarkPosition = url.indexOf("?");
            
            if (questionmarkPosition >= 0)
            {
                return url.substring(questionmarkPosition);
            }
            else
            {
                return "";
            }
        }    
        
        public static getRouteNameFromURL(url : string) : string
        {
            var questionmarkPosition = url.indexOf("?");
            
            if (questionmarkPosition >= 0)
            {
                return url.substring(0, questionmarkPosition);
            }
            else
            {
                return url;
            }
        }
        
        public static getParameterBoolean(key : string) : boolean
        {
            var stringValue = this.getParameter(key);
            return stringValue === "true" || stringValue === "1";
        }
        
        public static getParameterNumber(key : string) : number
        {
            var stringValue = this.getParameter(key);
            return stringValue === null ? 0 : parseFloat(stringValue);
        }
        
        public static getParameter(key : string) : string
        {
            var hash = window.location.hash.toString();
            
            var startPosition = hash.indexOf("?" + key + "=");
            
            if (startPosition < 0)
            {
                startPosition = hash.indexOf("&" + key + "=");
            }
            
            if (startPosition >= 0)
            {
                return URLParameters._getParameterWithPosition(hash, startPosition + key.length + 2);
            }
            
            return null;
        }
        
        private static _getParameterWithPosition(hash : string, valueStart : number) : string
        {
            var hashPart = hash.substring(valueStart);
            var ampPosition = hashPart.indexOf("&");
            
            if (hashPart.indexOf("&") >= 0)
            {
                return hashPart.substr(0, hashPart.indexOf("&"));
            }
         
            return hashPart;
        }
    }
}