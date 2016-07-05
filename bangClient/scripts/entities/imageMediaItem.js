/**
 * Created by tedshaffer on 6/19/16.
 */
import FilePlaylistItem from '../badm/filePlaylistItem';

export default class ImageMediaItem   {
    constructor(fileName="", filePath="") {
        this._filePlaylistItem = new FilePlaylistItem(fileName, filePath);
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
