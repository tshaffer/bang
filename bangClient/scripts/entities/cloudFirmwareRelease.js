/**
 * Created by tedshaffer on 9/27/16.
 */
export default class CloudFirmwareRelease   {
    constructor(url, version, versionNumber, sha1, length) {
        this.url = url;
        this.version = version;
        this.versionNumber = versionNumber;
        this.sha1 = sha1;
        this.length = length;
    }
}
