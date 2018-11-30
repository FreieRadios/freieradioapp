module freeradios.utilities.audio.helpers
{
    export class AudioPlayerFactory
    {
        public static create() : HTMLAudioElement
        {
            var audioElement = document.createElement("audio");
            document.body.appendChild(audioElement);
            return audioElement;
        }
        
        public static destroy(audioPlayer : HTMLAudioElement)
        {
            if (document.body.contains(audioPlayer))
            {
                document.body.removeChild(audioPlayer);
            }                        
        }
    }
}