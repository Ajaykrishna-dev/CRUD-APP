import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, setCurrentPage } from '../store/todoSlice';
import TodoItem from './TodoItem';
import LoadingSpinner from './LoadingSpinner';
import Pagination from './Pagination';

const TodoList = () => {
  const dispatch = useDispatch();
  const { items, loading, error, currentPage, limit, totalPages, totalTodos } =
    useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  if (loading && items.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Todos ({totalTodos})
        </h2>
      </div>
      {items.length === 0 ? (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">No todos found. Create your first todo!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((todo) => (
              <TodoItem key={todo._id} todo={todo} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => dispatch(setCurrentPage(page))}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TodoList;

