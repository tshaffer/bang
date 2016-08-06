/**
 * Created by tedshaffer on 7/31/16.
 */
import { guid } from '../utilities/utils';

export default class Transition   {
    constructor(sourceMediaState, userEvent, targetMediaState) {
        this.id = guid();

        // MediaState
        this.sourceMediaStateId = sourceMediaState.getId();

        // UserEvent
        this.userEvent = userEvent;

        // MediaState
        this.targetMediaStateId = targetMediaState.getId();

        // [BrightSignCmd]
        this.brightSignCmds = [];
    }

    getUserEvent() {
        return this.userEvent;
    }
    
    getId() {
        return this.id;
    }

}
