export default class LocalHTMLSite   {
    constructor(name, filePath, queryString = "") {
        this.name = name;
        this.filePath = filePath;
        this.queryString = queryString;
    }
}
