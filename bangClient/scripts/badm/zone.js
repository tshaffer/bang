/**
 * Created by tedshaffer on 6/10/16.
 */
import { guid } from '../utilities/utils';

import ZonePlaylist from './zonePlaylist';

export default class Zone   {
    constructor(zoneName, zoneType) {
        this.name = zoneName;
        this.type = zoneType;

        // TODO - long term, probably don't want to do this as not all zones will have zone playlists
        this.zonePlaylist = new ZonePlaylist();
    }
}
