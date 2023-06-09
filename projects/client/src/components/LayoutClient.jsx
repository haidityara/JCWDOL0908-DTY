import NavbarClient from "./client/NavbarClient";
import FooterClient from "./client/FooterClient";

function LayoutClient({ children }) {
  return (
    <div className="flex flex-col">
      <NavbarClient />
      <main>{children}</main>
      <FooterClient />
    </div>
  );
}

export default LayoutClient;
