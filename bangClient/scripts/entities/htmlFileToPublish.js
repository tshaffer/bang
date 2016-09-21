export default class HtmlFileToPublish   {
    constructor(filePath, groupName = "", forceContentTypeOther = false, isMainWebPage = false, siteName, fileName, relativeUrl) {
        this.filePath = filePath;
        this.groupName = groupName;
        this.forceContentTypeOther = forceContentTypeOther;
        this.isMainWebPage = isMainWebPage;
        this.siteName = siteName;
        this.fileName = fileName;
        this.relativeUrl = relativeUrl;
    }
}
