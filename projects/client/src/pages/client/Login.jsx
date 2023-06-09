import LayoutClient from "../../components/LayoutClient";
import BannerLogin from "../../images/banner/login.avif";
import { useState } from "react";

const LoginForm = ({ handlePage }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <form action="" className="">
        <span className="font-body">Welcome to</span>
        <h1 className="font-title text-2xl text-primary font-bold">
          Furniture<span className="text-primaryLight">.co</span>
        </h1>
        <div className="flex flex-col gap-3 mt-3">
          <div className="group">
            <input type="text" className="border w-full p-3 rounded-md font-body" placeholder="Email" />
          </div>
          <div className="group relative">
            <input
              type={showPassword ? "text" : "password"}
              className="border w-full p-3 rounded-md font-body"
              placeholder="Password"
            />
            <button
              className="absolute right-3 top-3 text-secondary"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? <i className="uil uil-eye"></i> : <i className="uil uil-eye-slash"></i>}
            </button>
          </div>
          <div className="group">
            <button className="px-6 py-2 bg-primary text-white font-title rounded-sm w-full">Sign In</button>
          </div>
        </div>
      </form>
      <div className="flex justify-between font-body text-sm mt-5">
        <p>
          Don't have an Account?{" "}
          <button className="text-secondary" onClick={() => handlePage("register")}>
            Sign Up
          </button>
        </p>
        <button className="text-secondary">Reset Password?</button>
      </div>
    </>
  );
};

const RegisterForm = ({ handlePage }) => {
  return (
    <>
      <form action="" className="">
        <span className="font-body">Welcome to</span>
        <h1 className="font-title text-2xl text-primary font-bold">
          Furniture<span className="text-primaryLight">.co</span>
        </h1>
        <div className="flex flex-col gap-3 mt-3">
          <div className="group">
            <input type="text" className="border w-full p-3 rounded-md font-body" placeholder="Email" />
          </div>
          <div className="group">
            <button className="px-6 py-2 bg-primary text-white font-title rounded-sm w-full">Sign Up</button>
          </div>
        </div>
      </form>
      <div className="flex justify-between font-body text-sm mt-5">
        <p>
          Already have an Account?{" "}
          <button className="text-secondary" onClick={() => handlePage("login")}>
            Sign In
          </button>
        </p>
      </div>
    </>
  );
};

function Login() {
  const [page, setPage] = useState("login");

  const handlePage = (page) => {
    setPage(page);
  };

  const RenderForm = () => {
    switch (page) {
      case "register":
        return <RegisterForm handlePage={handlePage} />;
      default:
        return <LoginForm handlePage={handlePage} />;
    }
  };

  return (
    <LayoutClient>
      <section className="py-6">
        <div className="page_container grid sm:grid-cols-2 grid-cols-1 gap-5 ">
          <div className="form flex flex-col justify-center">
            <RenderForm />
          </div>
          <div className="banner">
            <div className="image">
              <img className="h-[560px] w-full object-cover" src={BannerLogin} alt="Banner Login" />
            </div>
          </div>
        </div>
      </section>
    </LayoutClient>
  );
}

export default Login;
