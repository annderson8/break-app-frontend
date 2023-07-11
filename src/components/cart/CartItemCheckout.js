import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { XMarkIcon } from "@heroicons/react/24/solid";

const CartItem = ({
  item,
  count,
  update_item,
  remove_item,
  render,
  setRender,
  setAlert,
  place,
}) => {
  const [formData, setFormData] = useState({
    item_count: 1,
  });

  const { item_count } = formData;

  useEffect(() => {
    if (count) setFormData({ ...formData, item_count: count });
  }, [count]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const fetchData = async () => {
      try {
        if (item.product.quantity >= item_count) {
          await update_item(item, item_count);
        } else {
          setAlert("Not enough in stock", "danger");
        }
        setRender(!render);
      } catch (err) {}
    };

    fetchData();
  };

  const removeItemHandler = async () => {
    await remove_item(item);
    setRender(!render);
  };

  const renderPlace = () => {
    if (place && place !== null && place !== undefined) {
      return (
        <select
          name="place_id"
          onChange={(e) => onChange(e)}
          className="h-full rounded-md border-0 bg-transparent py-0 pl-4 pr-4 text-gray-600 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm "
        >
          {place.map((place_options, index) => (
            <option key={index} value={place_options.id}>
              {place_options.name}
            </option>
          ))}
        </select>
      );
    }
  };

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <img
          src={item.product.photo}
          alt=""
          className="w-12 h-12 rounded-md object-center object-cover sm:w-18 sm:h-18"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
        <div className="relative pr-9 flex items-center sm:gap-x-6 sm:pr-0">
          <div className="mt-4 sm:mt-0 sm:pr-4">
            <div className="flex">
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
          <div className="mt-4 sm:mt-0 sm:pr-4 ">
            <form
              className="flex justify-between"
              onSubmit={(e) => onSubmit(e)}
            >
              {renderPlace()}

              <input
              className="h-full rounded-md border-0 bg-transparent py-0 pl-4 pr-4 text-gray-600 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm  "
                type="date"
                id="start"
                name="trip-start"
                value="2023-07-06"
              />
              <select
                id="currency"
                name="currency"
                className="h-full rounded-md border-0 bg-transparent py-0 pl-4 pr-4 text-gray-600 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm "
              >
                <option>08:00 pm</option>
                <option>09:00 pm</option>
                <option>10:00 am</option>
              </select>
            </form>

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
      </div>
    </li>
  );
};
export default CartItem;
