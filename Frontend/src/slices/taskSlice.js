import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "../services/taskService";

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};


export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, { rejectWithValue }) => {
  try {
    return await taskService.getTasks();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createTask = createAsyncThunk("tasks/createTask", async (taskData, { rejectWithValue }) => {
  try {
    return await taskService.addTask(taskData);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const editTask = createAsyncThunk("tasks/editTask", async ({ taskId, taskData }, { rejectWithValue }) => {
  try {
    return await taskService.updateTask(taskId, taskData);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeTask = createAsyncThunk("tasks/removeTask", async (taskId, { rejectWithValue }) => {
  try {
    await taskService.deleteTask(taskId);
    return taskId;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export default taskSlice.reducer;