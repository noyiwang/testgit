import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { marked } from 'marked'
import hljs from 'highlight.js'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  Github,
  Twitter,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  Send,
  ChevronRight,
  List,
  User,
  Edit2,
  Trash2,
} from 'lucide-react'
import { mockData } from '../services/api'

const renderer = new marked.Renderer()
const headings = []
const originalHeading = renderer.heading.bind(renderer)
renderer.heading = function(text, level, raw) {
  const id = raw.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '')
  headings.push({ id, text: raw, level })
  return `<h${level} id="${id}">${text}</h${level}>`
}

const originalListitem = renderer.listitem.bind(renderer)
renderer.listitem = function(text, task, checked) {
  if (task) {
    const checkbox = `<input type="checkbox" ${checked ? 'checked' : ''} disabled onclick="return false" />`
    return `<li class="task-list-item" style="list-style:none">${checkbox}${text}</li>`
  }
  return originalListitem(text, task, checked)
}

renderer.code = function(code, language) {
  const lang = language || 'plaintext'
  let highlighted
  try {
    highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
  } catch {
    highlighted = hljs.highlightAuto(code).value
  }
  const langLabel = lang === 'plaintext' ? 'Code' : lang
  return `<div class="code-block-wrapper relative group my-4">
    <div class="absolute top-2 right-2 flex items-center gap-2 z-10">
      <span class="text-xs px-2 py-0.5 rounded bg-black/30 text-white/60 font-mono">${langLabel}</span>
      <button class="copy-code-btn opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-black/30 text-white/60 hover:text-white hover:bg-black/50" onclick="window.copyCodeBlock(this)" title="复制代码">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      </button>
    </div>
    <pre class="!mt-0 !mb-0 !rounded-t-none"><code class="hljs language-${lang}">${highlighted}</code></pre>
  </div>`
}

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer,
})

if (typeof window !== 'undefined') {
  window.copyCodeBlock = function(btn) {
    const wrapper = btn.closest('.code-block-wrapper')
    const code = wrapper.querySelector('code')
    navigator.clipboard.writeText(code.textContent).then(() => {
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
      btn.classList.add('text-green-400')
      setTimeout(() => {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
        btn.classList.remove('text-green-400')
      }, 2000)
    })
  }
}

function generateSampleContent(article) {
  return `## 引言

这是 **${article.title}** 的详细内容。在技术博客中，我们深入探讨各种技术话题，帮助开发者成长。

> 优秀的文章不是写出来的，而是改出来的。

## 核心内容

本文将从以下几个方面展开讨论：

1. 背景与问题分析
2. 核心概念解析
3. 实战代码演示
4. 最佳实践总结

### 代码示例

下面是一个简单的示例：

\`\`\`go
package main

import (
    "fmt"
    "context"
)

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()
    
    ch := make(chan string, 1)
    go func() {
        ch <- "Hello, World!"
    }()
    
    select {
    case msg := <-ch:
        fmt.Println(msg)
    case <-ctx.Done():
        fmt.Println("Context cancelled")
    }
}
\`\`\`

### 特性列表

- [x] 支持 Markdown 渲染
- [x] 代码语法高亮
- [x] 自动目录生成
- [ ] 评论回复功能

## 总结

希望这篇文章对你有帮助。如果觉得有用，别忘了点赞收藏！

---

*感谢阅读，欢迎在评论区交流讨论。*
`
}

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [commentLikes, setCommentLikes] = useState({})
  const [articleLikes, setArticleLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [tocItems, setTocItems] = useState([])
  const articleRef = useRef(null)

  const article = useMemo(() => {
    const found = mockData.articles.find(a => a.id === parseInt(id))
    if (found) return found
    return mockData.articles[0]
  }, [id])

  const htmlContent = useMemo(() => {
    headings.length = 0
    const content = article.content || generateSampleContent(article)
    const html = marked.parse(content)
    const toc = headings.filter(h => h.level <= 3).map(h => ({
      ...h,
      indent: h.level - 2,
    }))
    return { html, toc }
  }, [article])

  useEffect(() => {
    setTocItems(htmlContent.toc)
    if (htmlContent.toc.length > 0) {
      setActiveSection(htmlContent.toc[0].id)
    }
  }, [htmlContent])

  useEffect(() => {
    setComments([
      {
        id: 1,
        author: 'tech_enthusiast',
        avatar: 'T',
        content: '写得非常清晰，学到了很多！感谢分享。',
        date: '2天前',
        likes: 12,
      },
      {
        id: 2,
        author: 'gopher_dev',
        avatar: 'G',
        content: '代码示例很实用，已经在项目中应用了。期待更多这样的深度文章！',
        date: '1天前',
        likes: 8,
      },
      {
        id: 3,
        author: 'backend_newbie',
        avatar: 'B',
        content: '作为新手，有些地方还是不太理解，能不能出个更基础的版本？',
        date: '12小时前',
        likes: 3,
      },
    ])
    setArticleLikes(Math.floor(Math.random() * 100) + 50)

    const auth = localStorage.getItem('codewalker_admin_auth')
    setIsAdmin(auth === 'authenticated')
  }, [article])

  useEffect(() => {
    const handleScroll = () => {
      if (tocItems.length === 0) return
      const scrollPosition = window.scrollY + 150

      for (let i = tocItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(tocItems[i].id)
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      })
    }
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    const newComment = {
      id: Date.now(),
      author: '访客用户',
      avatar: 'V',
      content: commentText,
      date: '刚刚',
      likes: 0,
    }
    setComments([newComment, ...comments])
    setCommentText('')
  }

  const handleCommentLike = (commentId) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + 1
    }))
  }

  const handleArticleLike = () => {
    if (isLiked) {
      setArticleLikes(articleLikes - 1)
    } else {
      setArticleLikes(articleLikes + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleDeleteArticle = () => {
    if (confirm('确定要删除这篇文章吗？')) {
      navigate('/blog')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }

  const relatedArticles = mockData.articles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-brand py-8 lg:py-10">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回博客列表
          </Link>
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Link
                to={`/admin/editor/${article.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-warm-border text-brown-light bg-transparent transition-colors hover:bg-cream-dark"
              >
                <Edit2 className="w-3.5 h-3.5" />
                编辑
              </Link>
              <button
                onClick={handleDeleteArticle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-diff border border-red-diff/30 bg-red-bg transition-colors hover:bg-red-diff hover:text-white"
              >
                <Trash2 className="w-3.5 h-3.5" />
                删除
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article ref={articleRef} className="lg:col-span-8 xl:col-span-9">
            <header className="mb-8">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-small bg-primary/10 text-primary mb-4">
                {article.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-serif text-lg font-bold">
                    码
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">码上行</div>
                    <div className="text-xs text-muted-foreground">分布式系统工程师</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.published_at) || article.created_at || '2026年6月28日'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article.read_time || Math.ceil((article.word_count || 1000) / 300)} 分钟阅读
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {article.views?.toLocaleString() || '1,234'} 阅读
                  </span>
                </div>
              </div>
            </header>

            {article.cover && (
              <div className="relative aspect-[16/9] rounded-xlarge overflow-hidden mb-10 shadow-lg">
                <img
                  src={article.cover}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
              </div>
            )}

            {article.summary && (
              <div className="bg-primary/5 border-l-4 border-primary rounded-r-large p-5 mb-8">
                <p className="text-base leading-relaxed text-foreground italic">
                  {article.summary}
                </p>
              </div>
            )}

            <div
              className="preview-content max-w-none space-y-4"
              dangerouslySetInnerHTML={{ __html: htmlContent.html }}
            />

            {article.tags && (
              <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-border">
                {article.tags.split(',').map(tag => (
                  <span key={tag.trim()} className="tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 py-8 my-8 border-y border-border">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleArticleLike}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-medium transition-all ${
                    isLiked
                      ? 'bg-red-50 text-red-500'
                      : 'bg-muted text-muted-foreground hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{isLiked ? '已点赞' : '点赞'}</span>
                  <span className="text-xs">{articleLikes}</span>
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-medium transition-all ${
                    isBookmarked
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{isBookmarked ? '已收藏' : '收藏'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">分享：</span>
                <button className="p-2 rounded-medium bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-medium bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-medium bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="card p-6 lg:p-8 bg-card mb-10">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-serif text-2xl font-bold shadow-lg">
                    码
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-serif text-xl font-bold text-foreground">码上行</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-small">
                      <User className="w-3 h-3" />
                      作者
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    分布式系统工程师，开源爱好者。专注于 Go 语言、云原生、分布式架构等领域。坚持用简洁的文字讲清复杂的技术概念。
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-primary" />
                评论 <span className="text-lg text-muted-foreground font-normal">({comments.length})</span>
              </h3>

              <form onSubmit={handleSubmitComment} className="card p-5 bg-card mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的想法..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-medium bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button type="submit" className="btn-primary" disabled={!commentText.trim()}>
                    <Send className="w-4 h-4" />
                    发表评论
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="card p-5 bg-card">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center text-primary-foreground font-semibold">
                        {comment.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-semibold text-foreground">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            {comment.likes + (commentLikes[comment.id] || 0)}
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {relatedArticles.length > 0 && (
              <div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">相关推荐</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {relatedArticles.map((art) => (
                    <Link
                      key={art.id}
                      to={`/blog/${art.id}`}
                      className="card group bg-card overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {art.cover ? (
                          <img
                            src={art.cover}
                            alt={art.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/60" />
                        )}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 bg-card/90 backdrop-blur-sm text-xs font-medium rounded-small text-foreground">
                            {art.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 p-4">
                        <h4 className="font-serif text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {art.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {art.summary}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2 border-t border-border/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(art.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {art.read_time || Math.ceil((art.word_count || 1000) / 300)} 分钟
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="hidden xl:block xl:col-span-3">
            <div className="sticky top-24 space-y-5">
              {tocItems.length > 0 && (
                <div className="card p-5 bg-card">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <List className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">目录</h3>
                  </div>
                  <nav className="space-y-0.5 max-h-[60vh] overflow-y-auto">
                    {tocItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left text-sm py-1.5 px-2 rounded-medium transition-all duration-200 flex items-center gap-2 ${
                          activeSection === item.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        style={{ paddingLeft: `${8 + item.indent * 16}px` }}
                      >
                        <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${
                          activeSection === item.id ? 'rotate-90' : ''
                        }`} />
                        <span className="truncate">{item.text}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              <div className="card p-5 bg-card">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4 pb-3 border-b border-border">
                  标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Go', 'Kubernetes', '分布式', 'React', '微服务', 'Rust', 'Docker', '云原生']
                    .filter(t => article.tags?.includes(t))
                    .concat(['Go', '并发编程', '分布式系统'].slice(0, 4))
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .slice(0, 8)
                    .map(tag => (
                      <Link
                        key={tag}
                        to={`/blog?tag=${tag}`}
                        className="inline-flex items-center px-2.5 py-1 rounded-small text-xs bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BlogDetail
