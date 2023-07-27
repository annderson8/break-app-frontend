import { connect } from "react-redux";
import { list_orders, update_data_order } from "../../redux/actions/orders";
import { useEffect } from "react";
import { Navigate } from "react-router";
import NavbarDashboard from "../../components/navigation/NavbarDashboard";
import OrderItem from "../../components/order/OrderItem";
import { get_place_options } from "../../redux/actions/place";


const DashboardPayments = ({
  list_orders,
  orders,
  isAuthenticated,
  user,
  get_place_options,
  place,
  update_data_order,
}) => {

  useEffect(() => {
    list_orders();
    get_place_options();
  }, [list_orders,get_place_options ]);

  if (!isAuthenticated) return <Navigate to="/" />;

  return (
    <NavbarDashboard>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="space-y-12">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Order Details
            </h1>
            {orders &&
              orders !== null &&
              orders !== undefined &&
              orders.length !== 0 &&
              orders.map((order, index) => (
                <>
                  <OrderItem
                    key={index}
                    order={order}
                    places={place}
                    update_data_order={update_data_order}
                  />
                </>
              ))}
          </div>
        </div>
      </main>
    </NavbarDashboard>
  );
};

const mapStateToProps = (state) => ({
  orders: state.Orders.orders,
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
  place: state.Place.place,
});

export default connect(mapStateToProps, {
  list_orders,
  get_place_options,
  update_data_order,
})(DashboardPayments);
