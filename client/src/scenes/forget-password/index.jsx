import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use Link for routing
import logo1 from "../../assets/images/logo.png"; // Dark mode logo

const ForgotPassword = () => {
  // Manage form state with React
  const [email, setEmail] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    // Add logic to handle password reset (e.g., API call to send email)
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          height: 100%;
          margin: 0;
          font-family: 'Helvetica Neue', sans-serif;
        }

        body {
          background-color: #354152;
          color: #7e8ba3;
        }

        .app {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .grid {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .forgot-password-container {
          box-shadow: 0 0 250px #000;
          text-align: center;
          padding: 4rem 2rem;
          max-width: 400px;
          width: 100%;
          background-color: transparent;
          border-radius: 8px;
        }

        h2 {
          font-size: 2.75rem;
          font-weight: 100;
          margin: 0 0 1rem;
          text-transform: uppercase;
        }

        .form__field {
          margin-bottom: 1rem;
        }

        input {
          border: 1px solid #242c37;
          border-radius: 999px;
          padding: 0.5rem 1rem;
          width: 100%;
          background-color: transparent;
          color: #7e8ba3;
          font-size: 1rem;
        }

        input::placeholder {
          color: #7e8ba3;
        }

        input[type="email"] {
          background-repeat: no-repeat;
          background-size: 1.5rem;
          background-position: 1rem 50%;
        }

        input[type="email"] {
          background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#242c37"><path d="M256.017 273.436l-205.17-170.029h410.904l-205.734 170.029zm-.034 55.462l-205.983-170.654v250.349h412v-249.94l-206.017 170.245z"/></svg>');
        }

        input[type="submit"] {
          background-image: linear-gradient(160deg, #8ceabb 0%, #378f7b 100%);
          color: #fff;
          margin-bottom: 2rem;
          width: 100%;
          border-radius: 999px;
          padding: 0.75rem;
        }

        a {
          color: #7e8ba3;
        }

        p {
          color: #fff;
        }

        .back-to-login {
          font-size: 0.8rem;
          margin-top: 1rem;
        }

      `}</style>

      <div className="app">
        <div className="forgot-password-container">
          <img src={logo1} width={300} height={300} alt="Logo" />
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form__field">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form__field">
              <input type="submit" value="Send Reset Link" />
            </div>
          </form>
          <p className="back-to-login">
            Remember your password? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
