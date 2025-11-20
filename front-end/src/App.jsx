import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, clearError } from './store/todoSlice';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const dispatch = useDispatch();
  const { loading, error, currentPage, limit } = useSelector((state) => state.todos);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Todo List Application</h1>
          <p className="mt-2 text-gray-600">Manage your tasks efficiently</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Error: {error}</span>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-700 hover:text-red-900 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <TodoForm editingTodo={editingTodo} setEditingTodo={setEditingTodo} />

        {loading && <LoadingSpinner />}
        
        <TodoList />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Todo List Application - Built with React, Redux, Express & MongoDB
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

