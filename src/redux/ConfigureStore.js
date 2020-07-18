import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { DataVuzix } from './DataVuzix';
import { MapFilter } from './MapFilter';
import { DetailDivData } from './DetailDivData';
import { AddressValue } from './AddressValue';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            dataVuzix: DataVuzix,
            mapFilter: MapFilter,
            detailDivData: DetailDivData,
            addresses: AddressValue,
        }),
        applyMiddleware(thunk, logger)

    );
    return store;
}
