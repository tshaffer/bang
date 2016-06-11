/**
 * Created by tedshaffer on 6/10/16.
 */
import { guid } from '../utilities/utils';

import ZonePlaylist from './zonePlaylist';

export default class Zone   {
    constructor(zoneName, zoneType) {
        this.id = guid();
        this.name = zoneName;
        this.type = zoneType;
        this.zonePlaylist = new ZonePlaylist();
    }
}
