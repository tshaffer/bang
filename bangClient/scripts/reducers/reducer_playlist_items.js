/**
 * Created by tedshaffer on 6/26/16.
 */
import { NEW_PLAYLIST_ITEM, UPDATE_PLAYLIST_ITEM } from '../actions/index';
import ImagePlaylistItem from '../badm/imagePlaylistItem';

const emptyPlaylistItem = new ImagePlaylistItem();

const initialState = emptyPlaylistItem;

export default function(state = initialState, action) {

    console.log("reducer_playlist_items:: action.type=" + action.type);

    let newState;
    let playlistItem;

    let newPlaylistItemsById;


    switch (action.type) {
        case NEW_PLAYLIST_ITEM:
            playlistItem = action.payload;
            newState = Object.assign(state, playlistItem);
            return newState;

            // newPlaylistItemsById = Object.assign({}, state.playlistItemsById);
            // newPlaylistItemsById[playlistItem.id] = playlistItem;
            //
            // newState = {
            //     playlistItemsById: newPlaylistItemsById
            // }
            // return newState;
        
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
