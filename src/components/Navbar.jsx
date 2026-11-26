
import { useState } from 'react'
import { Menu, Search, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTasks } from '../context/TaskContext'
import { useNavigate } from 'react-router-dom'

function Navbar({ setOpen }) {
  const { user, logout } = useAuth()
  const { searchTerm, setSearchTerm } = useTasks()
  const navigate = useNavigate()

  const [search, setSearch] = useState(searchTerm)

  const avatar = user?.user_metadata?.avatar_url

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    setSearchTerm(value)

    if (value.trim()) {
      navigate('/tasks')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setSearch('')
      setSearchTerm('')
      navigate('/register', { replace: true })
    } catch (error) {
      alert(error.message)
    }
  }

  const userName = user?.user_metadata?.full_name || user?.email || 'User'

  return (
    <nav className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8">

      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-gray-700"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-xl font-bold text-blue-600">
          TaskFlow
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/tasks')
        }}
        className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64"
      >
        <Search size={18} className="text-gray-500" />

        <input
          type="search"
          value={search}
          onChange={handleSearch}
          placeholder="Search tasks..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
      </form>

      <div className="flex items-center gap-3">
        <Bell className="text-gray-600 cursor-pointer" />

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/profile')}
            title="View Profile"
            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-blue-600" />
            )}
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="hidden sm:block font-medium text-sm max-w-32 truncate"
          >
            {userName}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>

    </nav>
  )
}

export default Navbar
