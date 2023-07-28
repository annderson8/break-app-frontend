import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { connect } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { TicketIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";

import Layout from "../../components/hocs/Layout";

import { setAlert } from "../../redux/actions/alert";
import { check_coupon } from "../../redux/actions/coupons";
import { refresh } from "../../redux/actions/auth";
import {
  get_payment_total,
  process_payment,
  process_payment_stripe,
} from "../../redux/actions/payment";

import {
  remove_item,
  update_item,
  get_items,
  get_total,
  get_item_total,
} from "../../redux/actions/cart";

import CartItem from "../../components/cart/CartItem";
import CheckoutForm from "../../components/checkout/CheckoutForm";


const pk_stripe = toString(process.env.PUBLIC_KEY_STRIPE);

const stripePromise = loadStripe(
  pk_stripe
);

const Checkout = ({
  isAuthenticated,
  items,
  update_item,
  remove_item,
  setAlert,
  refresh,
  get_payment_total,
  process_payment,
  process_payment_stripe,
  user,
  total_items,
  made_payment,
  loading,
  original_price,
  total_after_coupon,
  total_amount,
  total_compare_amount,
  estimated_tax,
  shipping_cost,
  check_coupon,
  coupon,
  clientSecret,
  get_items,
  get_total,
  get_item_total,
}) => {
  const [formData, setFormData] = useState({
    coupon_name: "",
    shipping_id: 0,
  });

  const [render, setRender] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    get_items();
    get_total();
    get_item_total();
  }, [render,get_items, get_total,get_item_total]);


  const { coupon_name, shipping_id } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const apply_coupon = async (e) => {
    e.preventDefault();
    check_coupon(coupon_name);
  };

  useEffect(() => {
    if (coupon && coupon !== null && coupon !== undefined)
      get_payment_total(coupon.name);
    else get_payment_total("default");
  }, [coupon, render, get_payment_total]);

  //Payments

  const [loadData, setLoadData] = useState(false);

  useEffect(() => {
    setLoadData(false);
    if (total_amount > 0) {
      const fetchData = async () => {
        try {
          await process_payment_stripe(coupon_name, shipping_id);
          setLoadData(true);
        } catch (error) {
          // Manejar el error aquí.
          console.error("Error al obtener el clientSecret:", error);
        }
      };
      fetchData();
    }
  }, [total_amount, coupon_name, shipping_id, process_payment_stripe]);

  const appearance = {
    theme: "flat",
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (!isAuthenticated) return <Navigate to="/" />;

  const showItems = () => {
    return (
      <div>
        {items &&
          items !== null &&
          items !== undefined &&
          items.length !== 0 &&
          items.map((item, index) => {
            let count = item.count;
            return (
              <div key={index}>
                <CartItem
                  inCart={true}
                  item={item}
                  count={count}
                  update_item={update_item}
                  remove_item={remove_item}
                  render={render}
                  setRender={setRender}
                  setAlert={setAlert}
                />
              </div>
            );
          })}
      </div>
    );
  };

  if (made_payment) return <Navigate to="/thankyou" />;

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Checkout
          </h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {showItems()}
              </ul>
            </section>
            <section
              aria-labelledby="summary-heading"
              className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <form onSubmit={(e) => apply_coupon(e)}>
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Coupon
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow focus-within:z-10">
                        <input
                          name="coupon_name"
                          type="text"
                          onChange={(e) => onChange(e)}
                          value={coupon_name}
                          className="focus:ring-zinc-500 focus:border-zinc-500 block w-full rounded-none rounded-l-md pl-4 sm:text-sm border-gray-300"
                          placeholder="Enter coupon"
                        />
                      </div>
                      <button
                        type="submit"
                        className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500"
                      >
                        <TicketIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Apply Coupon</span>
                      </button>
                    </div>
                  </form>
                </div>

                {coupon && coupon !== null && coupon !== undefined ? (
                  <div className="text-green-500">
                    Coupon: {coupon.name} is applied.
                  </div>
                ) : (
                  <Fragment></Fragment>
                )}

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="flex text-sm text-gray-600">
                    <span>Tax estimate</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${estimated_tax}
                  </dd>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="flex text-sm text-gray-600">
                    <span>Subtotal</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ${total_compare_amount}
                  </dd>
                </div>

                {coupon && coupon !== null && coupon !== undefined ? (
                  <>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="flex text-sm text-gray-600">
                        <span>Discounted Total</span>
                      </dt>
                      <dd className="text-sm font-medium text-gray-900">
                        ${total_after_coupon}
                      </dd>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">
                        Order Total
                      </dt>
                      <dd className="text-base font-medium text-gray-900">
                        ${total_amount}
                      </dd>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-gray-900">
                      Order total
                    </dt>
                    <dd className="text-base font-medium text-gray-900">
                      ${total_amount}
                    </dd>
                  </div>
                )}
                { loadData &&
              clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm
                  clientSecret={clientSecret}
                />
              </Elements>
            )}
              </dl>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
  items: state.Cart.items,
  total_items: state.Cart.total_items,
  clientSecret: state.Payment.clientSecret,
  made_payment: state.Payment.made_payment,
  loading: state.Payment.loading,
  original_price: state.Payment.original_price,
  total_after_coupon: state.Payment.total_after_coupon,
  total_amount: state.Payment.total_amount,
  total_compare_amount: state.Payment.total_compare_amount,
  estimated_tax: state.Payment.estimated_tax,
  coupon: state.Coupons.coupon,
});

export default connect(mapStateToProps, {
  get_items,
  get_total,
  get_item_total,
  remove_item,
  update_item,
  setAlert,
  refresh,
  get_payment_total,
  process_payment,
  process_payment_stripe,
  check_coupon,
})(Checkout);
