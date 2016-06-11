/**
 * Created by tedshaffer on 6/10/16.
 */
import PlaylistItem from './playlistItem';

export default class MediaPlaylistItem extends PlaylistItem {
    constructor(fileName) {
        super();
        this.fileName = fileName;
    }
}

