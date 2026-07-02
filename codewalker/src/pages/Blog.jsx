import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { articleAPI, mockData } from '../services/api'
import {
  Search,
  Star,
  Clock,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Rss,
  TrendingUp,
  BookOpen,
  Flame,
  Loader2,
} from 'lucide-react'

const gradients = [
  'from-amber-400/80 via-orange-400/70 to-red-400/60',
  'from-emerald-400/70 via-teal-400/60 to-cyan-400/50',
  'from-purple-400/70 via-violet-400/60 to-indigo-400/50',
  'from-rose-400/70 via-pink-400/60 to-fuchsia-400/50',
  'from-sky-400/70 via-blue-400/60 to-indigo-400/50',
  'from-lime-400/70 via-green-400/60 to-emerald-400/50',
  'from-yellow-400/70 via-amber-400/60 to-orange-400/50',
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function formatReadTime(minutes) {
  if (!minutes || minutes <= 0) return '5 分钟'
  return `${minutes} 分钟`
}

function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(6)
  const searchTimerRef = useRef(null)

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setCurrentPage(1)
    }, 400)
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    }
  }, [searchInput])

  const [articleData, setArticleData] = useState({ list: mockData.articles, total: mockData.articles.length })
  const [featuredList, setFeaturedList] = useState(mockData.articles.filter(a => a.is_featured).slice(0, 3))
  const [categories, setCategories] = useState([
    { name: '全部', count: mockData.articles.length },
    ...mockData.categories.map(name => ({
      name,
      count: mockData.articles.filter(a => a.category === name).length,
    })),
  ])
  const [tags, setTags] = useState(mockData.tags)
  const [loading, setLoading] = useState(true)
  const [categoryCounts, setCategoryCounts] = useState({})

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((articleData.total || 0) / pageSize))
  }, [articleData.total, pageSize])

  const featuredArticle = useMemo(() => {
    if (featuredList && featuredList.length > 0) {
      return featuredList[0]
    }
    const published = articleData.list.filter(a => a.status === 1)
    return published[0] || null
  }, [featuredList, articleData.list])

  const articles = useMemo(() => {
    let list = articleData.list.filter(a => a.status === 1)
    if (featuredArticle) {
      list = list.filter(a => a.id !== featuredArticle.id)
    }
    return list
  }, [articleData.list, featuredArticle])

  const recommendedArticles = useMemo(() => {
    return articleData.list
      .filter(a => a.status === 1 && (!featuredArticle || a.id !== featuredArticle.id))
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 4)
  }, [articleData.list, featuredArticle])

  useEffect(() => {
    let mounted = true

    async function loadData() {
      setLoading(true)
      try {
        const [listRes, featuredRes, catsRes, tagsRes] = await Promise.all([
          articleAPI.getList({ page: currentPage, page_size: pageSize, category: activeCategory === '全部' ? '' : activeCategory, keyword: debouncedSearch }),
          articleAPI.getFeatured(3),
          articleAPI.getCategories(),
          articleAPI.getTags(),
        ])

        if (!mounted) return

        if (listRes && listRes.list) {
          setArticleData(listRes)
        }

        if (featuredRes && Array.isArray(featuredRes) && featuredRes.length > 0) {
          setFeaturedList(featuredRes)
        }

        if (catsRes && Array.isArray(catsRes) && catsRes.length > 0) {
          const allCategory = { name: '全部', count: listRes?.total || 0 }
          setCategories([allCategory, ...catsRes])
        }

        if (tagsRes && Array.isArray(tagsRes) && tagsRes.length > 0) {
          setTags(tagsRes)
        }
      } catch (e) {
        console.warn('Failed to load articles from API, using mock data:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()
    return () => { mounted = false }
  }, [currentPage, pageSize, activeCategory, debouncedSearch])

  useEffect(() => {
    const tagParam = searchParams.get('tag')
    if (tagParam) {
      setSearchInput(tagParam)
    }
  }, [searchParams])

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  const getGradient = (id) => {
    return gradients[id % gradients.length]
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-muted py-12 lg:py-16">
        <div className="container-brand">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
              技术博客
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              记录技术探索的点点滴滴，分享分布式系统、Go语言、云原生等领域的深度思考与实践经验。
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>共 <span className="font-semibold text-foreground">{articleData.total || articleData.list.length}</span> 篇文章</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-12">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="搜索文章..."
                  className="w-full h-12 pl-12 pr-4 rounded-medium bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => {
                  const catName = typeof category === 'string' ? category : category.name
                  const catCount = typeof category === 'string' ? null : category.count
                  return (
                    <button
                      key={catName}
                      onClick={() => handleCategoryChange(catName)}
                      className={`px-4 py-2 rounded-medium text-sm font-medium transition-all duration-200 ${
                        activeCategory === catName
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border'
                      }`}
                    >
                      {catName}
                      <span className={`ml-1.5 text-xs ${
                        activeCategory === catName ? 'text-primary-foreground/80' : 'text-muted-foreground'
                      }`}>
                        ({catCount != null ? catCount : '—'})
                      </span>
                    </button>
                  )
                })}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">加载文章中...</span>
                </div>
              ) : (
                <>
                  {featuredArticle && (
                    <Link
                      to={`/blog/${featuredArticle.id}`}
                      className="card group bg-card overflow-hidden mb-8 block"
                    >
                      <div className="grid lg:grid-cols-5 gap-0">
                        <div className="lg:col-span-3 relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                          {featuredArticle.cover ? (
                            <img
                              src={featuredArticle.cover}
                              alt={featuredArticle.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${getGradient(featuredArticle.id)}`} />
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-medium shadow-lg">
                              <Star className="w-4 h-4 fill-current" />
                              精选文章
                            </span>
                          </div>
                        </div>
                        <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center">
                          {featuredArticle.category && (
                            <span className="inline-flex w-fit items-center px-2.5 py-1 text-xs font-medium rounded-small bg-primary/10 text-primary mb-4">
                              {featuredArticle.category}
                            </span>
                          )}
                          <h2 className="font-serif text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                            {featuredArticle.title}
                          </h2>
                          <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                            {featuredArticle.summary || featuredArticle.title}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(featuredArticle.published_at || featuredArticle.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatReadTime(featuredArticle.read_time)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {(featuredArticle.views || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}

                  {articles.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>暂无文章</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      {articles.map((article) => (
                        <Link
                          key={article.id}
                          to={`/blog/${article.id}`}
                          className="card group bg-card overflow-hidden flex flex-col"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden">
                            {article.cover ? (
                              <img
                                src={article.cover}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${getGradient(article.id)}`} />
                            )}
                            {article.category && (
                              <div className="absolute top-3 left-3">
                                <span className="inline-flex items-center px-2.5 py-1 bg-card/90 backdrop-blur-sm text-xs font-medium rounded-small text-foreground">
                                  {article.category}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 p-5">
                            <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                              {article.summary || article.title}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border/60">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(article.published_at || article.created_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {formatReadTime(article.read_time)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {(article.views || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        上一页
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-medium text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        下一页
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 space-y-6">
                <div className="card p-5 bg-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">热门标签</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.name}
                        onClick={() => { setSearchInput(tag.name); setCurrentPage(1) }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-small bg-muted text-muted-foreground text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                      >
                        {tag.name}
                        <span className="text-xs opacity-60">{tag.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card p-5 bg-card">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">推荐阅读</h3>
                  </div>
                  <div className="space-y-4">
                    {recommendedArticles.map((article, index) => (
                      <Link
                        key={article.id}
                        to={`/blog/${article.id}`}
                        className="group flex items-start gap-3"
                      >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-small flex items-center justify-center text-xs font-bold ${
                          index < 3
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                            {article.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatReadTime(article.read_time)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="card p-5 bg-card">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xlarge bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Rss className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">订阅更新</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      通过 RSS 订阅，第一时间获取最新文章
                    </p>
                    <a
                      href="/rss.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary w-full"
                    >
                      <Rss className="w-4 h-4" />
                      RSS 订阅
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Blog
