/**
 * Created by tedshaffer on 6/22/16.
 */
import { guid } from '../utilities/utils';

export default class HtmlSite {
    constructor(name, type, spec) {
        this.id = guid();
        this.name = name;
        this.type = type;
        this.spec = spec;
    }
}
