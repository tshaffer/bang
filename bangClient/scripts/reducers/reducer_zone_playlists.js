/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST, ADD_PLAYLIST_ITEM, ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST } from '../actions/index';

// var deepEqual = require('deep-equal');

const initialState =
{
    zonePlaylists: [],
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
            const zonePlaylist = action.payload;

            newZonePlaylist =
            {
                id: zonePlaylist.id,
                playlistItemIds: []
            };

            // ES6
            const newItem = {};
            newItem[zonePlaylist.id] = newZonePlaylist;
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById, newItem);

            newState = {
                zonePlaylists: state.zonePlaylists.concat(newZonePlaylist),
                zonePlaylistsById: newZonePlaylistsById
            }
            return newState;

        case ADD_PLAYLIST_ITEM:

            zonePlaylistId = action.zonePlaylistId;
            playlistItemId = action.playlistItemId;

            // make copy of existing fields
            newZonePlaylists = Object.assign([], state.zonePlaylists);
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
            newPlaylistItemIds = Object.assign([], existingZonePlaylist.playlistItemIds);
            newPlaylistItemIds.push(playlistItemId);

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.playlistItemIds = newPlaylistItemIds;

            // find and replace this zonePlaylist in both zonePlaylists and zonePlaylistsById
            newZonePlaylists.forEach(function(zonePlaylist, index) {
                if (zonePlaylist.id == zonePlaylistId) {
                    newZonePlaylists[index] = newZonePlaylist;
                }
            });
            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylists: newZonePlaylists,
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;

        case ADD_PLAYLIST_ITEM_TO_ZONE_PLAYLIST:
            zonePlaylistId = action.zonePlaylistId;
            playlistItemId = action.playlistItemId;
            const index = action.index;

            // make copy of existing fields
            newZonePlaylists = Object.assign([], state.zonePlaylists);
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

            // find and replace this zonePlaylist in both zonePlaylists and zonePlaylistsById
            newZonePlaylists.forEach(function(zonePlaylist, index) {
                if (zonePlaylist.id == zonePlaylistId) {
                    newZonePlaylists[index] = newZonePlaylist;
                }
            });
            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylists: newZonePlaylists,
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;
    }

    return state;
};
