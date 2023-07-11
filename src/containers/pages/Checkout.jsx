import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { RotatingLines } from "react-loader-spinner";

import Layout from "../../hocs/Layout";
import { countries } from "../../helpers/fixedCountries";

import { setAlert } from "../../redux/actions/alert";
import { update_item, remove_item } from "../../redux/actions/cart";
import { check_coupon } from "../../redux/actions/coupons";
import { refresh } from "../../redux/actions/auth";
import {
  get_payment_total,
  get_client_token,
  process_payment,
  process_payment_stripe,
} from "../../redux/actions/payment";
import { get_place_options } from "../../redux/actions/place";

import CartItem from "../../components/cart/CartItem";
import CheckoutForm from "../../components/checkout/CheckoutForm";
import PayForm from "../../components/checkout/PayForm";

const stripePromise = loadStripe(
  "pk_test_51NQ46oJG3NL7E2w0pNoWwTY8JUsyKIBuMf1A8J07fkq5Ofvdra4m3FDKAp8MhipFg2wcs4IfeElADFT7QPO6Mo4f008rLaWjsu"
);


const Checkout = ({
  isAuthenticated,
  items,
  update_item,
  remove_item,
  setAlert,
  refresh,
  get_payment_total,
  get_client_token,
  process_payment,
  process_payment_stripe,
  user,
  total_items,
  clientToken,
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
  place,
  get_place_options,
}) => {
  useEffect(() => {
    get_place_options();
  }, []);


  const [formData, setFormData] = useState({
    coupon_name: "",
    shipping_id: 0,
  });

  const [data, setData] = useState({
    instance: {},
  });

  const { coupon_name, shipping_id } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const buy = async (e) => {
    e.preventDefault();
    if (coupon && coupon !== null && coupon !== undefined) {
      process_payment(shipping_id, coupon.name);
    } else {
      process_payment(shipping_id, "");
    }
  };

  const apply_coupon = async (e) => {
    e.preventDefault();
    check_coupon(coupon_name);
  };

  useEffect(() => {
    if (coupon && coupon !== null && coupon !== undefined)
      get_payment_total(coupon.name);
    else get_payment_total("default");
  }, [coupon]);

  const [render, setRender] = useState(false);

  //Payments

  useEffect(() => {
    if (total_amount > 0) {
      console.log("Ejecunatado el secret de stripe", total_amount);
      process_payment_stripe(total_amount, coupon_name, shipping_id  );
    }
  }, [total_amount]);


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

            {clientSecret && (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm
                  onChange={onChange}
                  total_amount={total_amount}
                  total_after_coupon={total_after_coupon}
                  total_compare_amount={total_compare_amount}
                  estimated_tax={estimated_tax}
                  coupon={coupon}
                  apply_coupon={apply_coupon}
                  coupon_name={coupon_name}
                  loading={loading}
                  buy={buy}
                  clientSecret={clientSecret}
                />
              </Elements>
            )}
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
  clientToken: state.Payment.clientToken,
  clientSecret: state.Payment.clientSecret,
  made_payment: state.Payment.made_payment,
  loading: state.Payment.loading,
  original_price: state.Payment.original_price,
  total_after_coupon: state.Payment.total_after_coupon,
  total_amount: state.Payment.total_amount,
  total_compare_amount: state.Payment.total_compare_amount,
  estimated_tax: state.Payment.estimated_tax,
  coupon: state.Coupons.coupon,
  place: state.Place.place,
});

export default connect(mapStateToProps, {
  update_item,
  remove_item,
  setAlert,
  refresh,
  get_payment_total,
  get_client_token,
  process_payment,
  process_payment_stripe,
  check_coupon,
  get_place_options,
})(Checkout);
