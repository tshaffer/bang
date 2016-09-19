// public class FileSpec
// {
//     public string FileName { get; set; }
//     public FileToPublish FileToPublish { get; set; }
//     public string HashValue { get; set; }
//     public long FileSize { get; set; }
// }

export default class FileSpec   {
    constructor(fileName, fileToPublish, hashValue, fileSize) {
        this.fileName = fileName;
        this.fileToPublish = fileToPublish;
        this.hashValue = hashValue;
        this.fileSize = fileSize;
    }
}
