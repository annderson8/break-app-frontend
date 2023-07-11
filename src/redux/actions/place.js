import axios from 'axios';
import {
    GET_PLACE_OPTIONS_SUCCESS,
    GET_PLACE_OPTIONS_FAIL
} from './types';

export const get_place_options = () => async dispatch => {
    const config = {
        headers: {
            'Accept': 'application/json',
        }
    };

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/place/get-place-options`, config);

        if (res.status === 200) {
            dispatch({
                type: GET_PLACE_OPTIONS_SUCCESS,
                payload: res.data
            });
        } else {
            dispatch({
                type: GET_PLACE_OPTIONS_FAIL
            });
        }
    } catch(err) {
        dispatch({
            type: GET_PLACE_OPTIONS_FAIL
        });
    }
};