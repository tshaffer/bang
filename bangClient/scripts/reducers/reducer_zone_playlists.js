/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST, CLEAR_ZONE_PLAYLISTS,
    // ADD_MEDIA_STATE_TO_ZONE_PLAYLIST,
    DELETE_MEDIA_STATE, UPDATE_MEDIA_STATES_BY_ID,
    UPDATE_MEDIA_STATE, SET_INITIAL_MEDIA_STATE}
    from '../actions/index';
import { guid } from '../utilities/utils';

import Norm_ZonePlaylist from '../normalizedBADM/norm_zonePlaylist';

// var deepEqual = require('deep-equal');

const initialState =
    {
        zonePlaylistsById: {},
    };

export default function(state = initialState, action) {

    // console.log("reducer_zone_playlists:: action.type=" + action.type);

    let newState;
    let newZonePlaylist;
    let newZonePlaylistsById;

    let existingZonePlaylist;

    let zonePlaylistId;

    let newMediaStatesById;
    let mediaStateId = null;
    let mediaState = null;

    let index = -1;

    switch (action.type) {
        case CLEAR_ZONE_PLAYLISTS:
            return initialState;

        case NEW_ZONE_PLAYLIST:
            {
                newZonePlaylist = new Norm_ZonePlaylist();

                const newItem = {};
                newItem[newZonePlaylist.id] = newZonePlaylist;
                newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById, newItem);

                newState = {
                    zonePlaylistsById: newZonePlaylistsById
                };
                return newState;
            }

        // case ADD_MEDIA_STATE_TO_ZONE_PLAYLIST:
        //
        //     debugger;
        //
        //     zonePlaylistId = action.zonePlaylistId;
        //     mediaState = action.mediaState;
        //     mediaStateId = mediaState.getId();
        //
        //     existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
        //
        //     // make copy of existing fields
        //     newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
        //     newMediaStatesById = Object.assign({}, existingZonePlaylist.mediaStatesById);
        //
        //     newMediaStatesById[mediaStateId] = mediaState;
        //
        //     newZonePlaylist = Object.assign({}, existingZonePlaylist);
        //     newZonePlaylist.mediaStatesById = newMediaStatesById;
        //
        //     newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;
        //
        //     newState = {
        //         zonePlaylistsById: newZonePlaylistsById
        //     };
        //
        //     return newState;
        //
        case UPDATE_MEDIA_STATES_BY_ID:
            {
                debugger;

                zonePlaylistId = action.zonePlaylistId;
                const mediaStatesById = action.mediaStatesById;

                existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

                // make copy of existing fields
                newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
                newMediaStatesById = Object.assign({}, mediaStatesById);

                newZonePlaylist = Object.assign({}, existingZonePlaylist);
                newZonePlaylist.mediaStatesById = newMediaStatesById;

                newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

                newState = {
                    zonePlaylistsById: newZonePlaylistsById
                };

                return newState;
            }


        case UPDATE_MEDIA_STATE:

            debugger;

            zonePlaylistId = action.zonePlaylistId;
            mediaState = action.mediaState;
            mediaStateId = mediaState.getId();

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
            newMediaStatesById = Object.assign({}, existingZonePlaylist.mediaStatesById);

            newMediaStatesById[mediaStateId] = mediaState;

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.mediaStatesById = newMediaStatesById;

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;

        case SET_INITIAL_MEDIA_STATE:

            zonePlaylistId = action.zonePlaylistId;
            mediaStateId = action.mediaStateId;

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.initialMediaStateId = mediaStateId;

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;
    }

    return state;
}
