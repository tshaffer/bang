/**
 * Created by tedshaffer on 6/26/16.
 */
import { NEW_PLAYLIST_ITEM, UPDATE_PLAYLIST_ITEM } from '../actions/index';

const initialState =
{
    playlistItemsById: {}
};

export default function(state = initialState, action) {

    console.log("reducer_playlist_items:: action.type=" + action.type);

    let newState;
    let playlistItem;

    let newPlaylistItemsById;

    switch (action.type) {
        case NEW_PLAYLIST_ITEM:
            playlistItem = action.payload;
            
            const newPlaylistItem =
            {
                id: playlistItem.id,
                fileName: playlistItem.fileName,
                filePath: playlistItem.filePath,
                timeOnScreen: playlistItem.timeOnScreen,
                transition: playlistItem.transition,
                transitionDuration: playlistItem.transitionDuration
            }

            newPlaylistItemsById = Object.assign({}, state.playlistItemsById);
            newPlaylistItemsById[newPlaylistItem.id] = newPlaylistItem;

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
