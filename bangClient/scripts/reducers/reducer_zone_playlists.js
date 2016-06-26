/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST, ADD_PLAYLIST_ITEM, ADD_PLAYLIST_ITEM0, UPDATE_SELECTED_PLAYLIST_ITEM } from '../actions/index';

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

        case ADD_PLAYLIST_ITEM0:
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

        case UPDATE_SELECTED_PLAYLIST_ITEM:

            const savedState = Object.assign({}, state);
            console.log("UPDATE_SELECTED_PLAYLIST_ITEM");
            console.log(action.playlistItem);

            const zone = action.zone;
            playlistItem = action.playlistItem;

            zonePlaylistId = zone.zonePlaylistId;
            
            // create method for some of this code to share with other action types?

            // make copy of existing fields
            newZonePlaylists = Object.assign([], state.zonePlaylists);
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);


            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
            newPlaylistItems = Object.assign([], existingZonePlaylist.playlistItems);

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.playlistItems = newPlaylistItems;

            // find and replace the playlistItem
            newZonePlaylist.playlistItems.forEach(function(existingPlaylistItem, index) {
                if (playlistItem.id == existingPlaylistItem.id) {
                    newZonePlaylist.playlistItems[index] = playlistItem;
                }
            });

            // find and replace the zonePlaylist
            newZonePlaylists.forEach(function(existingZonePlaylist, index) {
                if (existingZonePlaylist.id == zonePlaylistId) {
                    newZonePlaylists[index] = newZonePlaylist;
                }
            })

            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylists: newZonePlaylists,
                zonePlaylistsById: newZonePlaylistsById
            };

            var equal = require('deep-equal');
            console.log("equal");
            console.dir([
                equal(
                    savedState,
                    state
                )
            ]);
            return newState;
    }

    return state;
};
