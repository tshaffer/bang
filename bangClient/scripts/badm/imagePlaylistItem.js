/**
 * Created by tedshaffer on 6/10/16.
 */
import FilePlaylistItem from './filePlaylistItem';

export default class ImagePlaylistItem extends FilePlaylistItem  {
    constructor(fileName="", filePath="", timeOnScreen=-1, transition=-1, transitionDuration=-1, videoPlayerRequired=false) {
        super(fileName, filePath);

        this.timeOnScreen = timeOnScreen;
        this.transition = transition;
        this.transitionDuration = transitionDuration;
        this.videoPlayerRequired = videoPlayerRequired;
    }
}
