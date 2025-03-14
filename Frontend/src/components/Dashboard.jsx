import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setTasks, updateTask } from "../slices/taskSlice";

const TaskForm = ({ taskToEdit, onCancel }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  // Populate form fields if editing a task
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, status };

    try {
      if (taskToEdit) {
        // **UPDATE TASK (PUT/PATCH request)**
        const response = await axios.patch(
          `http://localhost:8000/api/tasks/${taskToEdit.id}/`,
          taskData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        );

        // Dispatch action to update Redux state
        dispatch(updateTask(response.data));
      } else {
        // **CREATE NEW TASK**
        const response = await axios.post(
          "http://localhost:8000/api/tasks/",
          taskData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access-token")}`,
            },
          }
        );

        // Fetch updated task list
        dispatch(setTasks(response.data));
      }
      
      onCancel(); // Close form after success
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-lg">
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
  );
};

export default TaskForm;
