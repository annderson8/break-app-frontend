import { Fragment } from "react";

import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { TicketIcon } from "@heroicons/react/24/outline";
import { RotatingLines } from "react-loader-spinner";

const CheckoutFormForm = ({
  onChange,
  total_amount,
  total_compare_amount,
  estimated_tax,
  apply_coupon,
  coupon,
  coupon_name,
  total_after_coupon,
  loading,
  buy,
  clientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/thankyou",
      },
    });
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
    defaultCollapsed: false,
  };

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
    >
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
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
            <dt className="text-base font-medium text-gray-900">Order total</dt>
            <dd className="text-base font-medium text-gray-900">
              ${total_amount}
            </dd>
          </div>
        )}
        <div className="mt-6">
          {loading ? (
            <button className="w-full bg-zinc-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-zinc-500">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
              />
            </button>
          ) : (
            <form
              id="payment-form"
              onSubmit={handleSubmit}
              className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
            >
              <LinkAuthenticationElement
                id="link-authentication-element"
                onChange={(e) => setEmail(e)}
              />
              <PaymentElement
                id="payment-element"
                options={paymentElementOptions}
              />
              <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-zinc-600 border border-transparent rounded-md shadow-sm py-3 px-4 mt-4 text-base font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-zinc-500"
              >
                <span id="button-text">
                  {isLoading ? (
                    <div className="spinner" id="spinner"></div>
                  ) : (
                    "Pay now"
                  )}
                </span>
              </button>
              {/* Show any error or success messages */}
              {message && <div id="payment-message">{message}</div>}
            </form>
          )}
        </div>
      </dl>
    </section>
  );
};

export default CheckoutFormForm;
