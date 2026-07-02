import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { marked } from 'marked'
import hljs from 'highlight.js'
import {
  ArrowLeft, Bold, Italic, Strikethrough, Link2, List, ListOrdered, ListChecks,
  FileCode2, Quote, Image, Table, Minus, Eye, EyeOff, Save, Send, X,
  FileText, Trash2, Clock, Type, Upload, Download, Calendar, Copy, Check
} from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar'
import { adminArticleAPI, mockData } from '../services/api'

const renderer = new marked.Renderer()
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
      <button class="copy-code-btn opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded bg-black/30 text-white/60 hover:text-white hover:bg-black/50" onclick="copyCodeBlock(this)" title="复制代码">
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

const defaultContent = `## 开始写作

在这里输入您的文章内容，支持 Markdown 语法。

### 常用语法

- **粗体文字** 使用 \`**文字**\`
- *斜体文字* 使用 \`*文字*\`
- ~~删除线~~ 使用 \`~~文字~~\`
- [链接文字](https://example.com) 使用 \`[文字](url)\`
- 代码块使用三个反引号包围

> 引用块使用 > 开头

1. 有序列表项
2. 第二项

- [ ] 任务列表未完成
- [x] 任务列表已完成

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
\`\`\`

| 标题 | 描述 |
|------|------|
| 内容 | 示例 |

---

祝您写作愉快！
`

const categories = ['分布式系统', '前端工程', 'Go语言', '开源实践', '云原生', '架构设计']

function parseFrontMatter(content) {
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/)
  if (!fmMatch) return { metadata: {}, body: content }

  const metadata = {}
  const fmContent = fmMatch[1]
  const body = fmMatch[2]

  fmContent.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':')
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim()
      let value = line.slice(colonIdx + 1).trim()
      value = value.replace(/^["']|["']$/g, '')
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
      }
      metadata[key] = value
    }
  })

  return { metadata, body }
}

function buildFrontMatter(data) {
  const lines = ['---']
  if (data.title) lines.push(`title: "${data.title.replace(/"/g, '\\"')}"`)
  if (data.slug) lines.push(`slug: "${data.slug}"`)
  if (data.category) lines.push(`category: "${data.category}"`)
  if (data.tags && data.tags.length > 0) lines.push(`tags: [${data.tags.map(t => `"${t}"`).join(', ')}]`)
  if (data.summary) lines.push(`summary: "${data.summary.replace(/"/g, '\\"')}"`)
  if (data.cover) lines.push(`cover: "${data.cover}"`)
  if (data.is_pinned !== undefined) lines.push(`is_pinned: ${data.is_pinned}`)
  if (data.allow_comments !== undefined) lines.push(`allow_comments: ${data.allow_comments}`)
  if (data.published_at) lines.push(`date: ${data.published_at}`)
  lines.push('---')
  return lines.join('\n') + '\n\n'
}

function ArticleEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id && id !== 'new'

  const textareaRef = useRef(null)
  const lineGutterRef = useRef(null)
  const autoSaveTimerRef = useRef(null)
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [mobileView, setMobileView] = useState('split')
  const [lastSaved, setLastSaved] = useState(null)
  const [lineCount, setLineCount] = useState(1)
  const [articleId, setArticleId] = useState(null)
  const [copied, setCopied] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState(defaultContent)
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState('分布式系统')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [cover, setCover] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [allowComments, setAllowComments] = useState(true)
  const [publishedAt, setPublishedAt] = useState('')
  const [publishStatus, setPublishStatus] = useState('draft')
  const [scheduledAt, setScheduledAt] = useState('')
  const [showPreview, setShowPreview] = useState(true)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [wordCount, setWordCount] = useState(0)
  const [readTime, setReadTime] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [writingStreak, setWritingStreak] = useState(0)

  const [unsavedChanges, setUnsavedChanges] = useState(false)

  useEffect(() => {
    const words = content.replace(/\s/g, '').length
    const chars = content.length
    const lines = content.split('\n').length
    setWordCount(words)
    setCharCount(chars)
    setLineCount(lines)
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
        setCategory(article.category || '分布式系统')
        setTags(article.tags ? article.tags.split(',').map(t => t.trim()) : [])
        setCover(article.cover || '')
        setIsPinned(article.is_pinned || false)
        setAllowComments(article.allow_comments !== false)
        setPublishedAt(article.published_at ? article.published_at.split('T')[0] : '')
        setArticleId(parseInt(id))
        if (article.status === 1) {
          setPublishStatus('published')
        } else if (article.status === 2) {
          setPublishStatus('archived')
        } else {
          setPublishStatus('draft')
        }
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

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    if (unsavedChanges && title.trim() && publishStatus === 'draft') {
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave()
      }, 30000)
    }
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [content, title, unsavedChanges, publishStatus])

  useEffect(() => {
    const streak = setInterval(() => {
      setWritingStreak(s => s + 1)
    }, 60000)
    return () => clearInterval(streak)
  }, [])

  const insertMarkdown = useCallback((before, after = '', placeholder = '', block = false) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const textToInsert = selectedText || placeholder

    let insertBefore = before
    let insertAfter = after
    let cursorOffset = 0

    if (block) {
      const beforeChar = start > 0 ? content[start - 1] : '\n'
      if (beforeChar !== '\n') {
        insertBefore = '\n' + insertBefore
        cursorOffset += 1
      }
      const afterChar = end < content.length ? content[end] : '\n'
      if (afterChar !== '\n') {
        insertAfter = insertAfter + '\n'
      }
    }

    const newContent = content.substring(0, start) + insertBefore + textToInsert + insertAfter + content.substring(end)
    setContent(newContent)
    setUnsavedChanges(true)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + insertBefore.length + textToInsert.length + cursorOffset
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      updateLineNumbers(textarea)
    }, 0)
  }, [content])

  const insertHeading = () => {
    insertMarkdown('## ', '', '标题', true)
  }

  const insertStrikethrough = () => {
    insertMarkdown('~~', '~~', '删除线文字')
  }

  const insertTaskList = () => {
    insertMarkdown('- [ ] ', '', '任务项', true)
  }

  const insertInlineCode = () => {
    insertMarkdown('`', '`', '代码')
  }

  const insertCodeBlock = () => {
    insertMarkdown('\n```go\n', '\n```\n', '// 代码', false)
  }

  const insertTable = () => {
    insertMarkdown('| 列1 | 列2 | 列3 |\n|------|------|------|\n| 内容 | 内容 | 内容 |', '', '', true)
  }

  const insertHr = () => {
    insertMarkdown('\n---\n', '', '', false)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result
      if (typeof text !== 'string') return

      const { metadata, body } = parseFrontMatter(text)

      if (metadata.title) setTitle(metadata.title)
      if (metadata.slug) setSlug(metadata.slug)
      if (metadata.category && categories.includes(metadata.category)) setCategory(metadata.category)
      if (metadata.tags) {
        if (Array.isArray(metadata.tags)) setTags(metadata.tags)
        else setTags(String(metadata.tags).split(',').map(t => t.trim()))
      }
      if (metadata.summary) setSummary(metadata.summary)
      if (metadata.cover) setCover(metadata.cover)
      if (metadata.is_pinned !== undefined) setIsPinned(metadata.is_pinned === true || metadata.is_pinned === 'true')
      if (metadata.allow_comments !== undefined) setAllowComments(metadata.allow_comments !== false && metadata.allow_comments !== 'false')
      if (metadata.date) setPublishedAt(metadata.date)

      setContent(body || text)
      setUnsavedChanges(true)
      setWritingStreak(0)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleExport = () => {
    const data = getFormData()
    const fm = buildFrontMatter({
      title,
      slug,
      category,
      tags,
      summary,
      cover,
      is_pinned: isPinned,
      allow_comments: allowComments,
      published_at: publishedAt || new Date().toISOString().split('T')[0],
    })
    const exportContent = fm + content
    const blob = new Blob([exportContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug || title || 'article'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleInputChange = (e) => {
    setContent(e.target.value)
    setUnsavedChanges(true)
    updateLineNumbers(e.target)
  }

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.target
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.substring(0, start) + '    ' + content.substring(end)
      setContent(newContent)
      setUnsavedChanges(true)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }
  }

  const updateLineNumbers = (el) => {
    if (!el || !lineGutterRef.current) return
    const lines = el.value.split('\n').length
    const gutterContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n')
    lineGutterRef.current.textContent = gutterContent
    setLineCount(lines)
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

  const addExistingTag = (tag) => {
    if (!tags.includes(tag) && tags.length < 10) {
      setTags([...tags, tag])
      setUnsavedChanges(true)
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
    summary: summary || content.replace(/[#*`>\[\]()\-_!~|]/g, '').slice(0, 200),
    category,
    tags: tags.join(','),
    cover,
    is_pinned: isPinned,
    allow_comments: allowComments,
    word_count: wordCount,
    read_time: readTime,
  })

  const handleAutoSave = async () => {
    if (!title.trim()) return
    try {
      const data = getFormData()
      data.status = 0
      if (articleId) {
        await adminArticleAPI.update(articleId, data)
      } else {
        const result = await adminArticleAPI.create(data)
        if (result && result.id) {
          setArticleId(result.id)
        }
      }
      setLastSaved(new Date())
      setUnsavedChanges(false)
    } catch (e) {
      console.error('Auto save failed:', e)
    }
  }

  const handleSave = async (status = 0) => {
    if (!title.trim()) {
      alert('请输入文章标题')
      return
    }
    setSaving(true)
    const data = getFormData()
    data.status = status

    if (publishStatus === 'scheduled' && scheduledAt) {
      data.scheduled_at = scheduledAt
      data.status = 0
    }

    if (status === 1) {
      if (scheduledAt && publishStatus === 'scheduled') {
        data.published_at = scheduledAt
        data.status = 0
      } else if (publishedAt) {
        data.published_at = publishedAt
      } else {
        data.published_at = new Date().toISOString().split('T')[0]
      }
    }

    try {
      if (articleId) {
        await adminArticleAPI.update(articleId, data)
      } else {
        const result = await adminArticleAPI.create(data)
        if (result && result.id) {
          setArticleId(result.id)
        }
      }
      setLastSaved(new Date())
      setUnsavedChanges(false)
      setWritingStreak(0)
      if (status === 1 && publishStatus !== 'scheduled') {
        navigate('/admin/articles')
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!isEdit || !articleId) {
      if (confirm('确定要清空当前编辑内容吗？')) {
        setTitle('')
        setSlug('')
        setContent(defaultContent)
        setSummary('')
        setTags([])
        setCover('')
        setIsPinned(false)
        setAllowComments(true)
        setPublishedAt('')
        setScheduledAt('')
        setPublishStatus('draft')
        setUnsavedChanges(false)
        setWritingStreak(0)
      }
      return
    }
    if (confirm('确定要永久删除这篇文章吗？此操作不可撤销！')) {
      await adminArticleAPI.delete(articleId)
      navigate('/admin/articles')
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault()
            insertMarkdown('**', '**', '粗体文字')
            break
          case 'i':
            e.preventDefault()
            insertMarkdown('*', '*', '斜体文字')
            break
          case 's':
            e.preventDefault()
            handleSave(0)
            break
          case 'k':
            e.preventDefault()
            insertMarkdown('[', '](https://)', '链接文字')
            break
          case 'o':
            e.preventDefault()
            fileInputRef.current?.click()
            break
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [insertMarkdown, content, title])

  const renderMarkdown = (text) => {
    try {
      return marked.parse(text)
    } catch {
      return text
    }
  }

  const existingTags = ['Go', 'Kubernetes', '分布式', 'React', 'TypeScript', '微服务', 'Rust', 'Docker', '并发编程', '云原生', 'gRPC', '架构设计', '开源', '性能优化', 'DevOps']
    .filter(t => !tags.includes(t))

  const formatLastSaved = () => {
    if (!lastSaved) return null
    const diff = Math.floor((new Date() - lastSaved) / 1000)
    if (diff < 60) return '刚刚自动保存'
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前自动保存`
    return lastSaved.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) + ' 保存'
  }

  const formatWritingStreak = () => {
    if (writingStreak < 1) return ''
    if (writingStreak < 60) return `${writingStreak}秒`
    return `${Math.floor(writingStreak / 60)}分${writingStreak % 60}秒`
  }

  if (loading) {
    return (
      <div className="h-screen bg-cream flex items-center justify-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-cream overflow-hidden">
      <AdminNavbar />

      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        className="hidden"
        onChange={handleImport}
      />

      <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 border-b-2 border-amber bg-white shrink-0">
        <button
          onClick={() => {
            if (unsavedChanges && !confirm('有未保存的更改，确定要离开吗？')) return
            navigate('/admin/articles')
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground shrink-0 p-2 rounded-lg hover:bg-cream-dark"
          title="返回文章管理"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">返回文章管理</span>
        </button>
        <div className="flex-1 max-w-3xl mx-2 sm:mx-4 min-w-0">
          <input
            type="text"
            placeholder="在此输入文章标题..."
            className="w-full text-center text-base sm:text-lg font-serif font-bold bg-transparent outline-none text-brown-dark placeholder:text-muted-foreground/50"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setUnsavedChanges(true) }}
            autoFocus
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-warm-border text-muted-foreground bg-transparent transition-colors hover:bg-cream-dark whitespace-nowrap"
            onClick={() => fileInputRef.current?.click()}
            title="导入Markdown (Ctrl+O)"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>导入</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-warm-border text-muted-foreground bg-transparent transition-colors hover:bg-cream-dark whitespace-nowrap"
            onClick={handleExport}
            title="导出Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出</span>
          </button>
        </div>
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-warm-border text-brown-light bg-transparent transition-colors hover:bg-cream-dark whitespace-nowrap disabled:opacity-50"
            onClick={() => handleSave(0)}
            disabled={saving}
            title="保存草稿 (Ctrl+S)"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">保存草稿</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-amber transition-opacity hover:opacity-90 whitespace-nowrap disabled:opacity-50"
            onClick={() => handleSave(publishStatus === 'scheduled' ? 0 : 1)}
            disabled={saving}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{publishStatus === 'scheduled' ? '定时' : '发布'}</span>
          </button>
        </div>
      </header>

      <div className="hidden md:flex items-center gap-0.5 px-2 sm:px-3 py-1.5 border-b border-warm-border bg-white shrink-0 overflow-x-auto no-scrollbar">
        <button className="editor-tool-btn font-bold" title="加粗 (Ctrl+B)" onClick={() => insertMarkdown('**', '**', '粗体文字')}>B</button>
        <button className="editor-tool-btn italic" title="斜体 (Ctrl+I)" onClick={() => insertMarkdown('*', '*', '斜体文字')}>I</button>
        <button className="editor-tool-btn" title="标题" onClick={insertHeading} style={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}>H</button>
        <button className="editor-tool-btn line-through" title="删除线" onClick={insertStrikethrough}>S</button>

        <div className="toolbar-divider" />

        <button className="editor-tool-btn" title="无序列表" onClick={() => insertMarkdown('- ', '', '列表项', true)}>
          <List className="w-4 h-4" />
        </button>
        <button className="editor-tool-btn" title="有序列表" onClick={() => insertMarkdown('1. ', '', '列表项', true)}>
          <ListOrdered className="w-4 h-4" />
        </button>
        <button className="editor-tool-btn" title="任务列表" onClick={insertTaskList}>
          <ListChecks className="w-4 h-4" />
        </button>

        <div className="toolbar-divider" />

        <button className="editor-tool-btn font-mono text-xs" title="行内代码" onClick={insertInlineCode}>{'<> '}</button>
        <button className="editor-tool-btn" title="代码块" onClick={insertCodeBlock}>
          <FileCode2 className="w-4 h-4" />
        </button>
        <button className="editor-tool-btn" title="引用块" onClick={() => insertMarkdown('> ', '', '引用内容', true)}>
          <Quote className="w-4 h-4" />
        </button>

        <div className="toolbar-divider" />

        <button className="editor-tool-btn" title="链接 (Ctrl+K)" onClick={() => insertMarkdown('[', '](https://)', '链接文字')}>
          <Link2 className="w-4 h-4" />
        </button>
        <button className="editor-tool-btn" title="图片" onClick={() => insertMarkdown('![', '](https://)', '图片描述')}>
          <Image className="w-4 h-4" />
        </button>
        <button className="editor-tool-btn" title="表格" onClick={insertTable}>
          <Table className="w-4 h-4" />
        </button>

        <div className="toolbar-divider" />

        <button className="editor-tool-btn" title="分割线" onClick={insertHr}>
          <Minus className="w-4 h-4" />
        </button>

        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-1 mr-2">
          <button
            className="editor-tool-btn"
            onClick={handleCopyContent}
            title="复制Markdown"
          >
            {copied ? <Check className="w-4 h-4 text-green-diff" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <button
          className={`editor-tool-btn ${showPreview ? 'active' : ''}`}
          onClick={() => setShowPreview(!showPreview)}
          title={showPreview ? '隐藏预览' : '显示预览'}
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className={`flex-1 flex min-w-0 ${mobileView === 'preview' ? 'hidden md:flex' : ''}`}>
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 flex min-h-0 overflow-hidden">
              <div
                ref={lineGutterRef}
                className="line-gutter overflow-hidden bg-code-sidebar"
              >
                1
              </div>
              <div className="flex-1 overflow-hidden bg-code-bg">
                <textarea
                  ref={textareaRef}
                  className="md-textarea"
                  value={content}
                  onChange={handleInputChange}
                  onScroll={handleScroll}
                  onKeyDown={handleTabKey}
                  placeholder="在这里开始写作，支持 Markdown 语法..."
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        </div>

        {showPreview && (mobileView === 'split' || mobileView === 'preview') && (
          <div className={`${mobileView === 'editor' ? 'hidden' : 'flex'} flex-col md:w-[40%] min-w-[320px] lg:min-w-[400px] border-l border-warm-border bg-white overflow-hidden`}>
            <div className="flex items-center justify-between px-4 py-2 border-b border-warm-border shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">预览</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {wordCount} 字
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              {title && (
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brown-dark mb-4 leading-tight">
                  {title}
                </h1>
              )}
              <div
                className="preview-content max-w-none"
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
              <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-muted-foreground">发布状态</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="publishStatus"
                    className="w-4 h-4 accent-amber"
                    checked={publishStatus === 'draft'}
                    onChange={() => { setPublishStatus('draft'); setUnsavedChanges(true) }}
                  />
                  <span className="text-sm text-brown-dark">草稿（仅自己可见）</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="publishStatus"
                    className="w-4 h-4 accent-amber"
                    checked={publishStatus === 'published'}
                    onChange={() => { setPublishStatus('published'); setUnsavedChanges(true) }}
                  />
                  <span className="text-sm text-brown-dark">立即发布</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="publishStatus"
                    className="w-4 h-4 accent-amber"
                    checked={publishStatus === 'scheduled'}
                    onChange={() => { setPublishStatus('scheduled'); setUnsavedChanges(true) }}
                  />
                  <span className="text-sm text-brown-dark flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    定时发布
                  </span>
                </label>
              </div>
              {publishStatus === 'scheduled' && (
                <div className="mt-3">
                  <input
                    type="datetime-local"
                    className="sidebar-input"
                    value={scheduledAt}
                    onChange={(e) => { setScheduledAt(e.target.value); setUnsavedChanges(true) }}
                  />
                  <p className="text-xs mt-1 text-muted-foreground">设置后文章将在指定时间自动发布</p>
                </div>
              )}
              {publishStatus === 'published' && (
                <div className="mt-3">
                  <label className="block text-xs font-medium mb-1 text-muted-foreground">发布日期</label>
                  <input
                    type="date"
                    className="sidebar-input"
                    value={publishedAt}
                    onChange={(e) => { setPublishedAt(e.target.value); setUnsavedChanges(true) }}
                  />
                </div>
              )}
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
                className="sidebar-input mb-2"
                placeholder="输入标签按回车添加"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
              />
              {existingTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {existingTags.slice(0, 6).map(tag => (
                    <button
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-warm-gray text-muted-foreground hover:bg-amber/10 hover:text-amber-dark transition-colors"
                      onClick={() => addExistingTag(tag)}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide uppercase mb-2 text-muted-foreground">摘要</label>
              <textarea
                className="sidebar-input resize-none"
                rows={3}
                placeholder="文章摘要（自动生成）"
                value={summary}
                onChange={(e) => { setSummary(e.target.value); setUnsavedChanges(true) }}
                maxLength={200}
              />
              <div className="text-right text-xs mt-1 text-muted-foreground">{summary.length}/200</div>
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

            <div className="pt-4 border-t border-warm-border">
              <h4 className="text-xs font-bold tracking-wide uppercase mb-3 text-muted-foreground">导入/导出</h4>
              <div className="space-y-2">
                <button
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-warm-border text-brown-light bg-transparent transition-colors hover:bg-cream-dark"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4" />
                  导入 Markdown 文件
                </button>
                <button
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-warm-border text-brown-light bg-transparent transition-colors hover:bg-cream-dark"
                  onClick={handleExport}
                >
                  <Download className="w-4 h-4" />
                  导出为 Markdown
                </button>
              </div>
              <p className="text-xs mt-2 text-muted-foreground">支持 Front Matter (YAML) 自动解析</p>
            </div>

            <div className="pt-4 border-t border-warm-border">
              <h4 className="text-xs font-bold tracking-wide uppercase mb-3 text-red-diff">危险操作</h4>
              <button
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-diff border border-red-diff/30 bg-red-bg transition-colors hover:bg-red-diff hover:text-white"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                {isEdit ? '删除文章' : '清空内容'}
              </button>
              {isEdit && (
                <p className="text-xs mt-2 text-muted-foreground">删除后文章将无法恢复，请谨慎操作。</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between px-4 py-2 border-t border-warm-border bg-white text-xs shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Type className="w-3 h-3" />
            <span>{wordCount} 字</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>{charCount} 字符</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{readTime} 分钟阅读</span>
          </div>
          {writingStreak > 0 && (
            <span className="flex items-center gap-1 text-amber-dark">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-dark animate-pulse" />
              连续写作 {formatWritingStreak()}
            </span>
          )}
          {unsavedChanges ? (
            <span className="text-amber-dark flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-dark animate-pulse" />
              未保存
            </span>
          ) : lastSaved ? (
            <span className="text-green-diff flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-diff" />
              {formatLastSaved()}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Ctrl+B</span>
          <span>加粗</span>
          <span className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Ctrl+S</span>
          <span>保存</span>
          <span className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Ctrl+O</span>
          <span>导入</span>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-around py-2 border-t border-warm-border bg-white shrink-0">
        <button
          className="flex flex-col items-center gap-1 px-4 py-1 text-muted-foreground transition-colors hover:text-amber-dark"
          onClick={() => handleSave(0)}
          disabled={saving}
        >
          <Save className="w-5 h-5" />
          <span className="text-xs">保存</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 px-4 py-1 text-muted-foreground transition-colors hover:text-amber-dark"
          onClick={() => setMobileView(mobileView === 'editor' ? 'preview' : 'editor')}
        >
          {mobileView === 'preview' ? <FileCode2 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          <span className="text-xs">{mobileView === 'preview' ? '编辑' : '预览'}</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 px-4 py-1 text-muted-foreground transition-colors hover:text-amber-dark"
          onClick={() => setSidebarOpen(true)}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs">设置</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 px-6 py-1 rounded-lg bg-amber text-white transition-opacity hover:opacity-90"
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
