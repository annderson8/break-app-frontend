import axios from 'axios';
import {
    GET_ORDERS_SUCCESS,
    GET_ORDERS_FAIL,
    GET_ORDER_DETAIL_SUCCESS,
    GET_ORDER_DETAIL_FAIL,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAIL
} from './types';


export const list_orders = () => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/get-orders`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ORDERS_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ORDERS_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_ORDERS_FAIL
            });
        }
    }
}


export const get_order_detail = transactionId => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/get-order/${transactionId}`, config);

            if (res.status === 200) {
                dispatch({
                    type: GET_ORDER_DETAIL_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: GET_ORDER_DETAIL_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: GET_ORDER_DETAIL_FAIL
            });
        }
    }
}

export const update_data_order = (updatedData) => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`,
            }
        };

        const body = JSON.stringify(updatedData);
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/update-data-order`, body, config);

            if (res.status === 200 && !res.data.error) {
                dispatch({
                    type: UPDATE_ORDER_SUCCESS,
                    payload: res.data
                });
            } else {
                dispatch({
                    type: UPDATE_ORDER_FAIL
                });
            }
        } catch(err) {
            dispatch({
                type: UPDATE_ORDER_FAIL
            });
        }
    }
}