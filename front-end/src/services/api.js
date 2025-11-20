import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// API functions
export const getTodos = (page = 1, limit = 10) => {
  return api.get(`/todos?page=${page}&limit=${limit}`);
};

export const createTodo = (todoData) => {
  return api.post('/todos', todoData);
};

export const updateTodo = (id, todoData) => {
  return api.put(`/todos/${id}`, todoData);
};

export const deleteTodo = (id) => {
  return api.delete(`/todos/${id}`);
};

export default api;

