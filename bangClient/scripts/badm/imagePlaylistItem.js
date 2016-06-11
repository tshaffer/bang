/**
 * Created by tedshaffer on 6/10/16.
 */
import FilePlaylistItem from './filePlaylistItem';

export default class ImagePlaylistItem extends FilePlaylistItem  {
    constructor(fileName, filePath) {
        super(fileName, filePath);
        console.log("created");
        // this.id = id;
    }
}
