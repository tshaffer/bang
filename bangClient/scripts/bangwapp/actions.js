/**
 * Created by tedshaffer on 6/12/16.
 */
import axios from 'axios';

import { openSign, setCurrentPlaylist } from '../actions/index';

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

