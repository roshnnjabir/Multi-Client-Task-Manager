import api from "./authService";

const API_URL = "http://localhost:8000/api/tasks/";

const getAuthHeader = () => {
  const token = localStorage.getItem("access-token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getTasks = async () => {
  try {
    const response = await api.get(API_URL, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error("Error fetching tasks");
  }
};

const addTask = async (taskData) => {
  try {
    const response = await api.post(API_URL, taskData, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error("Error adding task");
  }
};

const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.patch(
      `${API_URL}${taskId}/`,
      taskData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating task");
  }
};

const deleteTask = async (taskId) => {
  try {
    await api.delete(`${API_URL}${taskId}/`, getAuthHeader());
  } catch (error) {
    throw new Error("Error deleting task");
  }
};

export default {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
};