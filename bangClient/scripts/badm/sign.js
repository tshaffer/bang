/**
 * Created by tedshaffer on 6/10/16.
 */

import Zone from './zone';

import { guid } from '../utilities/utils';

export default class Sign {
    constructor(signName) {
        this.id = guid();
        this.name = signName;
        this.zones = [];
        
        this.zones.push(new Zone("images", "images"));
    }
}
