import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import LoginPicture from "../assets/images/ThreeHappyFriends.jpg";
import styled from "styled-components";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { LeftNavbar, RightLoginNavbar } from "./Navbar";
import { AuthContext } from "./Home";



const LoginRightStyles = {
  background: {
    backgroundImage: "url(" + LoginPicture + ")"
  }
};

const ErrMessage = styled.div`
  color: red;
`;
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("This is not a valid email"),
  password: Yup.string().min(
    8,
    "Your password cannot be fewer than 8 characters"
  )
});

const Login = () => {
  let history = useHistory();
  const { dispatch } = React.useContext(AuthContext)
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);
  const handleLogin = values => {
    console.log(values);
    const { email, password } = values;
    let data = new FormData();
    data.append("email", email);
    data.append("password", password);
    console.log(data.get("email"));
    console.log(data.get("password"));
    axios
      .post(
        "http://localhost:3005/api/v1/users/login",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      .then(
        response => {
          setSuccess('You successfully logged in')
          console.log(response.data);
          localStorage.setItem(
            "login",
            JSON.stringify({ login: true, token: response.data.token })
          )
          history.push('/user')
        }
      )
      .catch(err => {
        setErr(err);
        console.log(err);
      });
  };

  return (
    <div className="h-full flex">
      <div className="w-1/2 m-0 px-20 py-10 bg-gray-300">
        <LeftNavbar />
        <div>{err ? err.message : null}</div>
        <div>{success ? success : null}</div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {(errors, touched) => (
            <Form className="w-3/5 rounded-larger bg-white px-12 py-8 my-20 mx-auto shadow-lg">
              <h1 className="text-center text-2xl font-bolder mb-4">
                Welcome Back
              </h1>
              <div className="text-center font-semibold">
                Login to your account
              </div>
              <div className="mb-4 mt-12">
                <label className="font-black" htmlFor="email">
                  Email
                </label>
                <Field
                  name="email"
                  className="border-b-2 bg-indigo-100 h-10 border-indigo-700 w-full"
                  type="email"
                />
                {errors.name && touched.name ? (
                  <ErrMessage />
                ) : null}
              </div>
              <div className="mb-8">
                <label className="font-black" htmlFor="password">
                  Password
                </label>
                <Field
                  name="password"
                  className="border-b-2 bg-indigo-100 h-10 border-indigo-700 w-full"
                  type="password"
                />
                {errors.password && touched.password ? (
                  <ErrMessage />
                ) : null}
              </div>
              <button
                // onClick={() =>
                //   auth.login(() => loginprops.history.push("/user"))
                // }
                type="submit"
                className="rounded-full shadow-lg bg-indigo-700 w-full focus:outline-none hover:bg-indigo-500 text-white p-2"
              >
                Login
              </button>
              <div className="m-4 text-center">Forgot password?</div>
              <div className="m-6 text-center text-sm">
                Dont have an account yet?{" "}
                <Link className="text-purple-500 font-bold" to="/newauth">
                  Sign up
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="w-1/2 bg-cover" style={LoginRightStyles.background}>
        <RightLoginNavbar />
      </div>
    </div>
  );
};

export default Login;
