import * as ActionTypes from './ActionTypes';

export const DetailDivData = (state = {
    isLoading: true,
    errMess: null,
    detailDivData: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_DETAILDIVDATA:
            return { ...state, isLoading: false, errMess: null, detailDivData: action.payload };

        case ActionTypes.DETAILDIVDATA_LOADING:
            return { ...state, isLoading: true, errMess: null, detailDivData: [] };

        case ActionTypes.DETAILDIVDATA_FAILED:
            return { ...state, isLoading: false, errMess: action.payload };

        default:
            return state;
    }
};