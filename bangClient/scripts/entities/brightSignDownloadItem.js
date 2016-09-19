export default class BrightSignDownloadItem   {
    constructor(fileName, filePath, fileSize, hashValue, groupName) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.hashValue = hashValue;
        this.groupName = groupName;
    }
}
