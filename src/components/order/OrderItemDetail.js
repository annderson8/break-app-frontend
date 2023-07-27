import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const OrderItemDetail = ({
  item,
  places,
  update_data_order,
}) => {
  const [deliveryTimes, setDeliveryTimes] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };


  const [date, setDate] = useState(formatDate(item.date_delivery));
  const [place, setPlace] = useState(item.place.id);
  const [time, setTime] = useState(item.time_delivery);

  const handlerSelectedPlace = useCallback((e) => {
    if (places) {
      const selectedPlace = places.find((p) => p.id === Number(e));
      setDeliveryTimes(selectedPlace ? selectedPlace.times : []);
    }
  }, [places, setDeliveryTimes]);
  
  useEffect(() => {
    handlerSelectedPlace(place);
  }, [place, handlerSelectedPlace]);

  const [data, setData] = useState([]);
  const handleChange = (name, value, id) => {
    const updatedData = { ...data };
    updatedData[name] = value;

    setData(updatedData);

    const payload = {
      [name]: value,
      order_id: item.id,
    };

    const fetchData = async () => {
      try {
        update_data_order(payload);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  };

  return (
    <li className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center py-1 sm:py-1">
      <div className="hidden sm:block sm:col-span-1">
        <img
          src={item.product.photo}
          alt=""
          className="w-12 h-12 rounded-md object-center object-cover sm:w-18 sm:h-18"
        />
      </div>
      <div className="col-span-1 ">
        <h3 className="text-lg">
          <Link
            to={`/product/${item.product.id}`}
            className="font-medium text-gray-700 hover:text-gray-800"
          >
            {item.product.name}
          </Link>
        </h3>
      </div>
      <form
        className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-2"
      >
        <select
          name="place"
          className="h-full rounded-md border-0 bg-transparent py-0 pl-4 pr-4 text-gray-600 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm "
          value={place}
          onChange={(e) => {
            // onChange(e);
            setPlace(e.target.value);
            handlerSelectedPlace(e.target.value);
            handleChange('place', e.target.value)

          }}
        >
          <option value="0">Select place</option>
          {places &&
            places.map((place_options, index) => (
              <option key={index} value={place_options.id}>
                {place_options.name}
              </option>
            ))}
        </select>
        <input
          className="h-full rounded-md border-0 bg-transparent py-0 pl-4 pr-4 text-gray-600 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm  "
          type="date"
          name="date_delivery"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            handleChange('date_delivery', e.target.value)
          }}
        />
        <select
          name="time_delivery"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
            handleChange('time_delivery', e.target.value)
          }}
          className="h-full rounded-md border-0 bg-transparent py-0 pl-4 pr-4 text-gray-600 focus:ring-2 focus:ring-inset focus:ring-zinc-600 sm:text-sm "
        >
          <option value="0">Select time</option>
          {deliveryTimes &&
            deliveryTimes.map((time, index) => (
              <option key={index} value={time.id}>
                {time.time}
              </option>
            ))}
        </select>
      </form>
    </li>
  );
};
export default OrderItemDetail;
