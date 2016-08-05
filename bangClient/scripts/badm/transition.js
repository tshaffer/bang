/**
 * Created by tedshaffer on 7/31/16.
 */
import { guid } from '../utilities/utils';

export default class Transition   {
    constructor(sourceMediaState, targetMediaState) {
        this.id = guid();

        // MediaState
        this.sourceMediaStateId = sourceMediaState.getId();

        // BSEvent
        this.bsEvent = null;

        // MediaState
        this.targetMediaStateId = targetMediaState.getId();

        // [BrightSignCmd]
        this.brightSignCmds = [];
    }

    getId() {
        return this.id;
    }

}
