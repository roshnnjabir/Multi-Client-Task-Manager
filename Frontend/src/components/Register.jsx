import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Header from "./Header";
import { useSelector } from "react-redux";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast.info("You are already logged in. Redirecting to your profile...", {
        autoClose: 3000,
        pauseOnHover: false,
        onClose: () => navigate("/profile", { replace: true }),
      });
    }
  }, [navigate, isAuthenticated]);

  const validateField = (name, value) => {
    let isValid = true;
    let message = "";

    switch (name) {
      case "name":
        if (value.trim() === "") {
          isValid = false;
          message = "Name is required.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = "Invalid email format.";
        }
        break;
      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (value.length < 8) {
          isValid = false;
          message = "Password must be at least 8 characters long.";
        } else if (!passwordRegex.test(value)) {
          isValid = false;
          message = "Password must contain at least one uppercase, one lowercase, one number, and one special character.";
        }
        break;
      case "confirmPassword":
        if (value !== userData.password) {
          isValid = false;
          message = "Passwords do not match.";
        }
        break;
      default:
        break;
    }

    return { isValid, message };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    const { isValid, message } = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: isValid ? "" : message, 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let formValid = true;

    Object.keys(userData).forEach((field) => {
      const { isValid, message } = validateField(field, userData[field]);
      if (!isValid) {
        newErrors[field] = message;
        formValid = false;
      }
    });

    if (!formValid) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/register/", {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      setSuccess(true);
      setErrors({});
      setUserData({ name: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErrors({ global: "Registration failed. Please try again." });
      console.error("Registration failed:", error);
    }
  };

  if (isAuthenticated) {
    return <div><ToastContainer /></div>;
  }

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ToastContainer />
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          {errors.global && <p className="text-red-500 text-center mb-4">{errors.global}</p>}
          {success && <p className="text-green-500 text-center mb-4">Registration successful! Redirecting to login...</p>}

          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className={`w-full p-2 mt-2 border rounded focus:outline-none ${errors.name ? 'border-red-500' : 'border-black'} focus:border-black`} // Border stays black when focused
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className={`w-full p-2 mt-2 border rounded focus:outline-none ${errors.email ? 'border-red-500' : 'border-black'} focus:border-black`} // Border stays black when focused
              required
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-semibold" htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className={`w-full p-2 mt-2 border rounded focus:outline-none ${errors.password ? 'border-red-500' : 'border-black'} focus:border-black`} // Border stays black when focused
              required
            />
            <span className="absolute right-3 top-10 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="mb-6 relative">
            <label className="block text-sm font-semibold" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 mt-2 border rounded focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'border-black'} focus:border-black`} // Border stays black when focused
              required
            />
            <span className="absolute right-3 top-10 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Register
          </button>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">Login here</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
