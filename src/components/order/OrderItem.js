import { useState } from "react";
import { Link } from "react-router-dom";

import OrderItemDetail from "./OrderItemDetail";

const OrderItem = ({  order, places, update_data_order }) => {
//   const [formData, setFormData] = useState({
//     place: "",
//     time: "",
//     date_delivery: "",
//   });

//   const onChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = (e) => {
//     e.preventDefault();
//     const fetchData = async () => {
//       try {
//         const updatedData = {
//           place: formData.place,
//           date_delivery: formData.date_delivery,
//           time_delivery: formData.time,
//         };
//         update_data_order(order, updatedData);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="text-sm border-b border-gray-200 mt-2 pb-5 sm:flex sm:justify-between">
        <dl className="flex">
          <dt className="text-gray-500">Transaction ID: &nbsp;</dt>
          <dd className="font-medium text-gray-900">{order.transaction_id}</dd>
          <dt>
            <span className="sr-only">Date</span>
            <span className="text-gray-400 mx-2" aria-hidden="true">
              -
            </span>
          </dt>
          <dd className="font-medium text-gray-900">
            <time dateTime="2021-03-22">{formatDate(order.date_issued)}</time>
          </dd>
        </dl>
        <div className="mt-4 sm:mt-0">
          <Link
            to={`/dashboard/payment/${order.transaction_id}`}
            className="font-medium text-zinc-600 hover:text-zinc-500 mr-7"
          >
            View invoice
            <span aria-hidden="true"> &rarr;</span>
          </Link>
          <button
            onClick={() => toggleAccordion()}
            className="inline-flex mt-4  items-center justify-center text-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
          >
            {isOpen ? "-" : "+"}
          </button>
        </div>
      </div>
      <div className={` ${isOpen ? "block" : "hidden"}`}>
        {order.order_items &&
          order.order_items.map((item, index) => (
            <ul key={index}>
              <OrderItemDetail
                item={item}
                places={places}
                update_data_order={update_data_order}
              />
            </ul>
          ))}
      </div>
    </>
  );
};
export default OrderItem;
