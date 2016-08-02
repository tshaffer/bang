export default class MediaState  {
    constructor(mediaPlaylistItem, x, y) {
        this._mediaPlaylistItem = mediaPlaylistItem;
        this.x = x;
        this.y = y;
        this.transitionInIds = [];
        this.transitionOutIds = [];
    }

    // getX() {
    //     return this.x;
    // }
    //
    // getY() {
    //     return this.y;
    // }

    getMediaPlaylistItem() {
        return this._mediaPlaylistItem;
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

    getFilePath() {
        return this.filePath;
    }

    getTransitionInIds() {
        return this.transitionInIds;
    }
    
    getTransitionOutIds() {
        return this.transitionOutIds;
    }
}

export default MediaState;

