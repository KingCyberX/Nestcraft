import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Use Link for routing
import logo1 from "../../assets/images/logo.png"; // Add your logo path here
import axios from "axios"; // Import axios for HTTP requests

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate(); // To navigate after successful registration

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Send registration data to the backend API
      const response = await axios.post("http://localhost:5000/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Check the response from the server (success or failure)
      if (response.status === 201) {
        // If registration is successful, navigate to login page
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed! Please try again.");
    }
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

        .register {
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

        input[type="email"],
        input[type="password"],
        input[type="text"] {
          background-repeat: no-repeat;
          background-size: 1.5rem;
          background-position: 1rem 50%;
        }

        input[type="email"] {
          background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#242c37"><path d="M256.017 273.436l-205.17-170.029h410.904l-205.734 170.029zm-.034 55.462l-205.983-170.654v250.349h412v-249.94l-206.017 170.245z"/></svg>');
        }

        input[type="password"] {
          background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#242c37"><path d="M195.334 223.333h-50v-62.666c0-61.022 49.645-110.667 110.666-110.667 61.022 0 110.667 49.645 110.667 110.667v62.666h-50v-62.666c0-33.452-27.215-60.667-60.667-60.667-33.451 0-60.666 27.215-60.666 60.667v62.666zm208.666 30v208.667h-296v-208.667h296zm-121 87.667c0-14.912-12.088-27-27-27s-27 12.088-27 27c0 7.811 3.317 14.844 8.619 19.773 4.385 4.075 6.881 9.8 6.881 15.785v22.942h23v-22.941c0-5.989 2.494-11.708 6.881-15.785 5.302-4.93 8.619-11.963 8.619-19.774z"/></svg>');
        }

        input[type="submit"] {
          background-image: linear-gradient(160deg, #8ceabb 0%, #378f7b 100%);
          color: #fff;
          margin-bottom: 6rem;
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

        .error {
          color: red;
          font-size: 0.8rem;
        }

        .logo {
          margin-bottom: 2rem;
        }
      `}</style>

      <div className="app">
        <div className="register">
          <img
            src={logo1}
            alt="Logo"
            className="logo"
            width={280}
            // height={100}
          />
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form__field">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="form__field">
              <input
                type="email"
                name="email"
                placeholder="info@nestcraft.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form__field">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="form__field">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>
            <div className="form__field">
              <input type="submit" value="Sign Up" />
            </div>
          </form>
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;