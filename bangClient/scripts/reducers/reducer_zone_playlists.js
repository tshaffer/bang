/**
 * Created by tedshaffer on 6/25/16.
 */
/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_ZONE_PLAYLIST, ADD_PLAYLIST_ITEM, UPDATE_SELECTED_PLAYLIST_ITEM } from '../actions/index';

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

    let zonePlaylistId;

    switch (action.type) {
        case NEW_ZONE_PLAYLIST:
            const zonePlaylist = action.payload;

            newZonePlaylist =
            {
                id: zonePlaylist.id,
                playlistItems: []
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
            playlistItem = action.playlistItem;
            const index = action.index;

            // make copy of existing fields
            newZonePlaylists = Object.assign([], state.zonePlaylists);
            newZonePlaylistsById = Object.assign({}, state.zonePlaylistsById);

            existingZonePlaylist = state.zonePlaylistsById[zonePlaylistId];
            newPlaylistItems = Object.assign([], existingZonePlaylist.playlistItems);

            // add playlist item in proper position
            if (index >= 0) {
                // insert prior to index
                newPlaylistItems.splice(index, 0, playlistItem);
            }
            else {
                // append to list
                newPlaylistItems.push(playlistItem);
            }

            newZonePlaylist = Object.assign({}, existingZonePlaylist);
            newZonePlaylist.playlistItems = newPlaylistItems;

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
            newZonePlaylistsById[zonePlaylistId] = newZonePlaylist;

            newState = {
                zonePlaylists: newZonePlaylists,
                zonePlaylistsById: newZonePlaylistsById
            };

            return newState;
    }

    return state;
};
