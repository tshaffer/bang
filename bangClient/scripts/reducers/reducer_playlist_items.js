/**
 * Created by tedshaffer on 6/26/16.
 */
import { NEW_PLAYLIST_ITEM, UPDATE_PLAYLIST_ITEM } from '../actions/index';

const initialState =
{
    playlistItems: [],
    playlistItemsById: {}
};

export default function(state = initialState, action) {

    console.log("reducer_playlist_items:: action.type=" + action.type);

    let newState;
    let playlistItem;

    let newPlaylistItems;
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

            const newItem = {};
            newItem[newPlaylistItem.id] = newPlaylistItem;
            newPlaylistItemsById = Object.assign({}, state.playlistItemsById, newItem);

            newState = {
                playlistItems: state.playlistItems.concat(newPlaylistItem),
                playlistItemsById: newPlaylistItemsById
            }
            return newState;
        
        case UPDATE_PLAYLIST_ITEM:

            const playlistItemId = action.playlistItemId;
            playlistItem = action.playlistItem;

            newPlaylistItems = Object.assign([], state.playlistItems);
            newPlaylistItemsById = Object.assign({}, state.playlistItemsById);

            newPlaylistItems.forEach(function(newPlaylistItem, index) {
                if (newPlaylistItem.id === playlistItemId) {
                    newPlaylistItems[index] = playlistItem;
                }
            })
            newPlaylistItemsById[playlistItemId] = playlistItem;

            newState = {
                playlistItems: newPlaylistItems,
                playlistItemsById: newPlaylistItemsById
            }
            return newState;
    }

    return state;
};
