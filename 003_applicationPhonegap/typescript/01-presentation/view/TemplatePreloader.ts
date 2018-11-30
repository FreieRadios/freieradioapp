/// <reference path="IView.ts"/>
/// <reference path="../../99-utilities/di/DIContainer.ts"/>

module freeradios.presentation.view
{
    import di = utilities.di;
    
    export class TemplatePreloader
    {
        private _view : IView;    

        constructor(view? : IView) 
        {
            this._view = di.DIContainer.get<freeradios.presentation.view.IView>("freeradios.presentation.view.IView", view);
        }    

        public preloadTemplate(path : string, partSelectors? : Array<string>)
        {
            this._view.preloadTemplate(path, partSelectors);
        }
    }
}