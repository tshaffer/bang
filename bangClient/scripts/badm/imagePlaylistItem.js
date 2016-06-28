/**
 * Created by tedshaffer on 6/10/16.
 */
import FilePlaylistItem from './filePlaylistItem';

export default class ImagePlaylistItem extends FilePlaylistItem  {
    constructor(fileName, filePath, timeOnScreen, transition, transitionDuration, videoPlayerRequired) {
        super(fileName, filePath);

        this.timeOnScreen = timeOnScreen;
        this.transition = transition;
        this.transitionDuration = transitionDuration;
        this.videoPlayerRequired = videoPlayerRequired;
    }
}
