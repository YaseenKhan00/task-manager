
function TaskForm({ task, setTask, onSubmit, loading, isEditing }) {
  const handleChange = (e) => {
    setTask({
      ...task,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-5">
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
          className="w-full border rounded-lg p-3"
          placeholder="Enter description"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Priority</label>
        <select
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-2">Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  )
}

export default TaskForm
