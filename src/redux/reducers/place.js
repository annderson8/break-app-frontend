import {
    GET_PLACE_OPTIONS_SUCCESS,
    GET_PLACE_OPTIONS_FAIL
} from '../actions/types';

const initialState = {
    place: null,
};

export default function Place(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case GET_PLACE_OPTIONS_SUCCESS:
            return {
                ...state,
                place: payload.place_options
            }
        case GET_PLACE_OPTIONS_FAIL:
            return {
                ...state,
                place: null
            }
        default:
            return state;
    }
};