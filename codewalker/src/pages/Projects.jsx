import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Star,
  GitFork,
  Download,
  ExternalLink,
  Github,
  Code,
  Package,
  Terminal,
  Layers,
  Activity,
  Calendar,
  Clock,
  FileCode,
  Flame,
  Users,
} from 'lucide-react'

const projects = [
  {
    id: 1,
    name: 'GoFlow',
    description: '轻量级Go工作流引擎，支持DAG编排、分布式任务调度与可视化监控，适用于复杂业务流程自动化。',
    language: 'Go',
    languageColor: 'bg-emerald-500',
    iconColor: 'bg-emerald-100 text-emerald-600',
    status: '活跃维护',
    statusColor: 'bg-emerald-100 text-emerald-700',
    stars: '3200',
    forks: '420',
    updatedAt: '2天前',
    license: 'MIT',
    icon: Code,
  },
  {
    id: 2,
    name: 'config-vault',
    description: '高性能配置管理中心，支持多环境配置、热加载、版本回滚与权限控制，兼容K8s与微服务架构。',
    language: 'Go',
    languageColor: 'bg-blue-500',
    iconColor: 'bg-blue-100 text-blue-600',
    status: '活跃维护',
    statusColor: 'bg-blue-100 text-blue-700',
    stars: '1800',
    forks: '230',
    updatedAt: '5天前',
    license: 'Apache-2.0',
    icon: Package,
  },
  {
    id: 3,
    name: 'ts-mock-server',
    description: 'TypeScript驱动的Mock服务器，支持动态数据生成、接口代理、请求录制与RESTful/GraphQL双协议。',
    language: 'TypeScript',
    languageColor: 'bg-yellow-500',
    iconColor: 'bg-yellow-100 text-yellow-600',
    status: '活跃维护',
    statusColor: 'bg-yellow-100 text-yellow-700',
    stars: '1200',
    forks: '156',
    updatedAt: '1周前',
    license: 'MIT',
    icon: Layers,
  },
  {
    id: 4,
    name: 'log-stream',
    description: '高性能日志流处理框架，支持实时采集、过滤、聚合与多目的地输出，每秒处理百万级日志事件。',
    language: 'Go',
    languageColor: 'bg-blue-500',
    iconColor: 'bg-blue-100 text-blue-600',
    status: '稳定版',
    statusColor: 'bg-muted text-muted-foreground',
    stars: '890',
    forks: '98',
    updatedAt: '2周前',
    license: 'MIT',
    icon: Activity,
  },
  {
    id: 5,
    name: 'react-charts-warm',
    description: '暖色调React图表组件库，基于D3.js封装，提供20+种可交互图表，支持主题定制与响应式布局。',
    language: 'TypeScript',
    languageColor: 'bg-yellow-500',
    iconColor: 'bg-yellow-100 text-yellow-600',
    status: '稳定版',
    statusColor: 'bg-muted text-muted-foreground',
    stars: '650',
    forks: '72',
    updatedAt: '3周前',
    license: 'MIT',
    icon: FileCode,
  },
  {
    id: 6,
    name: 'cli-dashboard',
    description: 'Python终端仪表盘工具，支持实时系统监控、日志查看与远程服务器管理，打造高效命令行工作流。',
    language: 'Python',
    languageColor: 'bg-green-500',
    iconColor: 'bg-green-100 text-green-600',
    status: '实验性',
    statusColor: 'bg-orange-100 text-orange-700',
    stars: '420',
    forks: '45',
    updatedAt: '1个月前',
    license: 'BSD-3-Clause',
    icon: Terminal,
  },
]

const techStack = ['Go', 'gRPC', 'etcd', 'Prometheus', 'Docker', 'Kubernetes']

const generateContributionData = () => {
  const data = []
  for (let week = 0; week < 52; week++) {
    const weekData = []
    for (let day = 0; day < 7; day++) {
      const rand = Math.random()
      let level = 0
      if (rand > 0.25) level = 1
      if (rand > 0.5) level = 2
      if (rand > 0.75) level = 3
      if (rand > 0.9) level = 4
      weekData.push(level)
    }
    data.push(weekData)
  }
  return data
}

const contributionData = generateContributionData()

const getContributionColor = (level) => {
  switch (level) {
    case 0: return 'bg-muted'
    case 1: return 'bg-primary/20'
    case 2: return 'bg-primary/40'
    case 3: return 'bg-primary/70'
    case 4: return 'bg-primary'
    default: return 'bg-muted'
  }
}

const generateRecentActivity = () => {
  const activity = []
  for (let i = 0; i < 35; i++) {
    const rand = Math.random()
    let level = 0
    if (rand > 0.3) level = 1
    if (rand > 0.6) level = 2
    if (rand > 0.8) level = 3
    activity.push(level)
  }
  return activity
}

const recentActivity = generateRecentActivity()

function Projects() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 lg:py-16">
        <div className="container-brand">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              开源作品
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              用代码构建工具，用开源回馈社区。这里是我参与和维护的开源项目
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-medium">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-foreground">总Star 8.5K</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-medium">
                <Github className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">15个仓库</span>
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-medium">
                <Users className="w-5 h-5 text-secondary" />
                <span className="font-semibold text-foreground">120+贡献者</span>
              </span>
            </div>
          </div>

          <div className="card bg-card overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src="/assets/image_4_yi19x4.jpg"
                  alt="GoFlow"
                  className="w-full h-full min-h-[320px] object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white text-sm font-semibold rounded-medium">
                    <Star className="w-4 h-4 fill-current" />
                    Star项目
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-large bg-emerald-100 flex items-center justify-center">
                      <Code className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-foreground">GoFlow</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm text-muted-foreground">Go</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-small">
                    活跃维护
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  轻量级Go工作流引擎，专为云原生环境设计。支持DAG任务编排、分布式调度、故障自动重试与可视化监控面板，已在生产环境服务于每日千万级任务执行。
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/50 rounded-medium">
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-foreground text-lg">3200</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Stars</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-medium">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <GitFork className="w-4 h-4" />
                      <span className="font-bold text-foreground text-lg">420</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Forks</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-medium">
                    <div className="flex items-center justify-center gap-1 text-primary mb-1">
                      <Download className="w-4 h-4" />
                      <span className="font-bold text-foreground text-lg">12K</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Downloads</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {techStack.map((tech) => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <Github className="w-4 h-4" />
                    查看源码
                  </a>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <ExternalLink className="w-4 h-4" />
                    在线演示
                  </a>
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">近期贡献活动</div>
                  <div className="flex gap-1 flex-wrap">
                    {recentActivity.map((level, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="container-brand">
          <h2 className="section-title text-center mb-3">全部项目</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            从工具库到框架，覆盖开发工作流的各个环节
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => {
              const IconComponent = project.icon
              return (
                <div key={project.id} className="card bg-card p-6 group">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-large ${project.iconColor} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-2.5 h-2.5 rounded-full ${project.languageColor}`} />
                          <span className="text-xs text-muted-foreground">{project.language}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-small ${project.statusColor}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex items-center gap-5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 hover:text-yellow-500 transition-colors cursor-pointer">
                      <Star className="w-4 h-4" />
                      <span className="font-medium">{project.stars}</span>
                    </span>
                    <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                      <GitFork className="w-4 h-4" />
                      <span className="font-medium">{project.forks}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {project.updatedAt}
                    </span>
                    <span className="ml-auto text-xs">
                      {project.license}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-brand">
          <div className="card bg-card p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
              <div>
                <h2 className="section-title mb-3">开源贡献</h2>
                <p className="text-muted-foreground max-w-xl">
                  坚持开源贡献，用代码传递价值。每一次commit都是对社区的回馈。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-medium">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    今年贡献 <span className="font-bold text-foreground">847</span> 次
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-medium">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-sm">
                    最长连续 <span className="font-bold text-foreground">32</span> 天
                  </span>
                </div>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <Github className="w-4 h-4" />
                  在GitHub上查看
                </a>
              </div>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="inline-block min-w-full">
                <div className="flex gap-1 mb-2">
                  {['一', '三', '五'].map((day, i) => (
                    <div key={day} className="text-xs text-muted-foreground w-[10px]" style={{ marginLeft: i === 0 ? '0' : '26px' }}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className="flex gap-[3px]">
                  {contributionData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                      {week.map((level, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`w-[10px] h-[10px] rounded-sm ${getContributionColor(level)} hover:ring-1 hover:ring-primary/50 transition-all cursor-pointer`}
                          title={`${level} contributions`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <span className="text-xs text-muted-foreground">少</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-[10px] h-[10px] rounded-sm ${getContributionColor(level)}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground">多</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Projects
