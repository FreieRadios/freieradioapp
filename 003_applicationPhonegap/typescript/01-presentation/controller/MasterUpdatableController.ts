/// <reference path="MasterController.ts"/>
/// <reference path="IUpdateableController.ts"/>
/// <reference path="../sync/SyncManager.ts"/>

module freeradios.presentation.controller
{
    export class MasterUpdatableController extends MasterController implements IUpdateableController
    {
        public onready()
        {
            super.onready();
            sync.SyncManager.addUpdatableController(this);
        }    
        
        public destroyView()
        {
            super.destroyView();
            sync.SyncManager.removeUpdatableController(this);
        }
        
        public updateController()
        {   
            (function(self : MasterUpdatableController)
            {
                var view = self.getView();
                
                self.updateViewAssignments(view, function() 
                {
                    view.updateAssignments(".content");
                    self.bindListeners();
                });
            }(this));
        }
        
        public updateViewAssignments(view : view.IView, finishCallback : () => any)
        {
            throw "Method \"updateViewAssignments\" must be implemented!";
        }
        
        public bindListeners()
        {
            throw "Method \"bindListeners\" must be implemented!";
        }
    }
}