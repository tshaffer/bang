export default class MediaState  {
    constructor(mediaPlaylistItem, x, y) {
        this._mediaPlaylistItem = mediaPlaylistItem;
        this.x = x;
        this.y = y;
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

    getTransitionOutIds() {
        return this.transitionOutIds;
    }
}

export default MediaState;

