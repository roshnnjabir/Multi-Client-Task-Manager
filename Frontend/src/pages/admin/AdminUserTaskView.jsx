import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../services/authService";
import { useSelector } from "react-redux";

const UserTasks = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/adminusertasks/${id}`, { headers: { Authorization: `Bearer ${token}` }})
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching tasks.");
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <Header />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">User Tasks</h1>

        {loading && <p>Loading tasks...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                <div className="flex-grow">
                  <h3 className="text-xl font-medium text-gray-900">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                  <p
                    className={`text-sm font-medium ${task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}
                  >
                    {task.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No tasks found for this user.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserTasks;
