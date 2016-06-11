/**
 * Created by tedshaffer on 6/10/16.
 */
import MediaPlaylistItem from './mediaPlaylistItem';

export default class FilePlaylistItem extends MediaPlaylistItem  {
    constructor(fileName, filePath) {
        super(fileName);
        this.filePath = filePath;
    }
}
