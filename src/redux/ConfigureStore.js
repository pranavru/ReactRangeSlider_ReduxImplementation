import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { DataVuzix } from './DataVuzix';
import { MapFilter } from './MapFilter';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dataVuzix: DataVuzix,
            mapFilter: MapFilter
        }),
        applyMiddleware(thunk, logger)

    );
    return store;
}
