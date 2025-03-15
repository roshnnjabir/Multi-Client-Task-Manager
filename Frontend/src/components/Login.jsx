import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import useSound from "use-sound";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "./Header";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [playSuccessSound] = useSound("/sounds/success.mp3", { volume: 0.5 });
  const [playErrorSound] = useSound("/sounds/error1.mp3", { volume: 0.5 });
  const [error, setError] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      toast.info("You are already logged in. Redirecting to your profile...", {
        autoClose: 3000,
        pauseOnHover: false,
        onClose: () => navigate("/profile", { replace: true }),
      });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/token/", credentials);
      const { access, refresh } = response.data;

      const userResponse = await axios.get("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      const user = userResponse.data;

      localStorage.setItem("access-token", access);
      localStorage.setItem("refresh-token", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch(setUser({ token: access, user, isAuthenticated: true }));

      const toastId = toast.success("Login Successful! Redirecting to Dashboard...", { autoClose: 3000 });
      playSuccessSound();

      setTimeout(() => {
        toast.update(toastId, {
          render: "Redirecting to Dashboard...",
          type: "success",
          autoClose: false,
        });

        navigate("/profile");
      }, 2000);
    } catch (error) {
      toast.error("Invalid credentials. Please try again.", { onOpen: playErrorSound, autoClose: 2500 });
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ToastContainer />
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
          <p className="text-center mt-4 text-sm">
            Don't have an account? <a href="/register" className="text-blue-500">Register here</a>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;