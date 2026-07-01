import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Lock, ChevronDown, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function AdminNavbar() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="w-full bg-card border-b-2 border-primary shrink-0">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/admin" className="text-lg font-bold truncate font-serif text-brown-dark hover:opacity-80 transition-opacity">
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
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/assets/image_0_yi19x4.jpg"
              alt="管理员头像"
              className="w-8 h-8 rounded-full object-cover shrink-0 border-2 border-warm-border"
            />
            <span className="text-sm font-medium truncate hidden sm:inline">码上行</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 hidden sm:block text-muted-foreground" />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
