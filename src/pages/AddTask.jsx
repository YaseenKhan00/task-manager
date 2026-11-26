
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'

function AddTask() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addTask, updateTask } = useTasks()

  const editingTask = location.state

  const [task, setTask] = useState({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    priority: editingTask?.priority || 'Medium',
    dueDate: editingTask?.due_date || editingTask?.dueDate || '',
    status: editingTask?.status || 'Pending'
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (editingTask) {
        await updateTask({ ...editingTask, ...task })
      } else {
        await addTask(task)
      }

      navigate('/tasks')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {editingTask ? 'Edit Task' : 'Add New Task'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-sm space-y-5">

        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div>
          <label className="block font-medium mb-2">Task Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
            placeholder="Enter task title"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            rows="4"
            placeholder="Enter description"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <label className="block font-medium mb-2">Priority</label>
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg"
          >
            {loading
              ? 'Saving...'
              : editingTask ? 'Update Task' : 'Create Task'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="bg-gray-100 px-6 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTask
