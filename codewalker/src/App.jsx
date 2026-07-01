import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Courses from './pages/Courses'
import Projects from './pages/Projects'
import AdminLogin from './pages/AdminLogin'
import AdminArticles from './pages/AdminArticles'
import ArticleEditor from './pages/ArticleEditor'
import RequireAuth from './components/RequireAuth'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/articles" element={
          <RequireAuth>
            <AdminArticles />
          </RequireAuth>
        } />
        <Route path="/admin/editor/new" element={
          <RequireAuth>
            <ArticleEditor />
          </RequireAuth>
        } />
        <Route path="/admin/editor/:id" element={
          <RequireAuth>
            <ArticleEditor />
          </RequireAuth>
        } />
      </Routes>
    </ThemeProvider>
  )
}

export default App
