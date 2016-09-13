import { NEW_ZONE_PLAYLIST, CLEAR_ZONE_PLAYLISTS,
    UPDATE_MEDIA_STATE, SET_INITIAL_MEDIA_STATE}
    from '../actions/index';

import Norm_ZonePlaylist from '../normalizedBADM/norm_zonePlaylist';

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
