import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { ArrowLeft, Bold, Italic, Link2, List, ListOrdered, Code, Quote, Image, Eye, EyeOff, Save, Send, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar'
import { adminArticleAPI, mockData } from '../services/api'

marked.setOptions({
  breaks: true,
  gfm: true,
})

const defaultContent = `## 开始写作

在这里输入您的文章内容，支持 Markdown 语法。

### 常用语法

- **粗体文字** 使用 \`**文字**\`
- *斜体文字* 使用 \`*文字*\`
- [链接文字](https://example.com) 使用 \`[文字](url)\`
- 代码块使用三个反引号包围

> 引用块使用 > 开头

1. 有序列表项
2. 第二项

| 标题 | 描述 |
|------|------|
| 内容 | 示例 |

---

祝您写作愉快！
`

const categories = ['技术', '随笔', '教程', '生活', 'AI', '其他']

function ArticleEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id

  const textareaRef = useRef(null)
  const lineGutterRef = useRef(null)
  const editorRef = useRef(null)
  const previewRef = useRef(null)

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [mobileView, setMobileView] = useState('split')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState(defaultContent)
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('技术')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [cover, setCover] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [allowComments, setAllowComments] = useState(true)
  const [publishedAt, setPublishedAt] = useState('')
  const [showPreview, setShowPreview] = useState(true)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [wordCount, setWordCount] = useState(0)
  const [readTime, setReadTime] = useState(0)

  const [unsavedChanges, setUnsavedChanges] = useState(false)

  useEffect(() => {
    const words = content.replace(/\s/g, '').length
    setWordCount(words)
    setReadTime(Math.max(1, Math.ceil(words / 300)))
  }, [content])

  useEffect(() => {
    if (isEdit) {
      const article = mockData.articles.find(a => a.id === parseInt(id))
      if (article) {
        setTitle(article.title)
        setSlug(article.slug)
        setContent(article.content || defaultContent)
        setSummary(article.summary || '')
        setCategory(article.category || '技术')
        setTags(article.tags ? article.tags.split(',').map(t => t.trim()) : [])
        setCover(article.cover || '')
        setIsPinned(article.is_pinned || false)
        setAllowComments(article.allow_comments !== false)
        setPublishedAt(article.published_at ? article.published_at.split('T')[0] : '')
      }
      setLoading(false)
    }
  }, [id, isEdit])

  useEffect(() => {
    if (!isEdit && title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }, [title, slug, isEdit])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [unsavedChanges])

  const insertMarkdown = (before, after = '', placeholder = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const textToInsert = selectedText || placeholder
    const newContent = content.substring(0, start) + before + textToInsert + after + content.substring(end)
    setContent(newContent)
    setUnsavedChanges(true)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleInputChange = (e) => {
    setContent(e.target.value)
    setUnsavedChanges(true)
    updateLineNumbers(e.target)
  }

  const updateLineNumbers = (el) => {
    if (!el || !lineGutterRef.current) return
    const lines = el.value.split('\n').length
    const gutterContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n')
    lineGutterRef.current.textContent = gutterContent
  }

  useEffect(() => {
    if (textareaRef.current) {
      updateLineNumbers(textareaRef.current)
    }
  }, [content])

  const handleScroll = (e) => {
    if (lineGutterRef.current) {
      lineGutterRef.current.scrollTop = e.target.scrollTop
    }
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim()
      if (!tags.includes(newTag) && tags.length < 10) {
        setTags([...tags, newTag])
        setUnsavedChanges(true)
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove))
    setUnsavedChanges(true)
  }

  const getFormData = () => ({
    title,
    slug: slug || title.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, ''),
    content,
    summary: summary || content.replace(/[#*`>\[\]()\-_!]/g, '').slice(0, 200),
    category,
    tags: tags.join(','),
    cover,
    is_pinned: isPinned,
    allow_comments: allowComments,
    word_count: wordCount,
    read_time: readTime,
  })

  const handleSave = async (status = 0) => {
    if (!title.trim()) {
      alert('请输入文章标题')
      return
    }
    setSaving(true)
    const data = getFormData()
    data.status = status

    try {
      if (isEdit) {
        await adminArticleAPI.update(id, data)
      } else {
        await adminArticleAPI.create(data)
      }
      setUnsavedChanges(false)
      if (status === 1) {
        navigate('/admin/articles')
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const renderMarkdown = (text) => {
    try {
      return marked.parse(text)
    } catch {
      return text
    }
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**', '粗体文字'), title: '粗体' },
    { icon: Italic, action: () => insertMarkdown('*', '*', '斜体文字'), title: '斜体' },
    { icon: Link2, action: () => insertMarkdown('[', '](https://)', '链接文字'), title: '链接' },
    { divider: true },
    { icon: List, action: () => insertMarkdown('- ', '', '列表项'), title: '无序列表' },
    { icon: ListOrdered, action: () => insertMarkdown('1. ', '', '列表项'), title: '有序列表' },
    { icon: Quote, action: () => insertMarkdown('> ', '', '引用内容'), title: '引用' },
    { icon: Code, action: () => insertMarkdown('\n```\n', '\n```\n', '代码'), title: '代码块' },
    { icon: Image, action: () => insertMarkdown('![', '](https://)', '图片描述'), title: '图片' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-cream overflow-hidden">
      <AdminNavbar />

      <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 border-b border-warm-border bg-white shrink-0">
        <button
          onClick={() => {
            if (unsavedChanges && !confirm('有未保存的更改，确定要离开吗？')) return
            navigate('/admin/articles')
          }}
          className="p-2 rounded-lg text-muted-foreground transition-colors hover:bg-cream-dark shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            placeholder="输入文章标题..."
            className="w-full bg-transparent text-lg sm:text-xl font-serif font-bold outline-none text-brown-dark placeholder:text-muted-foreground/50"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setUnsavedChanges(true) }}
          />
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button className="bulk-action-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="文章设置">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">设置</span>
          </button>
          <div className="w-px h-5 bg-warm-border mx-1"></div>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-cream-dark whitespace-nowrap disabled:opacity-50"
            onClick={() => handleSave(0)}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            <span>保存草稿</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-amber transition-opacity hover:opacity-90 whitespace-nowrap disabled:opacity-50"
            onClick={() => handleSave(1)}
            disabled={saving}
          >
            <Send className="w-4 h-4" />
            <span>发布</span>
          </button>
        </div>
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground transition-colors hover:bg-cream-dark"
          onClick={() => setMobileView(mobileView === 'split' ? 'editor' : mobileView === 'editor' ? 'preview' : 'split')}
        >
          {mobileView === 'preview' ? <Code className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </header>

      <div className="hidden md:flex items-center gap-0.5 px-2 sm:px-4 py-2 border-b border-warm-border bg-white shrink-0 overflow-x-auto no-scrollbar">
        {toolbarButtons.map((btn, idx) =>
          btn.divider ? (
            <div key={idx} className="toolbar-divider" />
          ) : (
            <button
              key={idx}
              className="editor-tool-btn"
              title={btn.title}
              onClick={btn.action}
            >
              <btn.icon className="w-4 h-4" />
            </button>
          )
        )}
        <div className="flex-1"></div>
        <button
          className={`editor-tool-btn ${showPreview ? 'active' : ''}`}
          onClick={() => setShowPreview(!showPreview)}
          title="预览"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={`flex-1 flex min-w-0 ${mobileView === 'preview' ? 'hidden md:flex' : ''}`}>
          <div className="flex-1 flex flex-col min-w-0" ref={editorRef}>
            <div className="flex-1 flex min-h-0 overflow-hidden">
              <div
                ref={lineGutterRef}
                className="line-gutter overflow-hidden bg-code-sidebar"
                style={{ lineHeight: '1.7', paddingTop: '1rem', paddingBottom: '1rem' }}
              >
                1
              </div>
              <div className="flex-1 overflow-hidden">
                <textarea
                  ref={textareaRef}
                  className="md-textarea"
                  value={content}
                  onChange={handleInputChange}
                  onScroll={handleScroll}
                  placeholder="在这里开始写作，支持 Markdown 语法..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        </div>

        {showPreview && (mobileView === 'split' || mobileView === 'preview') && (
          <div className={`${mobileView === 'editor' ? 'hidden' : 'flex'} flex-col md:w-[420px] lg:w-[480px] border-l border-warm-border bg-white overflow-hidden`} ref={previewRef}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-warm-border shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber" />
                <span className="text-sm font-semibold text-brown-dark">预览</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {wordCount} 字 · {readTime} 分钟阅读
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {title && (
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown-dark mb-4 leading-tight">
                  {title}
                </h1>
              )}
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          </div>
        )}

        <div className={`fixed md:relative inset-y-0 right-0 w-80 max-w-[85vw] bg-white border-l border-warm-border z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:border-l-0 md:overflow-hidden'}`}>
          <div className="flex items-center justify-between p-4 border-b border-warm-border shrink-0">
            <h3 className="font-semibold text-brown-dark">文章设置</h3>
            <button
              className="p-1.5 rounded-lg text-muted-foreground transition-colors hover:bg-cream-dark md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-muted-foreground">URL 别名</label>
              <input
                type="text"
                className="sidebar-input"
                placeholder="自动生成"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setUnsavedChanges(true) }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-muted-foreground">分类</label>
              <select
                className="sidebar-input cursor-pointer"
                value={category}
                onChange={(e) => { setCategory(e.target.value); setUnsavedChanges(true) }}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237A6655' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem', appearance: 'none' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-muted-foreground">标签</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="tag-pill">
                    {tag}
                    <button className="ml-0.5 hover:text-red-diff transition-colors" onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="sidebar-input"
                placeholder="输入标签按回车添加"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-muted-foreground">摘要</label>
              <textarea
                className="sidebar-input resize-none"
                rows={3}
                placeholder="文章摘要（自动生成）"
                value={summary}
                onChange={(e) => { setSummary(e.target.value); setUnsavedChanges(true) }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-muted-foreground">封面图片 URL</label>
              <input
                type="text"
                className="sidebar-input"
                placeholder="https://..."
                value={cover}
                onChange={(e) => { setCover(e.target.value); setUnsavedChanges(true) }}
              />
              {cover && (
                <img src={cover} alt="封面预览" className="mt-2 w-full h-32 object-cover rounded-lg border border-warm-border" onError={(e) => { e.target.style.display = 'none' }} />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-muted-foreground">发布时间</label>
              <input
                type="date"
                className="sidebar-input"
                value={publishedAt}
                onChange={(e) => { setPublishedAt(e.target.value); setUnsavedChanges(true) }}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-amber"
                  checked={isPinned}
                  onChange={(e) => { setIsPinned(e.target.checked); setUnsavedChanges(true) }}
                />
                <span className="text-sm text-brown-dark">置顶文章</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-amber"
                  checked={allowComments}
                  onChange={(e) => { setAllowComments(e.target.checked); setUnsavedChanges(true) }}
                />
                <span className="text-sm text-brown-dark">允许评论</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between px-4 py-2 border-t border-warm-border bg-white text-xs text-muted-foreground shrink-0">
        <div className="flex items-center gap-4">
          <span>{wordCount} 字</span>
          <span>{readTime} 分钟阅读</span>
          {unsavedChanges && <span className="text-amber-dark">● 未保存</span>}
        </div>
        <div className="flex items-center gap-2">
          <span>Markdown</span>
          <ChevronRight className="w-4 h-4" />
          <span>实时预览</span>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-around py-2 border-t border-warm-border bg-white shrink-0">
        <button
          className="flex flex-col items-center gap-1 px-4 py-1 text-muted-foreground"
          onClick={() => handleSave(0)}
          disabled={saving}
        >
          <Save className="w-5 h-5" />
          <span className="text-xs">保存草稿</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 px-4 py-1 text-muted-foreground"
          onClick={() => setSidebarOpen(true)}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs">设置</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 px-6 py-1 rounded-lg bg-amber text-white"
          onClick={() => handleSave(1)}
          disabled={saving}
        >
          <Send className="w-5 h-5" />
          <span className="text-xs">发布</span>
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default ArticleEditor
