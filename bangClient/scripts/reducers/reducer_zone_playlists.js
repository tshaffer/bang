/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST, CLEAR_ZONE_PLAYLISTS,  ADD_MEDIA_STATE_TO_ZONE_PLAYLIST,
    DELETE_MEDIA_STATE,
    SET_INITIAL_MEDIA_STATE}
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


        // case ADD_PLAYLIST_ITEM:
        //
        //     zonePlaylistId = action.zonePlaylistId;
        //     playlistItemId = action.playlistItemId;
        //
        //     existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
        //
        //     // make copy of existing fields
        //     newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
        //     newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);
        //     newPlaylistItemIds.push(playlistItemId);
        //
        //     newZonePlaylist = Object.assign({}, existingZonePlaylist);
        //     newZonePlaylist.playlistItemIds = newPlaylistItemIds;
        //
        //     newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;
        //
        //     newState = {
        //         zonePlaylistsById: newZonePlaylistsById,
        //         mediaStatesById
        //     };
        //
        //     return newState;

        // case DELETE_PLAYLIST_ITEM:
        //
        //     zonePlaylistId = action.zonePlaylistId;
        //     playlistItemId = action.playlistItemId;
        //
        //     // is all this necessary?
        //     existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
        //
        //     newZonePlaylistsById = Object.assign(initialState, state.zonePlaylistsById);
        //     newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);
        //
        //     index = newPlaylistItemIds.indexOf(playlistItemId);
        //     if (index > -1) {
        //         newPlaylistItemIds.splice(index, 1);
        //     }
        //
        //     newZonePlaylist = Object.assign({}, existingZonePlaylist);
        //     newZonePlaylist.playlistItemIds = newPlaylistItemIds;
        //
        //     newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;
        //
        //     newState = {
        //         zonePlaylistsById: newZonePlaylistsById,
        //         mediaStatesById
        //     };
        //
        //     return newState;

        // case ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST:
        //
        //     zonePlaylistId = action.zonePlaylistId;
        //     playlistItemId = action.playlistItemId;
        //     index = action.index;
        //
        //     existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
        //
        //     // make copy of existing fields
        //     newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
        //     newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);
        //
        //     // add playlist item in proper position
        //     if (index >= 0) {
        //         // insert prior to index
        //         newPlaylistItemIds.splice(index, 0, playlistItemId);
        //     }
        //     else {
        //         // append to list
        //         newPlaylistItemIds.push(playlistItemId);
        //     }
        //
        //     newZonePlaylist = Object.assign({}, existingZonePlaylist);
        //     newZonePlaylist.playlistItemIds = newPlaylistItemIds;
        //
        //     newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;
        //
        //     newState = {
        //         zonePlaylistsById: newZonePlaylistsById,
        //         mediaStatesById
        //     };
        //
        //     return newState;
        //
        // case MOVE_PLAYLIST_ITEM_WITHIN_ZONE_PLAYLIST:
        //     {
        //         zonePlaylistId = action.zonePlaylistId;
        //         let sourceIndex = action.sourceIndex;
        //         let destinationIndex = action.destinationIndex;
        //
        //         existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
        //
        //         // make copy of existing fields
        //         newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
        //         newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);
        //
        //         if (sourceIndex < 0) {
        //             sourceIndex = newPlaylistItemIds.length;
        //         }
        //         if (destinationIndex < 0) {
        //             destinationIndex = newPlaylistItemIds.length;
        //         }
        //         if (destinationIndex > sourceIndex) {
        //             destinationIndex--;
        //         }
        //
        //         // http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
        //         if (destinationIndex >= newPlaylistItemIds.length) {
        //             var k = destinationIndex - newPlaylistItemIds.length;
        //             while ((k--) + 1) {
        //                 newPlaylistItemIds.push(undefined);
        //             }
        //         }
        //         newPlaylistItemIds.splice(destinationIndex, 0, newPlaylistItemIds.splice(sourceIndex, 1)[0]);
        //
        //         newZonePlaylist = Object.assign({}, existingZonePlaylist);
        //         newZonePlaylist.playlistItemIds = newPlaylistItemIds;
        //
        //         newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;
        //
        //         newState = {
        //             zonePlaylistsById: newZonePlaylistsById
        //         };
        //
        //         return newState;
        //     }

        case ADD_MEDIA_STATE_TO_ZONE_PLAYLIST:

            zonePlaylistId = action.zonePlaylistId;
            mediaState = action.mediaState;
            mediaStateId = mediaState.getId();

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
            newMediaStatesById = Object.assign([], existingZonePlaylist.mediaStatesById);

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

        // update based on change from mediaStates to mediaStatesById
        // case DELETE_MEDIA_STATE:
        //
        //     zonePlaylistId = action.zonePlaylistId;
        //     mediaStateId = action.mediaStateId;
        //
        //     existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
        //
        //     // make copy of existing fields
        //     newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
        //     newMediaStateIds = Object.assign([], existingZonePlaylist.mediaStateIds);
        //
        //     newMediaStateIds = newMediaStateIds.filter(function(ele) { return ele != mediaStateId; });
        //
        //     newZonePlaylist = Object.assign({}, existingZonePlaylist);
        //     newZonePlaylist.mediaStateIds = newMediaStateIds;
        //
        //     newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;
        //
        //     newState = {
        //         zonePlaylistsById: newZonePlaylistsById
        //     };
        //
        //     return newState;
    }

    return state;
}
