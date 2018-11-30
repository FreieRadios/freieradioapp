module freeradios.presentation.view
{
    export interface IView
    {
        setTemplatePath(path : string);
        setMasterView(view : IView);
        assign(key : string, value : any);
        render(callback : (generatedHTML : string) => any);
        updateView(partSelector : string);
        updateAssignments(parentSelector : string)
        addUpdateCallback(callback : (partSelector : string) => any);
        preloadTemplate(path : string, partSelectors? : Array<string>);
    }
}