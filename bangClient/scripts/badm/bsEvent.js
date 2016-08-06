/**
 * Created by tedshaffer on 7/31/16.
 */

import { guid } from '../utilities/utils';

export default class BSEvent   {
    constructor() {
        this.id = guid();
        this.value = "";
    }

    getId() {
        return this.id;
    }
    
    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}

export default BSEvent;