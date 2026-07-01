import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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
} from 'lucide-react'

const categories = [
  { name: '全部', count: 42 },
  { name: '分布式系统', count: 8 },
  { name: '前端工程', count: 6 },
  { name: 'Go语言', count: 10 },
  { name: '开源实践', count: 7 },
  { name: '云原生', count: 6 },
  { name: '架构设计', count: 5 },
]

const featuredArticle = {
  id: 1,
  image: '/assets/image_2_yi19x4.jpg',
  category: 'Go语言',
  title: '深入理解 Go 语言并发模型：从 Goroutine 到 Channel',
  description: 'Go 语言的并发模型基于 CSP 理论，通过 Goroutine 和 Channel 提供了一种优雅而高效的并发编程方式。本文将深入剖析 GMP 调度模型、Channel 的底层实现、以及常见并发模式的最佳实践。',
  date: '2026年6月28日',
  readTime: '25 分钟',
  views: 8432,
}

const articles = [
  {
    id: 2,
    gradient: 'from-amber-400/80 via-orange-400/70 to-red-400/60',
    category: '分布式系统',
    title: 'Raft 共识算法工程实现指南',
    description: '从 Leader 选举到日志复制，详解 etcd/raft 库的核心实现与生产环境踩坑经验。',
    date: '2026年6月25日',
    readTime: '18 分钟',
    views: 5621,
  },
  {
    id: 3,
    image: '/assets/image_0_yi19x4.jpg',
    category: '云原生',
    title: 'Kubernetes Operator 模式深度解析',
    description: 'CRD 定义、Controller 实现、Reconcile 循环，手把手教你构建生产级 Operator。',
    date: '2026年6月20日',
    readTime: '22 分钟',
    views: 4893,
  },
  {
    id: 4,
    gradient: 'from-emerald-400/70 via-teal-400/60 to-cyan-400/50',
    category: '前端工程',
    title: 'React 19 新特性全景解读',
    description: 'Server Components、Actions、useOptimistic 等新特性的实战应用与性能分析。',
    date: '2026年6月15日',
    readTime: '15 分钟',
    views: 7234,
  },
  {
    id: 5,
    image: '/assets/image_1_yi19x4.jpg',
    category: '开源实践',
    title: '从零构建 Go 微服务框架',
    description: '服务发现、负载均衡、熔断降级，一个轻量级框架的设计思考与代码实现。',
    date: '2026年6月10日',
    readTime: '28 分钟',
    views: 9156,
  },
  {
    id: 6,
    gradient: 'from-purple-400/70 via-violet-400/60 to-indigo-400/50',
    category: '架构设计',
    title: '高并发系统的缓存设计艺术',
    description: '缓存穿透、击穿、雪崩的解决方案，多级缓存架构与一致性保证策略。',
    date: '2026年6月5日',
    readTime: '20 分钟',
    views: 6547,
  },
  {
    id: 7,
    image: '/assets/image_3_yi19x4.jpg',
    category: 'Go语言',
    title: 'Go 内存管理与 GC 调优实战',
    description: 'TCMalloc 思想、三色标记清除、逃逸分析，以及如何写出 GC 友好的代码。',
    date: '2026年5月30日',
    readTime: '24 分钟',
    views: 5892,
  },
]

const hotTags = [
  { name: 'Go', count: 23 },
  { name: 'Kubernetes', count: 18 },
  { name: '并发编程', count: 15 },
  { name: '微服务', count: 14 },
  { name: 'React', count: 12 },
  { name: '分布式', count: 11 },
  { name: 'Docker', count: 10 },
  { name: '性能优化', count: 9 },
  { name: 'Rust', count: 8 },
  { name: 'gRPC', count: 7 },
]

const recommendedArticles = [
  {
    id: 8,
    title: 'protobuf 高级技巧与性能优化',
    readTime: '12 分钟',
  },
  {
    id: 9,
    title: 'Redis 集群方案对比与选型',
    readTime: '15 分钟',
  },
  {
    id: 10,
    title: '如何设计一个容错的分布式系统',
    readTime: '20 分钟',
  },
  {
    id: 11,
    title: 'Go 错误处理的最佳实践',
    readTime: '10 分钟',
  },
]

function Blog() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 7

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
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
              <span>共 <span className="font-semibold text-foreground">42</span> 篇文章</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 lg:py-12">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-8 xl:col-span-9">
              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文章..."
                  className="w-full h-12 pl-12 pr-4 rounded-medium bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setActiveCategory(category.name)}
                    className={`px-4 py-2 rounded-medium text-sm font-medium transition-all duration-200 ${
                      activeCategory === category.name
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border'
                    }`}
                  >
                    {category.name}
                    <span className={`ml-1.5 text-xs ${
                      activeCategory === category.name ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      ({category.count})
                    </span>
                  </button>
                ))}
              </div>

              {/* Featured Article Card */}
              <Link
                to={`/blog/${featuredArticle.id}`}
                className="card group bg-card overflow-hidden mb-8 block"
              >
                <div className="grid lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-3 relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-medium shadow-lg">
                        <Star className="w-4 h-4 fill-current" />
                        精选文章
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-6 lg:p-8 flex flex-col justify-center">
                    <span className="inline-flex w-fit items-center px-2.5 py-1 text-xs font-medium rounded-small bg-primary/10 text-primary mb-4">
                      {featuredArticle.category}
                    </span>
                    <h2 className="font-serif text-xl lg:text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {featuredArticle.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {featuredArticle.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredArticle.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {featuredArticle.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Article Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/blog/${article.id}`}
                    className="card group bg-card overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${article.gradient}`} />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 bg-card/90 backdrop-blur-sm text-xs font-medium rounded-small text-foreground">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {article.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
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
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
              <div className="sticky top-24 space-y-6">
                {/* Hot Tags */}
                <div className="card p-5 bg-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-lg font-semibold text-foreground">热门标签</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hotTags.map((tag) => (
                      <Link
                        key={tag.name}
                        to={`/blog?tag=${tag.name}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-small bg-muted text-muted-foreground text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {tag.name}
                        <span className="text-xs opacity-60">{tag.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recommended Articles */}
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
                            {article.readTime}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* RSS Subscribe */}
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
