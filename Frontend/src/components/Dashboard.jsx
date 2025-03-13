import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTasks, updateTask, deleteTask } from "../slices/taskSlice";
import axios from "axios";
import TaskForm from "./TaskForm";

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch(setTasks(response.data));
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, [dispatch]);

  // Handle delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(deleteTask(id)); // Remove task from Redux state
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Handle edit task
  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Cancel task edit
  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-6">Task Dashboard</h1>
      <button
        onClick={() => setShowForm(true)}
        className="bg-green-500 text-white p-2 rounded mb-6"
      >
        Add New Task
      </button>

      {showForm && (
        <TaskForm taskToEdit={editingTask} onCancel={handleCancel} />
      )}

      <div className="space-y-4">
        {false && tasks.map((task) => (
          <div
            key={task.id}
            className="bg-gray-100 p-4 rounded-lg shadow-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <span
                className={`text-sm p-1 rounded ${
                  task.status === "Completed" ? "bg-green-200" : "bg-yellow-200"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div>
              <button
                onClick={() => handleEdit(task)}
                className="bg-blue-500 text-white p-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
