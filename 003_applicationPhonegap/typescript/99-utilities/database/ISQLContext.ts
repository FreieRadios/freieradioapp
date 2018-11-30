/// <reference path="ISQLResult.ts"/>

module freeradios.utilities.database
{
    export interface ISQLContext
    {
        open();
        close();
        query(query : string) : PreparedStatement;
        beginTransaction();
        commitTransaction(callback : (success : boolean) => any);
        executeNonResults(statement : PreparedStatement, callback : (success : boolean) => any);
        executeWithResults(statement : PreparedStatement, callback : (result : ISQLResult) => any);
        lastRowID() : number;
        prepareValue(value : any) : string;
    }
}