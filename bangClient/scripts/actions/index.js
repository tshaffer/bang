/**
 * Created by tedshaffer on 6/3/16.
 */
export const SET_MEDIA_LIBRARY_CONTENTS = 'SET_MEDIA_LIBRARY_CONTENTS';

export function setMediaLibraryContents(mediaLibraryContents) {
    console.log("setMediaLibraryContents invoked");
    return {
        type: 'SET_MEDIA_LIBRARY_CONTENTS',
        payload: mediaLibraryContents
    };
}

