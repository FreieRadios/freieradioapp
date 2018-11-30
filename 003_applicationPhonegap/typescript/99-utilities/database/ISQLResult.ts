module freeradios.utilities.database
{
    export interface ISQLResult
    {
        hasNext() : boolean;
        next() : boolean;
        getValue(columnName : string) : string
    }
}