import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, ChevronDown, Moon, Sun, LogOut, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function AdminNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [showDropdown, setShowDropdown] = useState(false)
  const [username, setUsername] = useState('admin')

  useEffect(() => {
    const user = localStorage.getItem('codewalker_admin_user')
    if (user) setUsername(user)
  }, [])

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      localStorage.removeItem('codewalker_admin_auth')
      localStorage.removeItem('codewalker_admin_user')
      localStorage.removeItem('codewalker_admin_login_time')
      navigate('/admin/login')
    }
  }

  return (
    <nav className="w-full bg-card border-b-2 border-primary shrink-0 relative z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/admin/articles" className="text-lg font-bold truncate font-serif text-brown-dark hover:opacity-80 transition-opacity">
            码上行
          </Link>
          <Lock className="w-4 h-4 shrink-0 text-primary" />
          <span className="text-sm font-medium whitespace-nowrap hidden sm:inline text-muted-foreground">
            管理后台
          </span>
          <span className="text-sm font-medium whitespace-nowrap sm:hidden text-muted-foreground">
            后台
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            to="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:opacity-80 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            返回博客
          </Link>
          <Link
            to="/blog"
            className="sm:hidden shrink-0 text-muted-foreground"
            title="返回博客"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 hidden sm:block bg-warm-border"></div>

          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted text-muted-foreground"
            aria-label="切换深色模式"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="w-px h-6 hidden sm:block bg-warm-border"></div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 min-w-0 p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium truncate hidden sm:inline">{username}</span>
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 hidden sm:block text-muted-foreground transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 card bg-white py-2 shadow-lg z-20">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{username}</p>
                    <p className="text-xs text-muted-foreground">管理员</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-diff hover:bg-red-bg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
