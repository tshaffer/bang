/**
 * Created by tedshaffer on 6/6/16.
 */
class PlaylistItem {
    constructor() {
        this.itemLabel = "";
    }

    // getter / setter for itemLabel
}

class MediaPlaylistItem extends PlaylistItem {
    constructor() {
        super();
        this.fileName = "";
    }

    // getter / setter for fileName
}

class FilePlaylistItem extends MediaPlaylistItem  {
    constructor() {
        super();
        this.filePath = "";
    }

    // getter / setter for filePath
}

export default class ImagePlaylistItem extends FilePlaylistItem  {
    constructor(fileName, filePath, thumbUrl, id) {
        super();
        this.thumbUrl = thumbUrl;
        this.id = id;
    }
}


