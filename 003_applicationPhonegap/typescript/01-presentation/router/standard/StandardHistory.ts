/// <reference path="StandardHistoryEntry.ts"/>
/// <reference path="../IHistory.ts"/>

module freeradios.presentation.router.standard
{
    export class StandardHistory implements IHistory
    {
        private _entries : Array<StandardHistoryEntry>;
        
        constructor()
        {
            this._entries = new Array<StandardHistoryEntry>();
        }
        
        public push(entry : StandardHistoryEntry)
        {
            this._entries.push(entry);
        }
        
        public pop() : StandardHistoryEntry
        {
            return this._entries.pop();
        }
        
        public hasEntries()
        {
            return this._entries.length > 0;
        }
    }
}