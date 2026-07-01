import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Courses from './pages/Courses'
import Projects from './pages/Projects'
import AdminArticles from './pages/AdminArticles'
import ArticleEditor from './pages/ArticleEditor'

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
        <Route path="/admin/articles" element={<AdminArticles />} />
        <Route path="/admin/articles/new" element={<ArticleEditor />} />
        <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
