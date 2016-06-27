/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST, ADD_PLAYLIST_ITEM, ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST } from '../actions/index';
import { guid } from '../utilities/utils';

// var deepEqual = require('deep-equal');

const initialState =
{
    zonePlaylistsById: {}
};

export default function(state = initialState, action) {

    console.log("reducer_zone_playlists:: action.type=" + action.type);

    let newState;
    let newZonePlaylist;
    let newZonePlaylistsById;
    let playlistItem;

    let newZonePlaylists;
    let existingZonePlaylist;
    let newPlaylistItems;
    let newPlaylistItemIds;

    let zonePlaylistId;
    let playlistItemId;

    switch (action.type) {
        case NEW_ZONE_PLAYLIST:
            // const zonePlaylist = action.payload;

            const id = guid();
            
            newZonePlaylist =
            {
                id: id,
                playlistItemIds: []
            };

            // ES6
            const newItem = {};
            newItem[id] = newZonePlaylist;
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById, newItem);

            newState = {
                zonePlaylistsById: newZonePlaylistsById
            }
            return newState;

        case ADD_PLAYLIST_ITEM:

            zonePlaylistId = action.zonePlaylistId;
            playlistItemId = action.playlistItemId;

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
            newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);
            newPlaylistItemIds.push(playlistItemId);

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
            const index = action.index;

            // make copy of existing fields
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
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
    }

    return state;
};
