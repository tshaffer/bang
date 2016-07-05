/**
 * Created by tedshaffer on 6/10/16.
 */
import FilePlaylistItem from './filePlaylistItem';

export default class ImagePlaylistItem   {
    constructor(fileName="", filePath="", timeOnScreen=-1, transition=-1, transitionDuration=-1, videoPlayerRequired=false) {

        this._filePlaylistItem = new FilePlaylistItem(fileName, filePath);
        this.timeOnScreen = timeOnScreen;
        this.transition = transition;
        this.transitionDuration = transitionDuration;
        this.videoPlayerRequired = videoPlayerRequired;
    }
    
    getId() {
        return this._filePlaylistItem.getId();
    }
    
    getFileName() {
        return this._filePlaylistItem.getFileName();
    }
    
    getFilePath() {
        return this._filePlaylistItem.getFilePath();
    }
}

export default ImagePlaylistItem;