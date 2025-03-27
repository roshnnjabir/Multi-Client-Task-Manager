import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import api from "../../services/authService";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    api
      .get("/admindashboard/",  {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error("Error:", err));
  }, [user, token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
  <>
    <Header />
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Admin Dashboard</h1>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
          <Link to={`/admin/userTasks/${user.id}`} key={user.id}>
            <div
              key={user.id}
              className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <div className="flex-shrink-0">
                <img
                  src={
                    user.profile_image
                      ? `${API_BASE_URL}${user.profile_image}`
                      : "https://i.pravatar.cc/150?img=2"
                  }
                  alt={`${user.name}'s profile`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-medium text-gray-900">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  {user.is_staff ? "Admin" : "User"}
                </p>
              </div>
            </div>
          </Link>
          ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>

      <div className="mt-8 flex justify-center space-x-4 items-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow-md disabled:bg-gray-300 disabled:text-gray-400 hover:bg-indigo-700 transition"
        >
          Previous
        </button>
        <span className="text-lg text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-6 py-2 text-white bg-indigo-600 rounded-lg shadow-md disabled:bg-gray-300 disabled:text-gray-400 hover:bg-indigo-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  </>
  );
};

export default AdminDashboard;
