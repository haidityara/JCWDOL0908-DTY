import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LoginValidation } from "../../validation/User";

const LoginForm = ({ handlePage }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values) => {
    // TODO: Call API Login
    console.log(values);
  };

  return (
    <>
      <Formik initialValues={{ email: "", password: "" }} onSubmit={handleSubmit} validationSchema={LoginValidation}>
        <Form>
          <span className="font-body">Welcome to</span>
          <h1 className="font-title text-2xl text-primary font-bold">
            Furniture<span className="text-primaryLight">.co</span>
          </h1>
          <div className="flex flex-col gap-3 mt-3">
            <div className="group">
              <Field type="email" className="border w-full p-3 rounded-md font-body" placeholder="Email" name="email" />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
            </div>
            <div className="group relative">
              <Field
                type={showPassword ? "text" : "password"}
                className="border w-full p-3 rounded-md font-body"
                placeholder="Password"
                name="password"
              />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
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
              <button className="px-6 py-2 bg-primary text-white font-title rounded-sm w-full" type="submit">
                Sign In
              </button>
            </div>
          </div>
        </Form>
      </Formik>
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

export default LoginForm;
