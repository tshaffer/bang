/**
 * Created by tedshaffer on 6/10/16.
 */
import MediaPlaylistItem from './mediaPlaylistItem';

export default class FilePlaylistItem  {
    constructor(fileName, filePath) {
        this._mediaPlaylistItem = new MediaPlaylistItem(fileName);
        this.filePath = filePath;
    }
    
    getId() {
        return this._mediaPlaylistItem.getId();
    }
    
    getFileName() {
        return this._mediaPlaylistItem.getFileName();
    }

    setFileName(fileName) {
        this._mediaPlaylistItem.setFileName(fileName);
    }
    
    getFilePath() {
        return this.filePath;
    }
}

export default FilePlaylistItem;

