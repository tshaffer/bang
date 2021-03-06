/**
 * Created by tedshaffer on 7/1/16.
 */
import { guid } from '../utilities/utils';

import Norm_ZonePlaylist from './norm_zonePlaylist';

export default class Norm_Zone   {
    constructor(zoneName = "", zoneType = "") {
        this.id = guid();
        this.name = zoneName;
        this.type = zoneType;

        // TODO - long term, probably don't want to do this as not all zones will have zone playlists
        this.zonePlaylistId = "";
    }
}
