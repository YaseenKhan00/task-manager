
function TaskCard({ task, onDelete, onToggle, onEdit }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex-1">
        <h2 className={`text-lg font-bold ${
          task.status === 'Completed'
            ? 'line-through text-gray-400'
            : 'text-gray-800'
        }`}>
          {task.title}
        </h2>

        <p className="text-gray-500 text-sm mt-2">
          {task.description}
        </p>

        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
            {task.status}
          </span>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
            {task.priority}
          </span>

          {task.due_date && (
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
              {task.due_date}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 items-start">
        <button onClick={onToggle} className="bg-green-100 text-green-600 p-2 rounded-lg">
          Complete
        </button>

        <button onClick={onEdit} className="bg-blue-100 text-blue-600 p-2 rounded-lg">
          Edit
        </button>

        <button onClick={onDelete} className="bg-red-100 text-red-600 p-2 rounded-lg">
          Delete
        </button>
      </div>
    </div>
  )
}

export default TaskCard
