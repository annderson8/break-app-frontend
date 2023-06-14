import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Navbar } from "../components/navigation/NavBar";
import { Footer } from "../components/navigation/Footer";

const Layout = (props) => {
  <div>
    <Navbar />
    <ToastContainer autoClose={5000} />
    {props.children}
    <Footer />
  </div>;
};

export { Layout };
