import BannerLogin from "../../../images/banner/login.avif";
import LayoutClient from "../../../components/LayoutClient";
import { Form, Formik } from "formik";
import FieldPassword from "../../../components/client/FieldPassword";
import { UserVerification } from "../../../validation/User";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../features/LoaderSlice";
import { ToastError, ToastSuccess } from "../../../helper/Toastify";

function Verification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const handleSubmit = async (values) => {
    dispatch(setLoading(true));
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/auth/verify`, {
        token: values.token,
        password: values.password,
      });
      dispatch(setLoading(false));
      ToastSuccess("Verification success");
      // Redirect to login page
      setTimeout(() => {
        navigate("/client");
      }, 2000);
    } catch (error) {
      dispatch(setLoading(false));
      ToastError(error.response.data.message || "Verification failed");
    }
  };
  return (
    <LayoutClient>
      <section className="py-6">
        <div className="page_container grid sm:grid-cols-2 grid-cols-1 gap-5 ">
          <div className="form flex flex-col justify-center">
            <Formik
              initialValues={{
                password: "",
                confirmPassword: "",
                token,
              }}
              onSubmit={handleSubmit}
              validationSchema={UserVerification}
            >
              {(formikProps) => {
                return (
                  <Form>
                    <span className="font-body">Welcome to</span>
                    <h1 className="font-title text-2xl text-primary font-bold">
                      Furniture<span className="text-primaryLight">.co</span>
                    </h1>
                    <div className="flex flex-col gap-3 mt-3">
                      <div className="group relative">
                        <FieldPassword name="password" id="password" placeholder="Password" autoComplete="off" />
                      </div>
                      <div className="group relative">
                        <FieldPassword
                          name="confirmPassword"
                          placeholder="Confirm password"
                          id="confirmPassword"
                          autoComplete="off"
                        />
                      </div>
                      <div className="group">
                        <button className="px-6 py-2 bg-primary text-white font-title rounded-sm w-full" type="submit">
                          Submit
                        </button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
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

export default Verification;
