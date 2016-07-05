/**
 * Created by tedshaffer on 6/26/16.
 */
import { CLEAR_PLAYLIST_ITEMS, NEW_PLAYLIST_ITEM, UPDATE_PLAYLIST_ITEM } from '../actions/index';

const initialState =
    {
        playlistItemsById: {}
    };

export default function(state = initialState, action) {

    // console.log("reducer_playlist_items:: action.type=" + action.type);

    let newState;
    let playlistItem;

    let newPlaylistItemsById;


    switch (action.type) {
        case CLEAR_PLAYLIST_ITEMS:
            return initialState;
        
        case NEW_PLAYLIST_ITEM:
            playlistItem = action.payload;
            newPlaylistItemsById = Object.assign({}, state.playlistItemsById);
            newPlaylistItemsById[playlistItem.id] = playlistItem;

            newState = {
                playlistItemsById: newPlaylistItemsById
            }
            return newState;
        
        case UPDATE_PLAYLIST_ITEM:

            const playlistItemId = action.playlistItemId;
            playlistItem = action.playlistItem;

            newPlaylistItemsById = Object.assign({}, state.playlistItemsById);
            newPlaylistItemsById[playlistItemId] = playlistItem;

            newState = {
                playlistItemsById: newPlaylistItemsById
            }
            return newState;
    }

    return state;
};
