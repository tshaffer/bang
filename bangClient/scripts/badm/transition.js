/**
 * Created by tedshaffer on 7/31/16.
 */
import { guid } from '../utilities/utils';

export default class Transition   {
    constructor(sourceMediaState, targetMediaState) {
        this.id = guid();

        // MediaState
        this.sourceMediaState = sourceMediaState;

        // BSEvent
        this.bsEvent = null;

        // MediaState
        this.targetMediaState = targetMediaState;

        // [BrightSignCmd]
        this.brightSignCmds = [];
    }

    getId() {
        return this.id;
    }

}
