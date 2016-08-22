/**
 * Created by tedshaffer on 8/21/16.
 */
import { createSelector } from 'reselect';

const getMediaStates = (state) => state.mediaStates
const getTransitions = (state) => state.transitions

export const getReselectLabel = createSelector(
    [getMediaStates, getTransitions],
    (mediaStates, transitions) => {
        console.log("getReselectLabel invoked");
        let reselectLabel = "";
        if (mediaStates) {
            var numMediaStates = Object.keys(mediaStates.mediaStatesById).length;
            reselectLabel += "mediaStates length=" + numMediaStates.toString();
        }
        else {
            reselectLabel += "no mediaStates";
        }
        reselectLabel += " ";
        if (transitions) {
            var numTransitions = Object.keys(transitions.transitionsById).length;
            reselectLabel += "transitions length=" + numTransitions.toString();
        }
        else {
            reselectLabel += "no transitions";
        }

        return reselectLabel;
    }
)


