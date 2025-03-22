import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSound from "use-sound";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { fetchTasks, removeTask } from "../slices/taskSlice";
import TaskForm from "../components/TaskForm";
import Header from "../components/Header";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [playErrorSound] = useSound('/sounds/error1.mp3');

  useEffect(() => {
    if (!auth.isAuthenticated) {
      toast.error("Please Login before moving forward!", {
        onOpen: playErrorSound,
        onClose: () => navigate("/login", { replace: true }),
        autoClose: 1500
      });
    } else {
      dispatch(fetchTasks());
    }
  }, [auth.isAuthenticated, dispatch, navigate]);

  const handleAddTask = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      dispatch(removeTask(taskId));
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };

  return (
    <>
      <Header />
      <div className="p-8 bg-gradient-to-r from-blue-50 to-green-50 min-h-screen">
        <ToastContainer />
        {isFormOpen && <TaskForm taskToEdit={taskToEdit} onCancel={handleCancel} />}
        <button onClick={handleAddTask} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-xl transition duration-300 mb-8">Add Task</button>
        {loading ? (
          <p className="text-gray-600 text-xl font-medium">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        ) : tasks.length === 0 ?  (
          <p className="text-gray-600 text-xl font-medium">No tasks available</p>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your Tasks:</h3>
            <div className="space-y-6">
              {tasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center p-5 border border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition duration-300">
                  <div className="flex flex-col space-y-2">
                    <p className="text-gray-900 text-xl font-semibold">{task.title}</p>
                    <p className="text-gray-700 text-base">{task.description}</p>
                    <p
                      className={`text-sm font-medium ${task.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}
                    >
                      {task.status}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleEditTask(task)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300">Edit</button>
                    <button onClick={() => handleDeleteTask(task.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
