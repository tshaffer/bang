/**
 * Created by tedshaffer on 6/26/16.
 */
import { NEW_PLAYLIST_ITEM } from '../actions/index';

const initialState =
{
    playlistItems: [],
    playlistItemsById: {}
};

export default function(state = initialState, action) {

    console.log("reducer_playlist_items:: action.type=" + action.type);

    let newState;

    switch (action.type) {
        case NEW_PLAYLIST_ITEM:
            const playlistItem = action.payload;
            
            const newPlaylistItem =
            {
                id: playlistItem.id,
                fileName: playlistItem.fileName,
                filePath: playlistItem.filePath,
                timeOnScreen: playlistItem.timeOnScreen,
                transition: playlistItem.transition,
                transitionDuration: playlistItem.transitionDuration
            }

            const newItem = {};
            newItem[newPlaylistItem.id] = newPlaylistItem;
            const newPlaylistItemsById = Object.assign({}, state.playlistItemsById, newItem);

            newState = {
                playlistItems: state.playlistItems.concat(newPlaylistItem),
                playlistItemsById: newPlaylistItemsById
            }
            return newState;
    }

    return state;
};
