import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react'

function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('codewalker_admin_auth', 'authenticated')
        localStorage.setItem('codewalker_admin_user', username)
        localStorage.setItem('codewalker_admin_login_time', Date.now().toString())
        navigate('/admin/articles')
      } else {
        setError('用户名或密码错误（默认: admin / admin123）')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xlarge bg-gradient-to-br from-amber to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brown-dark mb-2">管理后台</h1>
          <p className="text-muted-foreground">CodeWalker 博客管理系统</p>
        </div>

        <div className="card p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-brown-dark mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full pl-10 pr-4 py-3 rounded-medium border border-warm-border bg-cream text-brown-dark placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-dark mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-10 pr-12 py-3 rounded-medium border border-warm-border bg-cream text-brown-dark placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-brown-dark transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-medium bg-red-bg border border-red-diff/30 text-red-diff text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full btn-primary py-3 text-base justify-center disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  登录中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  登录
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-warm-border">
            <p className="text-center text-xs text-muted-foreground">
              默认账号：<code className="px-1.5 py-0.5 bg-cream rounded text-primary font-mono">admin</code> / <code className="px-1.5 py-0.5 bg-cream rounded text-primary font-mono">admin123</code>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← 返回博客首页
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
