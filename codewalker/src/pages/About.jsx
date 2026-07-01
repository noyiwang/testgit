import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  Github,
  Twitter,
  MessageCircle,
  Tv,
  Rss,
  Server,
  Layout,
  Cloud,
  PenTool,
  Users,
  BookOpen,
  Mail,
  Quote,
  ChevronRight,
} from 'lucide-react'

function About() {
  const [email, setEmail] = useState('')

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
    { icon: MessageCircle, label: '微信', href: '#' },
    { icon: Tv, label: 'Bilibili', href: 'https://bilibili.com' },
    { icon: Rss, label: 'RSS', href: '/rss.xml' },
  ]

  const timeline = [
    { year: '2016', title: '开始编程之旅', description: '初识 Python，被代码的魔力深深吸引。从简单的爬虫到 Web 应用，在好奇心的驱动下，开启了与计算机对话的奇妙旅程。' },
    { year: '2018', title: '深耕后端架构', description: '专注于高并发系统与微服务架构设计。在生产环境中摸爬滚打，理解了分布式系统的复杂性，也学会了在权衡中寻找最优解。' },
    { year: '2020', title: '开启开源之路', description: '将日常积累的工具与框架开源，意外收获了第一个千星项目。社区的反馈与贡献让我深刻体会到开源协作的力量。' },
    { year: '2022', title: '独立开发者', description: '离开大厂，成为独立开发者。专注于技术教育与开源项目维护，用视频和文字帮助更多开发者成长。' },
    { year: '2024', title: '创建「码上行」品牌', description: '整合多年的技术积累与内容创作经验，打造「码上行」个人品牌。全网粉丝突破 10K，持续输出高质量技术内容。' },
  ]

  const techStacks = [
    {
      icon: Server,
      title: '后端开发',
      tags: ['Go', 'Python', 'Rust', 'PostgreSQL', 'Redis'],
    },
    {
      icon: Layout,
      title: '前端开发',
      tags: ['TypeScript', 'React', 'Vue', 'Next.js'],
    },
    {
      icon: Cloud,
      title: 'DevOps',
      tags: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
    },
  ]

  const philosophies = [
    {
      icon: PenTool,
      title: '代码即表达',
      description: '好的代码应该像好的文章一样清晰易懂。写代码不仅是给机器执行，更是给人阅读。优雅的命名、清晰的结构、恰当的注释，都是程序员的文学修养。',
    },
    {
      icon: Users,
      title: '开源即学习',
      description: '与社区协作是提升技术视野的最佳方式。阅读优秀的源码，接受他人的 code review，参与 issue 讨论，在开源世界里，每个人都是你的老师。',
    },
    {
      icon: BookOpen,
      title: '分享即成长',
      description: '教学相长，写作是最好的深度学习。当你试图把一个知识点讲清楚时，才会发现自己理解的盲区。输出倒逼输入，分享让成长加速。',
    },
  ]

  const contactLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com', primary: true },
    { icon: Mail, label: 'Email', href: 'mailto:hello@codewalker.dev', primary: false },
    { icon: MessageCircle, label: '微信', href: '#', primary: false },
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

      <section className="relative overflow-hidden">
        <div className="container-brand py-16 lg:py-24">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="relative mb-8">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                <img
                  src="/assets/image_0_yi19x4.jpg"
                  alt="码上行头像"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary-foreground font-serif text-lg font-bold">码</span>
              </div>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              码上行
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              开源工程师 / 技术写作者 / 终身学习者
            </p>

            <div className="relative max-w-xl mb-8 px-6">
              <Quote className="w-8 h-8 text-primary/20 absolute -top-2 -left-2" />
              <blockquote className="font-serif text-lg sm:text-xl text-foreground/80 italic leading-relaxed">
                用代码丈量世界，用文字传递思考
              </blockquote>
              <Quote className="w-8 h-8 text-primary/20 absolute -bottom-2 -right-2 rotate-180" />
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 hover:-translate-y-0.5"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 lg:py-20">
        <div className="container-brand">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center mb-10">我的故事</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                我与编程的结缘始于大学时期的一次偶然。那是 2016 年，我用 Python 写了人生中第一个爬虫程序，当看到数据在屏幕上整齐排列的那一刻，我被代码的魔力深深吸引。从那一刻起，我知道这将是我一生追求的事业。此后的数年间，我从一个只会写脚本的初学者，成长为能够设计复杂分布式系统的工程师，代码已经成为我与世界对话的方式。
              </p>
              <p>
                我始终相信开源的力量。在我的职业生涯中，开源社区给予了我太多——从 Linux 操作系统到 GCC 编译器，从 React 前端框架到 Kubernetes 编排系统，我们每天都站在巨人的肩膀上。2020 年，我决定将自己多年积累的工具框架开源，出乎意料地收获了第一个千星项目。这份来自社区的认可让我更加坚定：知识应该自由流动，优秀的工具应该被更多人使用。
              </p>
              <p>
                「码上行」这个名字，源于我对编程与人生的理解。代码的世界里，每一行都是前行的脚印；技术的道路上，永远有新的风景等待探索。「码」是代码，也是连接世界的密码；「上行」是成长，是永不止步的追求。我希望这个品牌能够承载我的技术理念——在代码的世界里，保持好奇心，持续精进，同时用文字记录思考，帮助更多同行者一起上行。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-brand">
          <h2 className="section-title text-center mb-12">技术旅程</h2>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-primary/20" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={item.year} className="relative flex gap-4 sm:gap-6">
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <span className="text-primary-foreground font-serif text-sm sm:text-base font-bold">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex-1 pt-1 sm:pt-2">
                    <div className="card p-5 bg-card">
                      <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 lg:py-20">
        <div className="container-brand">
          <h2 className="section-title text-center mb-3">技术栈</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            经过多年实战沉淀的技术选型，在不同场景下选择最合适的工具。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techStacks.map((stack) => (
              <div key={stack.title} className="card p-6 bg-card">
                <div className="w-12 h-12 rounded-large bg-primary/10 flex items-center justify-center mb-5">
                  <stack.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4">{stack.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {stack.tags.map((tag) => (
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

      <section className="py-16 lg:py-20">
        <div className="container-brand">
          <h2 className="section-title text-center mb-3">技术理念</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            这些信念指引着我的技术实践与内容创作。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophies.map((philo) => (
              <div key={philo.title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <philo.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-3">{philo.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {philo.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 lg:py-20">
        <div className="container-brand">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title mb-3">与我联系</h2>
            <p className="text-muted-foreground mb-8">
              如果你有任何问题、合作想法，或只是想打个招呼，欢迎通过以下方式联系我。
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link.primary ? 'btn-primary' : 'btn-secondary'}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </a>
              ))}
            </div>

            <div className="card p-8 sm:p-10 bg-card text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xlarge bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-1">
                    订阅技术周刊
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    每周一封精选技术邮件，深度文章、开源项目推荐、技术思考，直达你的邮箱。
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入你的邮箱地址"
                  className="flex-1 h-11 px-4 rounded-medium bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                  required
                />
                <button type="submit" className="btn-primary h-11 whitespace-nowrap">
                  订阅
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                已有 <span className="font-semibold text-foreground">3,200+</span> 位开发者订阅，不发送垃圾邮件，随时可退订。
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About
