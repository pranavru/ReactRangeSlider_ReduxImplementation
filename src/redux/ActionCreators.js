import * as ActionTypes from './ActionTypes';
// import { baseUrl } from "../shared/baseUrl";

const baseUrl = "http://18.191.247.248";
export const dataVuzixLoading = () => ({ type: ActionTypes.DATAVUZIX_LOADING });
export const mapFilterLoading = () => ({ type: ActionTypes.MAPFILTER_LOADING });
export const addressValueLoading = () => ({ type: ActionTypes.ADDRESSVALUE_LOADING });

export const dataVuzixFailed = (errmess) => ({ type: ActionTypes.DATAVUZIX_FALIED, payload: errmess })
export const mapFilterFailed = (errmess) => ({ type: ActionTypes.MAPFILTER_FAILED, payload: errmess })
export const addressValueFailed = (errmess) => ({ type: ActionTypes.ADDRESSVALUE_FAILED, PAYLOAD: errmess });

export const loadDataVuzix = (data) => ({ type: ActionTypes.ADD_DATAVUZIX, payload: data });
export const loadMapFilter = (data) => ({ type: ActionTypes.ADD_INIT_MAPFILTER, payload: data });
export const loadEditedFilter = (data) => ({ type: ActionTypes.EDIT_MAPFILTER, payload: data });
export const loadAddressValue = (data) => ({ type: ActionTypes.ADD_ADDRESSVALUE, payload: data });

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
};

export const fetchMapFilter = (data) => (dispatch) => {
    dispatch(mapFilterLoading(true));
    const { range, dateMap, personObject, addressValue } = initRangeSlider(data);
    dispatch(addressValueLoading(true));
    dispatch(loadAddressValue(addressValue));
    dispatch(
        loadMapFilter({
            isSpeech: false,
            startDate: data.startDate,
            endDate: data.endDate,
            personNames: personObject,
            dateValues: [],
            mapDateRange: {
                updated: range,
                values: range,
                domain: range,
                data: dateMap
            }
        })
    );
};

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

// The method converts the Date isoStringValue to time in milliseconds.
const setDateValueinMilliSeconds = (dateValue) => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-us', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
    let [{ value: month }, , { value: day }, , { value: year }, , { value: hours }] = dateTimeFormat.formatToParts(new Date(dateValue));
    return new Date(`${month} ${day}, ${year} ${hours -= hours % 3 === 1 ? 1 : hours % 3 === 2 ? 2 : 0}:00:00`).getTime();
};

// This method calculates the range of slider and names of people in event
const initRangeSlider = (data) => {
    let address = new Map(), addressValue;
    let range = [+setDateValueinMilliSeconds(data.startDate), +setDateValueinMilliSeconds(data.endDate)], dateMap = [], persons = new Map([]), personObject = [];
    data.vuzixMap.map(m => {
        dateMap.push(setDateValueinMilliSeconds(m.created))     //Event Date in milliseconds
        personsArray(m, persons);                               //Load Persons Names
        let temp = loadMarkerAddresses(m, address)              //Load Address Values
        if (temp !== undefined) {
            addressValue = temp;
        }
    });
    Array.from(persons.keys()).forEach(element => personObject.push({ checked: false, name: element }))
    dateMap.sort();
    return { range, dateMap, personObject, addressValue };
};

const personsArray = (m, persons) => m.person_names.forEach(element => {
    if (!persons.has(element.person_name)) {
        persons.set(element.person_name);
    }
});

//Load addresses for Markers - Card Detail Div
const loadMarkerAddresses = (m, address) => {
    let expiryDate = new Date().getTime() + 300000;
    let key = `${m.lat.toFixed(3)}:${m.long.toFixed(3)}`;
    const fetchAndLoadMarkerAddresses = () => {
        Promise.all(
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${m.lat},${m.long}&key=AIzaSyAaY23IZJ6Vi7HAkYr4QgQioPY2knvUgpw`)
                .then(res => res.json())
                .then(data => {
                    address.set(key, data.results[(parseInt(data.results.length / 2) + 1)].formatted_address);
                }).catch(err => console.log(err))
        ).then().catch(err => err);
    }

    if (!address.has(key)) {
        address.set(key, "");
        fetchAndLoadMarkerAddresses();
        return { address, expiryDate };
    }
};

export const updateMapAddressOnExpiry = (data) => dispatch => {
    let address = new Map(), addressValue;
    dispatch(addressValueLoading(true));
    data.forEach(m => {
        let temp = loadMarkerAddresses(m, address)              //Load Address Values
        if (temp !== undefined) {
            addressValue = temp;
        }
    });
    dispatch(loadAddressValue(addressValue));
}