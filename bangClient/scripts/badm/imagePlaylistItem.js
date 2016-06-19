/**
 * Created by tedshaffer on 6/10/16.
 */
import FilePlaylistItem from './filePlaylistItem';

export default class ImagePlaylistItem extends FilePlaylistItem  {
    constructor(fileName, filePath) {
        super(fileName, filePath);

        this.timeOnScreen = 6;
        this.transition = 0;
        this.transitionDuration = 2;
        this.videoPlayerRequired = false;
    }
}
