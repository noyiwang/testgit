import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, CheckCircle, Edit3, Eye, TrendingUp, Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import AdminNavbar from '../components/AdminNavbar'
import { adminArticleAPI, mockData } from '../services/api'

const statusTabs = [
  { label: '全部', value: null },
  { label: '已发布', value: 1 },
  { label: '草稿', value: 0 },
  { label: '已归档', value: 2 },
]

const sortOptions = [
  { label: '最新发布', value: 'published_at', order: 'desc' },
  { label: '最早发布', value: 'published_at', order: 'asc' },
  { label: '阅读最多', value: 'views', order: 'desc' },
  { label: '最近编辑', value: 'updated_at', order: 'desc' },
]

function AdminArticles() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(mockData.adminStats)
  const [articles, setArticles] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState([])
  const [categories, setCategories] = useState(mockData.categories)

  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [activeTab, setActiveTab] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState(sortOptions[0])
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const params = {
      page,
      page_size: pageSize,
    }
    if (activeTab !== null) params.status = activeTab
    if (category !== 'all') params.category = category
    if (keyword) params.keyword = keyword
    params.sort_by = sortBy.value
    params.sort_order = sortBy.order

    const [listRes, statsRes, draftsRes, catRes] = await Promise.all([
      adminArticleAPI.getList(params),
      adminArticleAPI.getStats(),
      adminArticleAPI.getDrafts(5),
      adminArticleAPI.getCategories(),
    ])

    if (listRes) {
      setArticles(listRes.list || [])
      setTotal(listRes.total || 0)
    } else {
      let filtered = [...mockData.articles]
      if (activeTab !== null) {
        filtered = filtered.filter(a => a.status === activeTab)
      }
      if (category !== 'all') {
        filtered = filtered.filter(a => a.category === category)
      }
      if (keyword) {
        filtered = filtered.filter(a => a.title.includes(keyword))
      }
      setArticles(filtered.slice((page-1)*pageSize, page*pageSize))
      setTotal(filtered.length)
    }

    if (statsRes) setStats(statsRes)
    if (draftsRes) setDrafts(draftsRes)
    else setDrafts(mockData.articles.filter(a => a.status === 0).slice(0, 5))
    if (catRes) setCategories(catRes)

    setLoading(false)
    setSelectedIds([])
    setSelectAll(false)
  }

  useEffect(() => {
    fetchData()
  }, [page, activeTab, category, sortBy])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchData()
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([])
    } else {
      setSelectedIds(articles.map(a => a.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelect = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id)
      }
      return [...prev, id]
    })
  }

  const handleBatchAction = async (action) => {
    if (selectedIds.length === 0) return
    if (action === 'delete') {
      if (!confirm(`确定要删除选中的 ${selectedIds.length} 篇文章吗？`)) return
      await adminArticleAPI.batchDelete(selectedIds)
    } else {
      const status = action === 'publish' ? 1 : action === 'archive' ? 2 : 0
      await adminArticleAPI.batchStatus(selectedIds, status)
    }
    fetchData()
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    await adminArticleAPI.delete(id)
    fetchData()
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 1: return <span className="status-badge status-published"><CheckCircle className="w-3 h-3" />已发布</span>
      case 0: return <span className="status-badge status-draft"><Edit3 className="w-3 h-3" />草稿</span>
      case 2: return <span className="status-badge status-archived">已归档</span>
      default: return null
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '--'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '--'
    return d.toISOString().split('T')[0]
  }

  const totalPages = Math.ceil(total / pageSize)

  const statCards = [
    { icon: FileText, label: '总文章数', value: stats.total_articles, trend: '+12 本月', iconBg: 'bg-amber/10', iconColor: 'text-amber' },
    { icon: CheckCircle, label: '已发布', value: stats.published, sub: `占比 ${stats.total_articles > 0 ? Math.round(stats.published/stats.total_articles*100) : 0}%`, iconBg: 'bg-green-bg', iconColor: 'text-green-diff' },
    { icon: Edit3, label: '草稿', value: stats.draft, sub: '待完善', iconBg: 'bg-amber/10', iconColor: 'text-amber-dark' },
    { icon: Eye, label: '本月阅读', value: stats.monthly_views?.toLocaleString(), trend: '+18.5%', iconBg: 'bg-amber/10', iconColor: 'text-amber' },
  ]

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <AdminNavbar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-brown-dark text-balance">文章管理</h1>
                <p className="text-sm mt-1 whitespace-nowrap text-muted-foreground">共 {total} 篇文章</p>
              </div>
              <Link
                to="/admin/editor/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white whitespace-nowrap transition-opacity hover:opacity-90 shrink-0 bg-amber"
              >
                <Plus className="w-4 h-4" />
                新建文章
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              {statCards.map((card, idx) => (
                <div key={idx} className="stat-card">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
                      <card.icon className={`w-[18px] h-[18px] ${card.iconColor}`} />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap text-brown-dark">{card.value}</div>
                  <div className="text-xs mt-1 whitespace-nowrap text-muted-foreground">{card.label}</div>
                  {card.trend && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-green-diff" />
                      <span className="text-xs font-medium whitespace-nowrap text-green-diff">{card.trend}</span>
                    </div>
                  )}
                  {card.sub && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-xs whitespace-nowrap text-muted-foreground">{card.sub}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-card border border-warm-border rounded-xlarge p-4 sm:p-5 shadow-card mb-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="搜索文章标题..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-colors bg-warm-gray border border-warm-border focus:border-amber"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <select
                    className="px-3 py-2.5 rounded-lg text-sm outline-none transition-colors bg-warm-gray border border-warm-border cursor-pointer text-muted-foreground"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1) }}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237A6655' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem', appearance: 'none' }}
                  >
                    <option value="all">全部分类</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    className="px-3 py-2.5 rounded-lg text-sm outline-none transition-colors bg-warm-gray border border-warm-border cursor-pointer text-muted-foreground"
                    value={`${sortBy.value}-${sortBy.order}`}
                    onChange={(e) => {
                      const [value, order] = e.target.value.split('-')
                      const opt = sortOptions.find(o => o.value === value && o.order === order)
                      if (opt) setSortBy(opt)
                      setPage(1)
                    }}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237A6655' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', paddingRight: '2rem', appearance: 'none' }}
                  >
                    {sortOptions.map(opt => (
                      <option key={`${opt.value}-${opt.order}`} value={`${opt.value}-${opt.order}`}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </form>

              <div className="flex items-center gap-0 overflow-x-auto no-scrollbar border-b border-warm-border -mx-0">
                {statusTabs.map((tab) => (
                  <button
                    key={tab.label}
                    className={`filter-tab ${activeTab === tab.value ? 'tab-active' : ''}`}
                    onClick={() => { setActiveTab(tab.value); setPage(1) }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3 mb-3 px-4 py-2.5 rounded-lg bg-amber/10 border border-amber-light">
                <span className="text-sm font-medium whitespace-nowrap text-amber-dark">已选择 {selectedIds.length} 篇文章</span>
                <div className="w-px h-4 bg-amber-light"></div>
                <button className="bulk-action-btn" onClick={() => handleBatchAction('publish')}>批量发布</button>
                <button className="bulk-action-btn" onClick={() => handleBatchAction('archive')}>批量归档</button>
                <button className="bulk-action-btn danger" onClick={() => handleBatchAction('delete')}>批量删除</button>
                <div className="flex-1"></div>
                <button className="text-xs font-medium whitespace-nowrap transition-colors hover:opacity-70 text-muted-foreground" onClick={() => setSelectedIds([])}>取消选择</button>
              </div>
            )}

            <div className="bg-card border border-warm-border rounded-xlarge overflow-hidden shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed" style={{ minWidth: 720 }}>
                  <thead>
                    <tr className="bg-warm-gray border-b border-warm-border">
                      <th className="w-10 px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded accent-amber-600"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground" style={{ minWidth: 240 }}>标题</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground" style={{ minWidth: 80 }}>状态</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground" style={{ minWidth: 90 }}>阅读量</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground" style={{ minWidth: 100 }}>发布日期</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider whitespace-nowrap text-muted-foreground" style={{ minWidth: 100 }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">加载中...</td></tr>
                    ) : articles.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">暂无文章</td></tr>
                    ) : (
                      articles.map((article) => (
                        <tr key={article.id} className={`admin-table-row ${selectedIds.includes(article.id) ? 'row-selected' : ''}`} style={{ borderBottom: '1px solid var(--brand-border)' }}>
                          <td className="px-4 py-3.5">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded accent-amber-600"
                              checked={selectedIds.includes(article.id)}
                              onChange={() => handleSelect(article.id)}
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <Link
                              to={`/admin/editor/${article.id}`}
                              className="block text-sm font-semibold truncate transition-colors text-brown-dark hover:text-amber-dark"
                            >
                              {article.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs whitespace-nowrap bg-cream-dark text-muted-foreground">{article.category}</span>
                              <span className="text-xs whitespace-nowrap text-muted-foreground">{article.read_time} 分钟阅读</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {getStatusBadge(article.status)}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-sm font-medium whitespace-nowrap">{article.views?.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm whitespace-nowrap text-muted-foreground">{formatDate(article.published_at)}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1">
                              <button className="action-btn" title="编辑" onClick={() => navigate(`/admin/editor/${article.id}`)}>
                                <Pencil className="w-4 h-4" />
                              </button>
                              <Link to={`/blog/${article.id}`} className="action-btn" title="预览">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button className="action-btn delete-btn" title="删除" onClick={() => handleDelete(article.id)}>
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-warm-border">
                  <div className="text-sm text-muted-foreground">
                    共 {total} 篇，第 {page} / {totalPages} 页
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="page-btn"
                      disabled={page <= 1}
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p = i + 1
                      if (totalPages > 5) {
                        if (page > 3) p = page - 2 + i
                        if (p > totalPages) p = totalPages - (4 - i)
                      }
                      return (
                        <button
                          key={p}
                          className={`page-btn ${p === page ? 'page-active' : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      )
                    })}
                    <button
                      className="page-btn"
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:block w-72 shrink-0 space-y-4">
            <div className="sidebar-section">
              <h4 className="text-xs font-bold tracking-wide uppercase mb-3 text-muted-foreground">最近草稿</h4>
              <div className="space-y-0">
                {drafts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">暂无草稿</p>
                ) : (
                  drafts.map((d, idx) => (
                    <Link
                      key={d.id || idx}
                      to={`/admin/editor/${d.id}`}
                      className="flex items-center justify-between py-2.5 text-sm text-muted-foreground transition-colors hover:text-amber-dark border-b border-warm-border last:border-b-0"
                    >
                      <span className="truncate mr-2">{d.title}</span>
                      <span className="text-xs whitespace-nowrap text-muted-foreground/70">{formatDate(d.updated_at)}</span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="sidebar-section">
              <h4 className="text-xs font-bold tracking-wide uppercase mb-3 text-muted-foreground">热门文章</h4>
              <div className="space-y-0">
                {mockData.articles
                  .filter(a => a.status === 1)
                  .sort((a, b) => b.views - a.views)
                  .slice(0, 5)
                  .map((article, idx) => (
                    <Link
                      key={article.id}
                      to={`/blog/${article.id}`}
                      className="flex items-center justify-between py-2.5 text-sm text-muted-foreground transition-colors hover:text-amber-dark border-b border-warm-border last:border-b-0"
                    >
                      <span className="truncate mr-2">{idx + 1}. {article.title}</span>
                      <span className="text-xs whitespace-nowrap text-muted-foreground/70">{article.views?.toLocaleString()}</span>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h4 className="text-xs font-bold tracking-wide uppercase mb-3 text-muted-foreground">快速操作</h4>
              <div className="space-y-2">
                <Link to="/admin/articles/new" className="btn-secondary-sm w-full">
                  <Plus className="w-4 h-4" />
                  新建文章
                </Link>
                <Link to="/blog" className="btn-secondary-sm w-full">
                  <Eye className="w-4 h-4" />
                  查看博客
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminArticles
