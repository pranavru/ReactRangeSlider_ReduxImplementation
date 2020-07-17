import * as ActionTypes from './ActionTypes';
// import { baseUrl } from "../shared/baseUrl";

const baseUrl = "http://18.191.247.248";
export const dataVuzixLoading = () => ({ type: ActionTypes.DATAVUZIX_LOADING });
export const mapFilterLoading = () => ({ type: ActionTypes.MAPFILTER_LOADING });

export const dataVuzixFailed = (errmess) => ({ type: ActionTypes.DATAVUZIX_FALIED, payload: errmess })
export const mapFilterFailed = (errmess) => ({ type: ActionTypes.MAPFILTER_FAILED, payload: errmess })

export const loadDataVuzix = (data) => ({ type: ActionTypes.ADD_DATAVUZIX, payload: data });
export const loadMapFilter = (data) => ({ type: ActionTypes.ADD_INIT_MAPFILTER, payload: data });

export const loadEditedFilter = (data) => ({ type: ActionTypes.EDIT_MAPFILTER, payload: data });

export const fetchDataVuzix = (dispatch) => {
    dispatch(dataVuzixLoading(true));

    return fetch(baseUrl + '/info')
        .then(response => {
            if (response.ok) {
                return response;
            } else {
                var error = new Error('Error ' + response.status + ': ' + response.statusText);
                error.response = response;
                throw error;
            }
        }, error => {
            throw error;
        })
        .then(response => response.json())
        .then(response => dispatch(loadDataVuzix(response)))
        .catch(error => dispatch(dataVuzixFailed(error.message)));
}

export const fetchMapFilter = (data) => (dispatch) => {
    dispatch(mapFilterLoading(true));
    const { range, dateMap, personObject } = initRangeSlider(data);
    dispatch(loadMapFilter({
        isSpeech: false,
        personNames: personObject,
        dateValues: [],
        mapDateRange: {
            updated: range,
            values: range,
            domain: range,
            data: dateMap
        }
    }))
}

export const editMapFilter = (type, newValue, filter) => (dispatch) => {
    let newFilter = filter;
    switch (type) {
        case "speech": {
            newFilter.isSpeech = newValue;
            dispatch(loadEditedFilter(newFilter));
            break;
        };
        case "personNames": {
            newFilter.personNames = newValue;
            dispatch(loadEditedFilter(newFilter));
            break;
        };
        case "dateValues": {
            newFilter.dateValues = newValue;
            dispatch(loadEditedFilter(newFilter));
            break;
        };
        case "mapDateRange": {
            const type = newValue.type;
            switch (type) {
                case "update": {
                    newFilter.mapDateRange.updated = newValue.value;
                    dispatch(loadEditedFilter(newFilter));
                    break;
                };
                case "onChange": {
                    newFilter.mapDateRange.values = newValue.value;
                    dispatch(loadEditedFilter(newFilter));
                    break;
                };
                case "domain": {
                    newFilter.mapDateRange.domain = newValue.value;
                    dispatch(loadEditedFilter(newFilter));
                    break;
                };
                case "barGraphData": {
                    newFilter.mapDateRange.data = newValue.value;
                    dispatch(loadEditedFilter(newFilter));
                    break;
                };
                default: {
                    dispatch(loadEditedFilter(newFilter));
                    break;
                };
            }
        }

        default: {
            dispatch(loadEditedFilter(newFilter));
        };
    };
}

const setDateValueinMilliSeconds = (dateValue) => {
    let dateVal = new Date(dateValue);
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    let [{ value: month }, , { value: day }, , { value: year }, , { value: hours }] = dateTimeFormat.formatToParts(dateVal);
    hours -= hours % 3 === 1 ? 1 : hours % 3 === 2 ? 2 : 0;
    return new Date(`${month} ${day}, ${year} ${hours}:00:00`).getTime();
}

const initRangeSlider = (data) => {
    let range = [
        +setDateValueinMilliSeconds(data.startDate, "startDate"),
        +setDateValueinMilliSeconds(data.endDate, "endDate")
    ], dateMap = [], persons = new Map([]), personObject = [];
    data.vuzixMap.map(m => {
        dateMap.push(setDateValueinMilliSeconds(m.created, "createdDate"))
        m.person_names.forEach(element => {
            if (!persons.has(element.person_name)) {
                persons.set(element.person_name)
            }
        });
    });
    Array.from(persons.keys()).forEach(element => personObject.push({ checked: false, name: element }))
    dateMap.sort();
    return { range, dateMap, personObject };
}