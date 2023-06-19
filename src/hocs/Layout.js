import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Footer } from "../components/navigation/Footer";
import { NavBar } from "../components/navigation/NavBar";

const Layout = (props) => {
  return (
    <div>
      <NavBar />
      <ToastContainer autoClose={5000} />
      {props.children}
      <Footer />
    </div>
  );
};

export { Layout };
