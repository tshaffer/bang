/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST, CLEAR_ZONE_PLAYLISTS, ADD_PLAYLIST_ITEM, ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST, ADD_MEDIA_STATE_TO_ZONE_PLAYLIST,
    DELETE_MEDIA_STATE,
    DELETE_PLAYLIST_ITEM, MOVE_PLAYLIST_ITEM_WITHIN_ZONE_PLAYLIST }
    from '../actions/index';
import { guid } from '../utilities/utils';

import Norm_ZonePlaylist from '../normalizedBADM/norm_zonePlaylist';

// var deepEqual = require('deep-equal');

const initialState =
{
    zonePlaylistsById: {},
    mediaStatesById: {}
};

export default function(state = initialState, action) {

    // console.log("reducer_zone_playlists:: action.type=" + action.type);

    let newState;
    let newZonePlaylist;
    let newZonePlaylistsById;

    let existingZonePlaylist;
    let newPlaylistItemIds;

    let zonePlaylistId;
    let playlistItemId;

    let mediaStateId;
    let newMediaStateIds;

    let index = -1;

    switch (action.type) {
        case CLEAR_ZONE_PLAYLISTS:
            return initialState;

        case NEW_ZONE_PLAYLIST:

            newZonePlaylist = new Norm_ZonePlaylist();

            const newItem = {};
            newItem[newZonePlaylist.id] = newZonePlaylist;
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById, newItem);

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            }
            return newState;

        case ADD_PLAYLIST_ITEM:

            zonePlaylistId = action.zonePlaylistId;
            playlistItemId = action.playlistItemId;

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
            newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);
            newPlaylistItemIds.push(playlistItemId);

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.playlistItemIds = newPlaylistItemIds;

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;

        case DELETE_PLAYLIST_ITEM:

            zonePlaylistId = action.zonePlaylistId;
            playlistItemId = action.playlistItemId;

            // is all this necessary?
            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            newZonePlaylistsById = Object.assign(initialState, state.zonePlaylistsById);
            newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);

            index = newPlaylistItemIds.indexOf(playlistItemId);
            if (index > -1) {
                newPlaylistItemIds.splice(index, 1);
            }

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.playlistItemIds = newPlaylistItemIds;

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;

        case ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST:
            
            zonePlaylistId = action.zonePlaylistId;
            playlistItemId = action.playlistItemId;
            index = action.index;

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
            newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);

            // add playlist item in proper position
            if (index >= 0) {
                // insert prior to index
                newPlaylistItemIds.splice(index, 0, playlistItemId);
            }
            else {
                // append to list
                newPlaylistItemIds.push(playlistItemId);
            }

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.playlistItemIds = newPlaylistItemIds;

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;

        case MOVE_PLAYLIST_ITEM_WITHIN_ZONE_PLAYLIST:

            zonePlaylistId = action.zonePlaylistId;
            let sourceIndex = action.sourceIndex;
            let destinationIndex = action.destinationIndex;

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
            newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);

            if (sourceIndex < 0) {
                sourceIndex = newPlaylistItemIds.length;
            }
            if (destinationIndex < 0) {
                destinationIndex = newPlaylistItemIds.length;
            }
            if (destinationIndex > sourceIndex) {
                destinationIndex--;
            }

            // http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
            if (destinationIndex >= newPlaylistItemIds.length) {
                var k = destinationIndex - newPlaylistItemIds.length;
                while ((k--) + 1) {
                    newPlaylistItemIds.push(undefined);
                }
            }
            newPlaylistItemIds.splice(destinationIndex, 0, newPlaylistItemIds.splice(sourceIndex, 1)[0]);

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.playlistItemIds = newPlaylistItemIds;

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;

        case ADD_MEDIA_STATE_TO_ZONE_PLAYLIST:

            zonePlaylistId = action.zonePlaylistId;
            mediaStateId = action.mediaStateId;
            index = action.index;

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
            newMediaStateIds = Object.assign([], existingZonePlaylist.mediaStateIds);

            // add playlist item in proper position
            if (typeof(index) !== "undefined" && index >= 0) {
                // insert prior to index
                newMediaStateIds.splice(index, 0, mediaStateId);
            }
            else {
                // append to list
                newMediaStateIds.push(mediaStateId);
            }

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.mediaStateIds = newMediaStateIds;

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;

        case DELETE_MEDIA_STATE:

            zonePlaylistId = action.zonePlaylistId;
            mediaStateId = action.mediaStateId;

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);
            newMediaStateIds = Object.assign([], existingZonePlaylist.mediaStateIds);

            newMediaStateIds = newMediaStateIds.filter(function(ele) { return ele != mediaStateId; });

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.mediaStateIds = newMediaStateIds;

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;
    }

    return state;
};
