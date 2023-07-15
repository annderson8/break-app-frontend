import {
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAIL,
  GET_ORDER_DETAIL_SUCCESS,
  GET_ORDER_DETAIL_FAIL,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
} from "../actions/types";

const initialState = {
  orders: null,
  order: null,
};

export default function Orders(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        orders: payload.orders,
      };
    case GET_ORDERS_FAIL:
      return {
        ...state,
        orders: [],
      };
    case GET_ORDER_DETAIL_SUCCESS:
      return {
        ...state,
        order: payload.order,
      };
    case GET_ORDER_DETAIL_FAIL:
      return {
        ...state,
        order: {},
      };
    case UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map(order =>
            order.id === payload.order.id ? payload.order : order
        ),
      };
    case UPDATE_ORDER_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}
