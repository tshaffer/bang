/**
 * Created by tedshaffer on 6/23/16.
 */
import MediaPlaylistItem from './mediaPlaylistItem';

export default class HTML5PlaylistItem   {
    constructor(name, htmlSiteName, enableExternalData, enableMouseEvents, displayCursor, hwzOn, useUserStylesheet, userStyleSheet) {

        this._mediaPlaylistItem = new MediaPlaylistItem(name);
        
        this.htmlSiteName = htmlSiteName;
        this.enableExternalData = enableExternalData;
        this.enableMouseEvents = enableMouseEvents;
        this.displayCursor = displayCursor;
        this.hwzOn = hwzOn;
        this.useUserStylesheet = useUserStylesheet;
        this.userStyleSheet = userStyleSheet;
    }

    getId() {
        return this._mediaPlaylistItem.getId();
    }

    getFileName() {
        return this._mediaPlaylistItem.getFileName();
    }

    setFileName(fileName) {
        this._mediaPlaylistItem.setFileName(fileName);
    }

}

export default HTML5PlaylistItem;