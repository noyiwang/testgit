import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  ArrowRight,
  FileText,
  GraduationCap,
  Github,
  Star,
  GitFork,
  Mail,
  MessageCircle,
  Video,
  Calendar,
  Clock,
  Code2,
  Layout,
  Server,
  Wrench,
  ChevronRight,
  Zap,
  ExternalLink,
} from 'lucide-react'

function Home() {
  const [email, setEmail] = useState('')

  const featuredArticles = [
    {
      id: 1,
      image: '/assets/image_0_yi19x4.jpg',
      category: '分布式系统',
      title: '理解CAP定理：分布式系统的权衡艺术',
      description: '深入探讨一致性、可用性与分区容错性之间的辩证关系，结合实际案例分析分布式架构设计中的核心决策。',
      date: '2026年6月28日',
      readTime: '12 分钟',
    },
    {
      id: 2,
      image: '/assets/image_2_yi19x4.jpg',
      category: 'Kubernetes',
      title: 'Kubernetes Operator 模式实战指南',
      description: '从CRD定义到Controller实现，手把手教你构建生产级别的Kubernetes Operator，自动化管理复杂应用。',
      date: '2026年6月20日',
      readTime: '18 分钟',
    },
    {
      id: 3,
      gradient: 'from-amber-400/80 via-orange-400/70 to-red-400/60',
      category: 'Go 语言',
      title: 'Go 并发编程：Goroutine 调度器深度剖析',
      description: '追踪Go运行时调度器的GMP模型实现原理，理解工作窃取、抢占式调度等核心机制的内部运作。',
      date: '2026年6月12日',
      readTime: '15 分钟',
    },
  ]

  const techStack = [
    {
      icon: Code2,
      title: '编程语言',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      tags: ['Go', 'Rust', 'TypeScript', 'Python', 'Java', 'C++'],
    },
    {
      icon: Layout,
      title: '框架与库',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tags: ['React', 'Gin', 'Echo', 'gRPC', 'Next.js', 'Spring'],
    },
    {
      icon: Server,
      title: '基础设施',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      tags: ['Kubernetes', 'Docker', 'etcd', 'Consul', 'Istio', 'Prometheus'],
    },
    {
      icon: Wrench,
      title: '工具链',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tags: ['Git', 'Linux', 'Vim/Neovim', 'GitHub Actions', 'Terraform', 'Helm'],
    },
  ]

  const courseStats = [
    { label: '课程数量', value: 12, suffix: '门', progress: 80 },
    { label: '学员总数', value: 5000, suffix: '+', progress: 92 },
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      alert(`感谢订阅！我们将发送最新内容到 ${email}`)
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - 60/40 Asymmetric Layout */}
      <section className="relative overflow-hidden">
        <div className="container-brand py-16 lg:py-24">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left 60% */}
            <div className="lg:col-span-3 space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-medium bg-primary/10 text-primary text-sm font-medium">
                <Zap className="w-4 h-4" />
                持续更新中
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                用代码
                <span className="text-primary relative">
                  丈量世界
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5.5C40 1.5 80 1.5 100 3.5C120 5.5 160 7.5 199 3.5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-secondary/60"
                    />
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                专注于分布式系统与云原生技术的深度探索。从共识算法到服务网格，
                从容器编排到可观测性，用工程师的视角解构复杂系统，分享最纯粹的技术思考。
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/articles" className="btn-primary group">
                  开始探索
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/about" className="btn-secondary">
                  了解更多
                </Link>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border/60">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-serif text-lg font-bold shadow-md">
                  码
                </div>
                <div>
                  <div className="font-semibold text-foreground">码上行</div>
                  <div className="text-sm text-muted-foreground">
                    分布式系统工程师 · 开源贡献者 · 技术布道者
                  </div>
                </div>
              </div>
            </div>

            {/* Right 40% */}
            <div className="lg:col-span-2 relative">
              <div className="relative aspect-[4/5] rounded-xlarge overflow-hidden shadow-2xl">
                <img
                  src="/assets/image_1_yi19x4.jpg"
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-secondary/30 rounded-large -z-10 blur-xl" />
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-large -z-10 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - "我在做什么" */}
      <section className="bg-muted py-16 lg:py-20">
        <div className="container-brand">
          <div className="mb-10">
            <h2 className="section-title mb-3">我在做什么</h2>
            <p className="text-muted-foreground max-w-2xl">
              技术写作、知识分享与开源贡献，三位一体的技术实践。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Card 1 - Large, spans 2 rows on lg */}
            <Link
              to="/articles/consensus-algorithms"
              className="card lg:row-span-2 group overflow-hidden flex flex-col bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/assets/image_0_yi19x4.jpg"
                  alt="共识算法"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-card/90 backdrop-blur-sm text-xs font-medium rounded-small text-primary">
                    <FileText className="w-3 h-3" />
                    最新文章
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="tag">分布式系统</span>
                  <span className="tag">算法</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  深入理解分布式系统中的共识算法
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  从 Paxos 到 Raft，从拜占庭将军问题到 PBFT，系统性地梳理共识算法的演进脉络，
                  剖析工业界实现（如 etcd/raft）的工程优化细节。
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      2026.06.30
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      25 分钟
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Card 2 - Teaching Stats */}
            <div className="card p-5 bg-card flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-medium bg-blue-50 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">教学成果</h3>
                  <p className="text-xs text-muted-foreground">知识的传递</p>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                {courseStats.map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      <span className="font-serif text-lg font-bold text-foreground">
                        {stat.value.toLocaleString()}
                        {stat.suffix}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Video className="w-4 h-4" />
                    <span>视频课程</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>社群答疑</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Open Source Project */}
            <div className="card p-5 bg-card flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-medium bg-orange-50 flex items-center justify-center">
                  <Github className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">开源项目</h3>
                  <p className="text-xs text-muted-foreground">GoDist · 分布式框架</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                轻量级 Go 微服务框架，内置服务发现、负载均衡与熔断降级能力。
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['Go', 'gRPC', 'Raft', 'etcd'].map((tag) => (
                  <span key={tag} className="tag text-primary bg-primary/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/60 mt-auto">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    2.3k
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-4 h-4" />
                    342
                  </span>
                </div>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  查看
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 lg:py-20">
        <div className="container-brand">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">精选文章</h2>
              <p className="text-muted-foreground">深度技术分享，助你构建系统知识体系。</p>
            </div>
            <Link
              to="/articles"
              className="hidden sm:inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all text-sm"
            >
              查看全部文章
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.id}`}
                className="card group bg-card overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-card/90 backdrop-blur-sm text-xs font-medium rounded-small text-foreground">
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
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/articles" className="btn-primary">
              查看全部文章
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-muted py-16 lg:py-20">
        <div className="container-brand">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">技术栈</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              日常开发与生产环境中使用的技术与工具，经过实战检验的选择。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {techStack.map((category) => (
              <div
                key={category.title}
                className="card p-6 bg-card"
              >
                <div
                  className={`w-11 h-11 rounded-large ${category.bgColor} flex items-center justify-center mb-4`}
                >
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-3">{category.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter/Subscribe Section */}
      <section className="py-16 lg:py-24">
        <div className="container-brand">
          <div className="relative max-w-2xl mx-auto">
            <div className="card p-8 sm:p-12 bg-card text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="w-14 h-14 rounded-xlarge bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                  加入码上行的技术之旅
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  订阅邮件列表，第一时间获取最新的技术文章、开源项目更新与独家内容分享。
                  不发送垃圾邮件，随时可退订。
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="输入你的邮箱地址"
                      className="w-full h-11 px-4 pr-4 rounded-medium bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary h-11 whitespace-nowrap">
                    立即订阅
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-xs text-muted-foreground mt-4">
                  已有 <span className="font-semibold text-foreground">3,200+</span> 位开发者订阅
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
