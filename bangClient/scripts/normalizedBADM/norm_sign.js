/**
 * Created by tedshaffer on 7/1/16.
 */
import { guid } from '../utilities/utils';

export default class Norm_Sign {
    constructor(signName = "") {
        this.id = guid();
        this.name = signName;
        this.videoMode = "1920x1080x60p";
        this.htmlSitesById = {};
        this.zoneIds = [];
    }

    addZone(zone) {
        this.zoneIds.push(zone.id);
    }
}
