import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, editTask } from "../slices/taskSlice";

const TaskForm = ({ taskToEdit, onCancel }) => {
  const dispatch = useDispatch();
  const [task, setTask] = useState({
    title: taskToEdit?.title || "",
    description: taskToEdit?.description || "",
    status: taskToEdit?.status || "pending",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    taskToEdit
      ? dispatch(editTask({ taskId: taskToEdit.id, taskData: task }))
      : dispatch(createTask(task));
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">{taskToEdit ? "Edit Task" : "Add New Task"}</h2>
      <input type="text" name="title" value={task.title} onChange={handleChange} required className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Task Title" />
      <textarea name="description" value={task.description} onChange={handleChange} className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Task Description" />
      <select name="status" value={task.status} onChange={handleChange} className="w-full p-3 mb-5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <div className="flex justify-between gap-4">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md transition duration-300 hover:bg-blue-700">{taskToEdit ? "Update Task" : "Add Task"}</button>
        <button type="button" onClick={onCancel} className="text-red-500 px-6 py-2 rounded-md hover:text-red-600 transition duration-300">Cancel</button>
      </div>
    </form>
  );
};

export default TaskForm;