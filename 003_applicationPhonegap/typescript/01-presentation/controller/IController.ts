/// <reference path="../view/IView.ts"/>
/// <reference path="../router/IRouter.ts"/>

module freeradios.presentation.controller
{
    export interface IController
    {
        setRouter(router : router.IRouter);
        createView(callback : (view : view.IView) => any);
        destroyView();
        onready();
    }
}