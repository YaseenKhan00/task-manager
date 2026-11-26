
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './AuthContext'

const TaskContext = createContext()

export function TaskProvider({ children }) {
  const { user } = useAuth()

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let active = true

    const fetchTasks = async () => {
      if (!user) {
        setTasks([])
        setLoading(false)
        return
      }

      setLoading(true)

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        console.error('Tasks loading error:', error.message)
        setTasks([])
      } else {
        setTasks(data || [])
      }

      setLoading(false)
    }

    fetchTasks()

    return () => {
      active = false
    }
  }, [user])

  const addTask = async (task) => {
    if (!user) throw new Error('Please login first')

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: user.id,
        title: task.title,
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        due_date: task.due_date || task.dueDate || null
      }])
      .select()
      .single()

    if (error) throw error

    setTasks(prev => [data, ...prev])
    return data
  }

  const updateTask = async (updatedTask) => {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: updatedTask.title,
        description: updatedTask.description || '',
        status: updatedTask.status,
        priority: updatedTask.priority,
        due_date: updatedTask.due_date || updatedTask.dueDate || null
      })
      .eq('id', updatedTask.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    setTasks(prev => prev.map(task =>
      task.id === data.id ? data : task
    ))

    return data
  }

  const deleteTask = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const toggleTask = async (id) => {
    const task = tasks.find(item => item.id === id)
    if (!task) return

    await updateTask({
      ...task,
      status: task.status === 'Completed' ? 'Pending' : 'Completed'
    })
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      searchTerm,
      setSearchTerm,
      filteredTasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTask
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  return useContext(TaskContext)
}
