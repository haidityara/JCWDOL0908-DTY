import NavbarClient from "./client/NavbarClient";
import FooterClient from "./client/FooterClient";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./client/Loader";

function LayoutClient({ children }) {
  return (
    <div className="flex flex-col">
      <NavbarClient />
      <main>
        <Loader />
        <ToastContainer />
        {children}
      </main>
      <FooterClient />
    </div>
  );
}

export default LayoutClient;
