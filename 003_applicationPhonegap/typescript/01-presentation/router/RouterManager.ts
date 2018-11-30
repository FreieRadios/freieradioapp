/// <reference path="IRouter.ts"/>

module freeradios.presentation.router
{
    export class RouterManager
    {
        private _mainContainerID : string;
        private _router : IRouter;
        
        constructor(mainContainerID : string, router : IRouter)
        {
            this._mainContainerID = mainContainerID;
            this._router = router;
            this._router.setMainContainerID(this._mainContainerID);
        }
        
        public startRouting(firstURL : string)
        {
            this._router.start(firstURL);
        }
    }
}