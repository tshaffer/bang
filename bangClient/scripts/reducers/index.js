/**
 * Created by tedshaffer on 6/3/16.
 */
import {combineReducers} from 'redux';
import ThumbsReducer from './reducer_thumbs';

const rootReducer = combineReducers({
    thumbs: ThumbsReducer
});

export default rootReducer;
