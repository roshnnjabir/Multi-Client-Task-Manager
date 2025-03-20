import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSound from "use-sound";
import axios from "axios";
import { setTasks, updateTask } from "../slices/taskSlice";
import { ToastContainer, toast } from 'react-toastify';
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const TaskForm = ({ taskToEdit, onCancel }) => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [playErrorSound] = useSound('/sounds/error1.mp3')

  useEffect(() => {
    if (!auth.isAuthenticated) {
      toast.error("Please Login before moving forward!", {onOpen:() => playErrorSound(), onClose: () => navigate("/login", { replace: true }), autoClose:1500});
    }
  }, [auth.isAuthenticated, navigate])

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, status };

    try {
      if (taskToEdit) {
        const response = await axios.patch(
          `http://localhost:8000/api/tasks/${taskToEdit.id}/`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        );

        dispatch(updateTask(response.data));
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/tasks/",
          taskData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        );

        dispatch(setTasks(response.data));
      }
      
      onCancel();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  if (!auth.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ToastContainer/>
        <p className="text-xl text-gray-600">No user logged in</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-lg">
        <ToastContainer/>
        <h2 className="text-xl font-bold mb-4">
          {taskToEdit ? "Edit Task" : "Create Task"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <div className="flex gap-2">
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            {taskToEdit ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default TaskForm;
