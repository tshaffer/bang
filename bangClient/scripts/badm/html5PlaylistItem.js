/**
 * Created by tedshaffer on 6/23/16.
 */
import MediaPlaylistItem from './mediaPlaylistItem';

export default class HTML5PlaylistItem extends MediaPlaylistItem  {
    constructor(name, htmlSiteName, enableExternalData, enableMouseEvents, displayCursor, hwzOn, useUserStylesheet, userStyleSheet) {
        super(name);

        this.htmlSiteName = htmlSiteName;
        this.enableExternalData = enableExternalData;
        this.enableMouseEvents = enableMouseEvents;
        this.displayCursor = displayCursor;
        this.hwzOn = hwzOn;
        this.useUserStylesheet = useUserStylesheet;
        this.userStyleSheet = userStyleSheet
    }
}
