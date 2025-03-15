import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const API_BASE_URL = "http://localhost:8000/api";
  const [hovered, setHovered] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate(); 
  const handleProfileClick = () => {
    if (user) {
      navigate("/profile"); 
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="flex justify-between items-center bg-gray-900 text-white p-4 shadow-md">
      <h1 className="text-xl font-bold">My App</h1>

      {user && (
        <div
          className="relative flex items-center space-x-2 cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleProfileClick}
        >
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-12 bg-gray-800 text-white px-3 py-1 rounded-md shadow-md"
            >
              {user.name}
            </motion.div>
          )}

          <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
            <img
              src={API_BASE_URL+user.profile_image || "https://i.pravatar.cc/150?img=2"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
