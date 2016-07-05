/**
 * Created by tedshaffer on 6/10/16.
 */
import PlaylistItem from './playlistItem';

export default class MediaPlaylistItem  {
    constructor(fileName) {
        this._playlistItem = new PlaylistItem();
        this.fileName = fileName;
    }

    getId() {
        return this._playlistItem.getId();
    }
    
    getFileName() {
        return this.fileName;
    }
    
    setFileName(fileName) {
        this.fileName = fileName;
    }
}

export default MediaPlaylistItem;