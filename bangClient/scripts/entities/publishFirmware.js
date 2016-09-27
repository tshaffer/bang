/**
 * Created by tedshaffer on 9/26/16.
 */

// "http://bsnm.s3.amazonaws.com/public/FirmwareCompatibilityFile.xml"

export default class PublishFirmware   {

    constructor() {
        this.firmwareUpdateSource = null;
        this.firmwareUpdateSourceFilePath = null;
        this.firmwareUpdateStandardTargetFileName = null;
        this.firmwareUpdateDifferentTargetFileName = null;
        this.firmwareUpdateNewerTargetFileName = null;
        this.firmwareUpdateSaveTargetFileName = null;
        this.firmwareUpdateVersion = null;
        this.productionReleaseURL = null;
        this.betaReleaseURL = null;
        this.compatibleReleaseURL = null;
        this.productionVersion = null;
        this.betaVersion = null;
        this.compatibleVersion = null;
        this.productionReleaseSHA1 = null;
        this.betaReleaseSHA1 = null;
        this.compatibleReleaseSHA1 = null;
        this.productionReleaseFileLength = null;
        this.betaReleaseFileLength = null;
        this.compatibleReleaseFileLength = null;
        this.existingFWContentID = null;

        this.firmwareUpdateTypeEnum = {
            Standard : "Standard",
            Different : "Different",
            Newer : "Newer",
            Save: "Save"
        };

    }


    initializeUpdateSource(networkedFW)
    {
        if (networkedFW)
        {
            this.firmwareUpdateSource = "existing";
        }
    }

    getFirmwareUpdateTargetFileName(firmwareUpdateType)
    {
        switch (firmwareUpdateType)
        {
            case this.firmwareUpdateTypeEnum.Different:
                return this.firmwareUpdateDifferentTargetFileName;
            case this.firmwareUpdateTypeEnum.Newer:
                return this.firmwareUpdateNewerTargetFileName;
            case this.firmwareUpdateTypeEnum.Save:
                return this.firmwareUpdateSaveTargetFileName;
            default:
                return this.firmwareUpdateStandardTargetFileName;
        }
    }

}
