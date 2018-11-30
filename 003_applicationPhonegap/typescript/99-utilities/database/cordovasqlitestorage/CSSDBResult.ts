/// <reference path="../ISQLResult.ts"/>

module freeradios.utilities.database.cordovasqlitestorage
{
    // Module: https://github.com/litehelpers/Cordova-sqlite-storage
    
    export class CSSDBResult implements ISQLResult
    {
        private _resultSet : any;
        private _row : any;
        
        private _index : number;
        private _length : number;
        
        constructor(resultSet : any)
        {
            this._resultSet = resultSet;
            this._row = null;
            this._index = -1;
            this._length = this._resultSet.rows.length;
        }
        
        public hasNext() : boolean
        {
            return this._length > 0 && this._index < this._length;
        }
        
        public next() : boolean
        {  
            ++this._index;
            
            if (this.hasNext())
            {
                this._row = this._resultSet.rows.item(this._index);
                return true;
            }
            else
            {
                this._row = null;
                return false;
            }
        }
        
        public getValue(columnName : string) : string
        {
            if (this._row !== null)
            {
                if (this._row[columnName] !== undefined)
                {
                    return String(this._row[columnName]);
                }
                
                throw "Unknown column \"" + columnName + "\".";                      
            }
            
            throw "Result set not positioned at a valid record.";            
        }
    }
}