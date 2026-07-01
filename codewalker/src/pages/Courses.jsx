import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  BookOpen,
  Users,
  Star,
  Clock,
  PlayCircle,
  Award,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
  Quote,
  GraduationCap,
  Code2,
  Zap,
  Server,
  Database,
  Shield,
  BarChart3,
} from 'lucide-react'

const courses = [
  {
    id: 1,
    title: 'Go语言基础入门',
    description: '从零开始学习Go语言，掌握语法、并发编程与工程实践，为云原生开发打下坚实基础。',
    gradient: 'from-emerald-400 to-teal-500',
    level: '入门',
    levelColor: 'bg-emerald-100 text-emerald-700',
    price: '免费',
    priceType: 'free',
    lessons: 24,
    duration: '12小时',
    rating: 4.8,
    students: 850,
    icon: Code2,
    tags: ['Go', '编程基础', '并发'],
  },
  {
    id: 2,
    title: 'TypeScript全栈开发',
    description: '从React前端到Node.js后端，构建类型安全的现代Web应用，掌握全栈开发最佳实践。',
    gradient: 'from-blue-400 to-indigo-500',
    level: '中级',
    levelColor: 'bg-blue-100 text-blue-700',
    price: '¥199',
    priceType: 'paid',
    lessons: 42,
    duration: '28小时',
    rating: 4.9,
    students: 1200,
    icon: Zap,
    tags: ['TypeScript', 'React', 'Node.js'],
  },
  {
    id: 3,
    title: 'Docker与Kubernetes实战',
    description: '容器化与编排技术深度实战，从Docker基础到K8s集群管理，掌握云原生核心技能。',
    gradient: 'from-sky-400 to-blue-600',
    level: '中级',
    levelColor: 'bg-blue-100 text-blue-700',
    price: '¥299',
    priceType: 'paid',
    lessons: 36,
    duration: '24小时',
    rating: 4.7,
    students: 960,
    icon: Server,
    tags: ['Docker', 'Kubernetes', 'DevOps'],
  },
  {
    id: 4,
    title: '分布式系统设计模式',
    description: '深入理解分布式系统核心问题，掌握一致性、可用性、分区容错的架构设计模式。',
    gradient: 'from-violet-400 to-purple-600',
    level: '高级',
    levelColor: 'bg-violet-100 text-violet-700',
    price: '¥399',
    priceType: 'paid',
    lessons: 48,
    duration: '36小时',
    rating: 4.9,
    students: 680,
    icon: Database,
    tags: ['分布式', '微服务', '架构'],
  },
  {
    id: 5,
    title: 'Rust系统编程入门',
    description: '学习内存安全的系统编程语言，掌握所有权、生命周期等核心概念，构建高性能应用。',
    gradient: 'from-rose-400 to-red-500',
    level: '入门',
    levelColor: 'bg-rose-100 text-rose-700',
    price: '免费',
    priceType: 'free',
    lessons: 30,
    duration: '18小时',
    rating: 4.6,
    students: 520,
    icon: Shield,
    tags: ['Rust', '系统编程', '内存安全'],
  },
  {
    id: 6,
    title: '云原生可观测性实践',
    description: '构建完整的可观测性体系，掌握Prometheus监控、Jaeger链路追踪与日志聚合技术。',
    gradient: 'from-green-400 to-emerald-600',
    level: '高级',
    levelColor: 'bg-green-100 text-green-700',
    price: '¥249',
    priceType: 'paid',
    lessons: 28,
    duration: '20小时',
    rating: 4.8,
    students: 430,
    icon: BarChart3,
    tags: ['Prometheus', 'Grafana', '可观测性'],
  },
]

const roadmapSteps = [
  { title: 'Go基础', status: 'completed' },
  { title: 'Web开发', status: 'in-progress' },
  { title: '微服务架构', status: 'pending' },
  { title: '分布式系统', status: 'pending' },
  { title: '云原生', status: 'pending' },
]

const reviews = [
  {
    id: 1,
    name: '张明远',
    role: '后端工程师',
    avatar: '张',
    avatarBg: 'bg-primary/20',
    content: '课程内容非常扎实，老师讲解深入浅出，特别是分布式系统部分的实战案例让我受益匪浅。现在已经能独立设计微服务架构了！',
    rating: 5,
  },
  {
    id: 2,
    name: '李小雨',
    role: '全栈开发者',
    avatar: '李',
    avatarBg: 'bg-secondary/20',
    content: 'TypeScript全栈课程物超所值，从类型体操到工程化配置，覆盖了开发中遇到的各种问题。社群答疑也很及时，强烈推荐！',
    rating: 5,
  },
  {
    id: 3,
    name: '王浩然',
    role: '运维工程师',
    avatar: '王',
    avatarBg: 'bg-emerald-500/20',
    content: 'K8s实战课程帮我顺利通过了CKA考试，课程里的集群搭建和故障排查都是面试和工作中的高频场景，非常实用。',
    rating: 5,
  },
]

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-6 h-6 text-emerald-500" />
    case 'in-progress':
      return <Loader2 className="w-6 h-6 text-primary animate-spin" />
    default:
      return <Circle className="w-6 h-6 text-muted-foreground" />
  }
}

const getStatusBg = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 border-emerald-300'
    case 'in-progress':
      return 'bg-primary/10 border-primary/50'
    default:
      return 'bg-muted border-border'
  }
}

function Courses() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 lg:py-16">
        <div className="container-brand">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              教学课程
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              系统化的技术课程体系，从入门到精通，陪伴你的每一步成长
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="text-foreground font-semibold">12</span>
                <span className="text-muted-foreground">门课程</span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-foreground font-semibold">5200+</span>
                <span className="text-muted-foreground">学员</span>
              </div>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-foreground font-semibold">98%</span>
                <span className="text-muted-foreground">好评率</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-xlarge overflow-hidden group">
            <img
              src="/assets/image_3_yi19x4.jpg"
              alt="推荐课程"
              className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 sm:px-10 lg:px-14 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-medium mb-5">
                  <Star className="w-4 h-4 fill-current" />
                  推荐课程
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                  分布式系统架构实战
                </h2>
                <p className="text-white/80 text-base sm:text-lg mb-6 leading-relaxed">
                  从理论到实践，全面掌握分布式系统设计核心。包含Raft共识、服务发现、负载均衡、熔断降级等生产级方案。
                </p>
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    36课时
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    中级难度
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    4.9分
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    1200+人已学习
                  </span>
                </div>
                <button className="btn-primary bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <PlayCircle className="w-5 h-5" />
                  立即学习
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="container-brand">
          <h2 className="section-title text-center mb-3">全部课程</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            精心设计的课程体系，涵盖后端开发、云原生、系统编程等热门方向
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const IconComponent = course.icon
              return (
                <div key={course.id} className="card bg-card overflow-hidden group flex flex-col">
                  <div className={`relative h-36 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
                    <IconComponent className="w-16 h-16 text-white/90" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-small ${course.levelColor}`}>
                        {course.level}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-sm font-bold rounded-small ${
                        course.priceType === 'free'
                          ? 'bg-white/90 text-emerald-600'
                          : 'bg-white/90 text-foreground'
                      }`}>
                        {course.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {course.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.lessons}课时
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold text-foreground">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-brand">
          <h2 className="section-title text-center mb-3">学习路线图</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            循序渐进的学习路径，帮你规划从入门到专家的成长轨迹
          </p>

          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 via-primary to-border w-2/5" />
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-4">
              {roadmapSteps.map((step, index) => (
                <div key={step.title} className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 relative flex-1">
                  <div className="md:hidden absolute left-4 top-12 bottom-0 w-0.5 bg-border last:hidden" style={{ height: index < roadmapSteps.length - 1 ? 'calc(100% + 2rem)' : 0 }}>
                    {step.status === 'completed' && <div className="w-full h-full bg-emerald-400" />}
                  </div>

                  <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center z-10 flex-shrink-0 ${getStatusBg(step.status)}`}>
                    {getStatusIcon(step.status)}
                  </div>

                  <div className="text-left md:text-center">
                    <div className="text-xs text-muted-foreground mb-1">阶段 {index + 1}</div>
                    <div className={`font-semibold ${
                      step.status === 'completed' ? 'text-emerald-600' :
                      step.status === 'in-progress' ? 'text-primary' :
                      'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {step.status === 'completed' && '已完成'}
                      {step.status === 'in-progress' && '进行中'}
                      {step.status === 'pending' && '待开始'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="container-brand">
          <h2 className="section-title text-center mb-3">学员评价</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            来自真实学员的反馈，见证他们的成长与收获
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="card bg-card p-6 flex flex-col">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-foreground leading-relaxed mb-6 flex-1">
                  {review.content}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className={`w-10 h-10 rounded-full ${review.avatarBg} flex items-center justify-center font-serif font-bold text-primary`}>
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{review.name}</div>
                    <div className="text-xs text-muted-foreground">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Courses
