import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";

import {
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

const CartItem = ({
  item,
  count,
  update_item,
  remove_item,
  render,
  setRender,
  setAlert,
}) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    item_count: 1,
  });

  const { item_count } = formData;

  useEffect(() => {
    if (count) setFormData({ ...formData, item_count: count });
  }, [count, formData ]);

  const onChange = (e) => {
    setLoading(true);
    const newCount = Number(e.target.value);
    setFormData({ ...formData, [e.target.name]: newCount });
    const fetchData = async () => {
      try {
        if (item.product.quantity >= item_count) {
          await update_item(item, newCount);
        } else {
          setAlert("Not enough in stock", "danger");
        }
        setRender(!render);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    fetchData();
  };

  const removeItemHandler = async () => {
    await remove_item(item);
    setRender(!render);
  };

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <img
          src={item.product.photo}
          alt=""
          className="w-24 h-24 rounded-md object-center object-cover sm:w-36 sm:h-36"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <Link
                  to={`/product/${item.product.id}`}
                  className="font-medium text-gray-700 hover:text-gray-800"
                >
                  {item.product.name}
                </Link>
              </h3>
            </div>

            <p className="mt-1 text-sm font-medium text-gray-900">
              $ {item.product.price}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:pr-9">
            {loading ? (
              <RotatingLines
                className="text-center"
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="32"
                visible={true}
              />
            ) : (
              <select
                name="item_count"
                onChange={(e) => onChange(e)}
                value={item_count}
                className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
              </select>
            )}

            <div className="absolute top-0 right-0">
              <button
                onClick={removeItemHandler}
                className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Remove</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-4 flex text-sm text-gray-700 space-x-2">
          {item.product &&
          item.product !== null &&
          item.product !== undefined &&
          item.product.quantity > 0 ? (
            <>
              <CheckCircleIcon
                className="flex-shrink-0 h-5 w-5 text-green-500"
                aria-hidden="true"
              />
              <span>In Stock</span>
            </>
          ) : (
            <>
              <ClockIcon
                className="flex-shrink-0 h-5 w-5 text-gray-300"
                aria-hidden="true"
              />
              <span>Out of Stock</span>
            </>
          )}
        </p>
      </div>
    </li>
  );
};
export default CartItem;
