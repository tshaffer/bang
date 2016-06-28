/**
 * Created by tedshaffer on 6/10/16.
 */

import Zone from './zone';

export default class Sign {
    constructor(signName) {
        this.name = signName;
        this.videoMode = "1920x1080x60p";
        this.htmlSites = [];
        this.zones = [];
    }
    
    addZone(zone) {
        this.zones.push(zone);
    }
}
