import BSEvent from './bsEvent';

export default class UserEvent  {
    constructor(userEventName) {
        this._bsEvent = new BSEvent();
        this.userEventName = userEventName;
    }

    getId() {
        return this._bsEvent.getId();
    }

    getUserEventName() {
        return this.userEventName;
    }

    setValue(value) {
        this._bsEvent.setValue(value);
    }
    
    getValue() {
        return this._bsEvent.getValue();
    }
}

export default UserEvent;