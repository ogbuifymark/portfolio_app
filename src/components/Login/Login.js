import React, { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
  render() {
    return (
      <div
        className="hero-wrap hero-bread"
        style={{ backgroundImage: 'url("/Assets/images/bg_6.jpg")' }}
      >
        <div className="container">
          <div className="row no-gutters slider-text align-items-center justify-content-center">
            <div className="col-md-9 ftco-animate text-center">
              <h1 className="mb-0 bread">Login/Register</h1>
              <p className="breadcrumbs">
                <span className="mr-2">
                  <Link to="/">Home</Link>
                </span>{" "}
                <span>Login</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
