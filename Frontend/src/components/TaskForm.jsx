import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask, updateTask } from "../slices/taskSlice";
import axios from "axios";

const TaskForm = ({ taskToEdit, onCancel }) => {
  const dispatch = useDispatch();
  const [task, setTask] = useState({
    title: taskToEdit ? taskToEdit.title : "",
    description: taskToEdit ? taskToEdit.description : "",
    status: taskToEdit ? taskToEdit.status : "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, status } = task;
    const token = localStorage.getItem("access-token");

    try {
      if (taskToEdit) {
        // **UPDATE EXISTING TASK**
        const response = await axios.put(
          `http://localhost:8000/api/tasks/${taskToEdit.id}/`,
          { title, description, status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(updateTask(response.data)); // Update Redux store
      } else {
        // **CREATE NEW TASK**
        const response = await axios.post(
          "http://localhost:8000/api/tasks/",
          { title, description, status },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        dispatch(addTask(response.data)); // Add new task to Redux store
      }
      onCancel(); // Close form
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">{taskToEdit ? "Edit Task" : "Add New Task"}</h2>
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Task Title"
        required
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Task Description"
        className="w-full p-2 mb-4 border rounded"
      />
      <select
        name="status"
        value={task.status}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {taskToEdit ? "Update Task" : "Add Task"}
        </button>
        {taskToEdit && (
          <button type="button" onClick={onCancel} className="text-red-500 p-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;