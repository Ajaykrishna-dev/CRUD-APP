import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/api';

// Async thunks
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await getTodos(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await createTodo(todoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editTodo = createAsyncThunk(
  'todos/editTodo',
  async ({ id, todoData }, { rejectWithValue }) => {
    try {
      const response = await updateTodo(id, todoData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeTodo = createAsyncThunk(
  'todos/removeTodo',
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      await deleteTodo(id);
      // Refetch todos after deletion to update pagination
      const state = getState();
      const currentPage = state.todos.currentPage;
      const limit = state.todos.limit;
      dispatch(fetchTodos({ page: currentPage, limit }));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalTodos: 0,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch todos
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.currentPage = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.totalPages;
        state.totalTodos = action.payload.pagination.totalTodos;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add todo
    builder
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        // Refetch todos to get updated list with pagination
        // This will be handled by the component
        state.error = null;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Edit todo
    builder
      .addCase(editTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTodo.fulfilled, (state, action) => {
        state.loading = false;
        // Update the todo in the list
        const index = state.items.findIndex(todo => todo._id === action.payload.data._id);
        if (index !== -1) {
          state.items[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(editTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove todo
    builder
      .addCase(removeTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTodo.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(removeTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage, clearError } = todoSlice.actions;
export default todoSlice.reducer;

