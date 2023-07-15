import axios from "axios";
import { setAlert } from "./alert";
import { get_item_total } from "./cart";
import {
  GET_PAYMENT_TOTAL_SUCCESS,
  GET_PAYMENT_TOTAL_FAIL,
  LOAD_BT_TOKEN_SUCCESS,
  LOAD_BT_TOKEN_FAIL,
  PAYMENT_SUCCESS,
  PAYMENT_FAIL,
  RESET_PAYMENT_INFO,
  SET_PAYMENT_LOADING,
  REMOVE_PAYMENT_LOADING,
  PAYMENT_STRIPE_SUCCESS,
  PAYMENT_STRIPE_FAIL,
} from "./types";

export const get_payment_total =
  (coupon_name) => async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/payment/get-payment-total?coupon_name=${coupon_name}`,
        config
      );

      if (res.status === 200 && !res.data.error) {
        dispatch({
          type: GET_PAYMENT_TOTAL_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: GET_PAYMENT_TOTAL_FAIL,
        });
      }
    } catch (err) {
      dispatch({
        type: GET_PAYMENT_TOTAL_FAIL,
      });
    }
  };

export const get_client_token = () => async (dispatch) => {
  const config = {
    headers: {
      Accept: "application/json",
      Authorization: `JWT ${localStorage.getItem("access")}`,
    },
  };

  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/payment/get-token`,
      config
    );
    if (res.status === 200) {
      dispatch({
        type: LOAD_BT_TOKEN_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: LOAD_BT_TOKEN_FAIL,
      });
    }
  } catch (err) {
    dispatch({
      type: LOAD_BT_TOKEN_FAIL,
    });
  }
};

export const process_payment_stripe = (coupon_name, shipping_id) => async (dispatch) => {
    const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
        },
      };

  const body = JSON.stringify({
    coupon_name,
    shipping_id
  });
  console.log("En actions",body);
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/payment/create-payment-intent`,
      body,
      config
    );
    if (res.status === 200) {
      dispatch({
        type: PAYMENT_STRIPE_SUCCESS,
        payload: res.data,
      });
    } else {
      dispatch({
        type: PAYMENT_STRIPE_FAIL,
      });
      dispatch(setAlert("Error loading payment", "red"));
    }
  } catch (err) {
    dispatch({
      type: PAYMENT_STRIPE_FAIL,
    });
    dispatch(setAlert("Error processing payment", "red"));
  }

};

export const process_payment =
  (

    shipping_id,
    coupon_name,
  ) =>
  async (dispatch) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("access")}`,
      },
    };

    const body = JSON.stringify({
      shipping_id,
      coupon_name,
    });

    dispatch({
      type: SET_PAYMENT_LOADING,
    });

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment/make-payment`,
        body,
        config
      );
      if (res.status === 200 && res.data.success) {
        dispatch({
          type: PAYMENT_SUCCESS,
        });
        dispatch(setAlert(res.data.success, "green"));
        dispatch(get_item_total());
      } else {
        dispatch({
          type: PAYMENT_FAIL,
        });
        dispatch(setAlert(res.data.error, "red"));
      }
    } catch (err) {
      dispatch({
        type: PAYMENT_FAIL,
      });
      dispatch(setAlert("Error processing payment", "red"));
    }

    dispatch({
      type: REMOVE_PAYMENT_LOADING,
    });
    window.scrollTo(0, 0);
  };

export const reset = () => (dispatch) => {
  dispatch({
    type: RESET_PAYMENT_INFO,
  });
};


