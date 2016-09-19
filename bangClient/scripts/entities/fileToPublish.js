export default class FileToPublish   {
    constructor(filePath, groupName = "", forceContentTypeOther = false) {
        this.filePath = filePath;
        this.groupName = groupName;
        this.forceContentTypeOther = forceContentTypeOther;
    }
}
