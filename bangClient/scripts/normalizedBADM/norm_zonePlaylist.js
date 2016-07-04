/**
 * Created by tedshaffer on 7/1/16.
 */
import { guid } from '../utilities/utils';

export default class Norm_ZonePlaylist   {
    constructor() {
        this.id = guid();
        this.playlistItemIds = {};
    }
}
