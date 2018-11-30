module freeradios.presentation.transition
{
    export interface ITransition
    {
        play(mainContainerID : string, lastHTML : string, nextHTML : string, reverse : boolean, finishCallback : () => any);
    }
}