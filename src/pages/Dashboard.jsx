
import { CheckCircle, Clock, ListTodo, TrendingUp } from 'lucide-react'
import { useTasks } from '../context/TaskContext'
import StatsCard from '../components/StatsCard'

function Dashboard() {
  const { tasks, loading } = useTasks()

  const total = tasks.length
  const completed = tasks.filter(task => task.status === 'Completed').length
  const pending = tasks.filter(task => task.status === 'Pending').length
  const progress = total - completed - pending

  const completionPercentage = total === 0
    ? 0
    : Math.round((completed / total) * 100)

  const stats = [
    {
      title: 'Total Tasks',
      value: total,
      icon: <ListTodo size={25} />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Completed',
      value: completed,
      icon: <CheckCircle size={25} />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pending',
      value: pending,
      icon: <Clock size={25} />,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'In Progress',
      value: progress,
      icon: <TrendingUp size={25} />,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  if (loading) {
    return <div className="p-10 text-center">Loading Dashboard...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back! Here is your task overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map(item => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-5">
          Task Progress
        </h2>

        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Overall Completion</span>
          <span className="font-bold text-blue-600">
            {completionPercentage}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-5">Priority Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['High', 'Medium', 'Low'].map(priority => {
            const count = tasks.filter(
              task => task.priority === priority
            ).length

            return (
              <div key={priority} className="border rounded-xl p-4">
                <h3 className="font-semibold">{priority} Priority</h3>
                <p className="text-3xl font-bold mt-2">{count}</p>
                <p className="text-sm text-gray-500">Tasks</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-5">Recent Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks available yet.</p>
        ) : (
          tasks.slice(0, 5).map(task => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row sm:justify-between gap-2 border-b py-4"
            >
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-500">
                  {task.description}
                </p>
              </div>

              <span className="text-sm text-blue-600">
                {task.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
