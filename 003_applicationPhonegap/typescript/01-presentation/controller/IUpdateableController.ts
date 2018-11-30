/// <reference path="IController.ts"/>
/// <reference path="../view/IView.ts"/>

module freeradios.presentation.controller
{
    export interface IUpdateableController extends IController
    {
        updateController();
        updateViewAssignments(view : view.IView, finishCallback : () => any);
        bindListeners();
    }
}