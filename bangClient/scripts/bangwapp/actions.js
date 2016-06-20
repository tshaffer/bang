/**
 * Created by tedshaffer on 6/12/16.
 */
import axios from 'axios';

import { openSign, setCurrentPlaylist } from '../actions/index';
import { setMediaThumbs, setMediaFolder, setMediaLibraryFiles } from '../actions/index';

const bangServerUrl = "http://localhost:6969/";


export function executeLoadAppData() {

    return function(dispatch) {

        // startup data required for the app
        //      all media thumbs in the database, indexed by media file path
        //      last used media directory
        //      files in the last used media directory

        let getMediaThumbsPromise = getMediaThumbs();
        let getMediaLibraryFolderPromise = getMediaLibraryFolder();

        Promise.all([getMediaThumbsPromise, getMediaLibraryFolderPromise]).then(function(values) {

            const mediaThumbs = values[0];
            const mediaFolder = values[1];

            dispatch(setMediaThumbs(mediaThumbs));
            dispatch(setMediaFolder(mediaFolder));

            // get the files in the last used media folder
            getMediaFiles(mediaFolder).then(function(mediaLibraryFiles) {
                dispatch(setMediaLibraryFiles(mediaLibraryFiles));
            });
        });

    }
}


function getMediaThumbs() {

    return new Promise(function(resolve, reject) {

        const getAllThumbsUrl = bangServerUrl + "getAllThumbs";
        axios.get(getAllThumbsUrl, {}).then(function(data) {
            const thumbsByPath = data.data;
            resolve(thumbsByPath);
        })
    });
}


export function getMediaLibraryFolder() {

    return new Promise(function(resolve, reject) {

        const getMediaFolderUrl = bangServerUrl + "getMediaFolder";
        axios.get(getMediaFolderUrl, {}).then(function(data) {
            const mediaFolder = data.data.mediaFolder;
            resolve(mediaFolder);
        });
    });
};


function getMediaFiles(mediaFolder) {

    return new Promise(function(resolve, reject) {

        const getThumbsUrl = bangServerUrl + "getThumbs";
        axios.get(getThumbsUrl, { params: { mediaFolder: mediaFolder }}).then(function(data) {
            let mediaLibraryFiles = data.data.thumbs;

            // TODO - ??
            mediaLibraryFiles.forEach(function(mediaLibraryFile) {
                mediaLibraryFile.filePath = mediaLibraryFile.mediaFilePath;
            })
            resolve(mediaLibraryFiles);
        });
    });
}


export function getThumb(filePath) {

    return null;

    // app.use(express.static(path.join(__dirname, 'thumbs')));
    // was mediaItem.thumbFileName - I THINK THIS IS IT - may want to rename it to thumbUrl

    //      thumbFileName           backend_menu_Notes_thumb.jpg
    //      thumbUrl                /thumbs/backend_menu_Notes_thumb.jpg

    // http://localhost:6969/thumbs/BryceCanyonUtah_thumb.jpg

    // OR

    // http://localhost:6969/BryceCanyonUtah_thumb.jpg
    
    // var data = fs.readFileSync(filePath).toString("base64");
    // var base64Format = util.format("data:%s;base64,%s", mime.lookup(filePath), data);
    // console.log("length of base64 string is: ", base64Format.length);
    // return base64Format;
}











export function executeFetchSign(presentationName) {

    return function(dispatch) {

        const getBSNPresentationUrl = "http://localhost:6969/getBSNPresentation";

        return axios.get(getBSNPresentationUrl, {
            params: { name: presentationName }
        }).then(function(data) {
            console.log("fetchSign - return from server call");

            const signAsJson = data.data.bsnPresentation;
            const sign = JSON.parse(signAsJson);
            dispatch(openSign(sign));
            dispatch(setCurrentPlaylist(sign.zones[0].zonePlaylist));
        })
    }
}

