import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListTodo, PlusCircle } from 'lucide-react'

function Sidebar({ open, setOpen }) {
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'All Tasks', path: '/tasks', icon: ListTodo },
    { name: 'Add Task', path: '/add-task', icon: PlusCircle },
  ]

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside className={`fixed md:static top-0 left-0 z-50 h-full md:h-auto w-64 bg-slate-900 text-white p-5 transform transition-transform duration-300 md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>

        <h2 className="text-lg font-bold mb-8">
          Menu
        </h2>

        <div className="flex flex-col gap-3">
          {links.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={20} />
                {link.name}
              </NavLink>
            )
          })}
        </div>

      </aside>
    </>
  )
}

export default Sidebar