import CloudFirmwareRelease from '../entities/cloudFirmwareRelease';
import FamilyCloudFirmwareRelease from '../entities/familyCloudFirmwareRelease';
import { getXMLFile } from '../utilities/utils';

export const SET_FIRMWARE_SPECS = 'SET_FIRMWARE_SPECS';

let _firmwareByFamily = null;

export function initializeCloudFirmwareSpecs() {

    const fwURL = "http://bsnm.s3.amazonaws.com/public/FirmwareCompatibilityFile.xml";

    return function (dispatch, getState) {

        let loadFWPromise = loadFWManifest(fwURL);
        loadFWPromise.then( (firmwareByFamily) => {

            _firmwareByFamily = firmwareByFamily;

            dispatch(setFirmwareSpecs(_firmwareByFamily));

            let state = getState();
            console.log(state);
        });
    };
}

function getValueFromMangledSpec(obj, key) {
    return obj[key][0];
}


function setFirmwareSpecs(firmwareSpecsByFamily) {
    return {
        type: SET_FIRMWARE_SPECS,
        firmwareSpecsByFamily
    };
}

function loadFWManifest(fwURL) {

    return new Promise ( (resolve, reject) => {
        getXMLFile(fwURL).then( (fwReleases) => {

            // parse data structure returned (and mangled) then store in redux
            let firmwareByFamily = {};

            fwReleases.BrightSignFirmware.FirmwareFile.forEach( firmwareFileSpec => {

                const type = getValueFromMangledSpec(firmwareFileSpec, "type");

                const family = getValueFromMangledSpec(firmwareFileSpec, "family");
                const fileLength = Number(getValueFromMangledSpec(firmwareFileSpec, "fileLength"));
                const link = getValueFromMangledSpec(firmwareFileSpec, "link");
                const sha1 = getValueFromMangledSpec(firmwareFileSpec, "sha1");
                const version = getValueFromMangledSpec(firmwareFileSpec, "version");
                const versionNumber = getValueFromMangledSpec(firmwareFileSpec, "versionNumber");

                const cloudFirmwareRelease = new CloudFirmwareRelease(link, version, versionNumber, sha1, fileLength);

                if (!firmwareByFamily[family]) {
                    firmwareByFamily[family] = new FamilyCloudFirmwareRelease();
                }
                firmwareByFamily[family][type] = cloudFirmwareRelease;
            });

            resolve(firmwareByFamily);
        }, (reason) => {
            reject(reason);
        });
    });
}


