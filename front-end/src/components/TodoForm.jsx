import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, editTodo, clearError } from '../store/todoSlice';
import { fetchTodos } from '../store/todoSlice';

const TodoForm = ({ editingTodo, setEditingTodo }) => {
  const dispatch = useDispatch();
  const { loading, currentPage, limit } = useSelector((state) => state.todos);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setError('');
    dispatch(clearError());
  }, [editingTodo, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      if (editingTodo) {
        await dispatch(
          editTodo({
            id: editingTodo._id,
            todoData: {
              title: title.trim(),
              description: description.trim(),
            },
          })
        ).unwrap();
        setEditingTodo(null);
      } else {
        await dispatch(
          addTodo({
            title: title.trim(),
            description: description.trim(),
          })
        ).unwrap();
        // Refetch todos to show the new todo and handle pagination
        dispatch(fetchTodos({ page: currentPage, limit }));
      }
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err || 'Failed to save todo');
    }
  };

  const handleCancel = () => {
    setEditingTodo(null);
    setTitle('');
    setDescription('');
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {editingTodo ? 'Edit Todo' : 'Create New Todo'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter todo title"
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter todo description (optional)"
            disabled={loading}
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : editingTodo ? 'Update Todo' : 'Create Todo'}
          </button>
          {editingTodo && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TodoForm;

