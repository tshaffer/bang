/**
 * Created by tedshaffer on 6/10/16.
 */
import { guid } from '../utilities/utils';

export default class PlaylistItem {
    constructor() {
        this.id = guid();
        this.itemLabel = "";
    }
    
    getId() {
        return this.id;
    }
}

export default PlaylistItem;