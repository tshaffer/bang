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
    constructor(fileName) {
        super();
        this.fileName = fileName;
    }

    // getter / setter for fileName
}

class FilePlaylistItem extends MediaPlaylistItem  {
    constructor(fileName, filePath) {
        super(fileName);
        this.filePath = filePath;
    }

    // getter / setter for filePath
}

export default class ImagePlaylistItem extends FilePlaylistItem  {
    constructor(fileName, filePath, id) {
        super(fileName, filePath);
        this.id = id;
    }
}


