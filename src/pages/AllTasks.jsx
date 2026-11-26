
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Pencil, CheckCircle, X } from 'lucide-react'
import { useTasks } from '../context/TaskContext'

function AllTasks() {
  const navigate = useNavigate()

  const {
    tasks,
    loading,
    deleteTask,
    toggleTask,
    searchTerm,
    setSearchTerm
  } = useTasks()

  const [filter, setFilter] = useState('All')
  const [error, setError] = useState('')

  const filteredTasks = tasks.filter(task => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      (task.description || '').toLowerCase().includes(search)

    const matchesFilter =
      filter === 'All' || task.status === filter

    return matchesSearch && matchesFilter
  })

  const handleToggle = async (id) => {
    try {
      setError('')
      await toggleTask(id)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return

    try {
      setError('')
      await deleteTask(id)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">All Tasks</h1>
          <p className="text-gray-500 mt-2">
            Manage and search your tasks here.
          </p>
        </div>

        <button
          onClick={() => navigate('/add-task')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          + Add New Task
        </button>
      </div>

      {error && (
        <p className="bg-red-100 text-red-600 p-3 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">

        <div className="flex items-center gap-2 bg-white border rounded-lg px-3 flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full p-3 outline-none"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-gray-500"
              title="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-white border rounded-lg p-3"
        >
          <option value="All">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-10 text-center">
          Loading tasks...
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center">
              <h2 className="text-xl font-semibold">No Tasks Found</h2>
              <p className="text-gray-500 mt-2">
                Try another search or add a new task.
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="bg-white p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >

                <div className="flex-1 min-w-0">
                  <h2 className={`text-lg font-bold ${
                    task.status === 'Completed'
                      ? 'line-through text-gray-400'
                      : 'text-gray-800'
                  }`}>
                    {task.title}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                      {task.status}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {task.priority}
                    </span>

                    {task.due_date && (
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                        {task.due_date}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(task.id)}
                    className="p-2 bg-green-100 text-green-600 rounded-lg"
                    title="Complete task"
                  >
                    <CheckCircle size={19} />
                  </button>

                  <button
                    onClick={() => navigate('/add-task', { state: task })}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                    title="Edit task"
                  >
                    <Pencil size={19} />
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg"
                    title="Delete task"
                  >
                    <Trash2 size={19} />
                  </button>
                </div>

              </div>
            ))
          )}

        </div>
      )}

    </div>
  )
}

export default AllTasks
