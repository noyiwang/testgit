import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
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
} from 'lucide-react'

const tocItems = [
  { id: 'introduction', title: '引言' },
  { id: 'goroutine-basics', title: 'Goroutine 基础' },
  { id: 'gmp-model', title: 'GMP 调度模型' },
  { id: 'channel-deep-dive', title: 'Channel 深入剖析' },
  { id: 'select-patterns', title: 'Select 与并发模式' },
  { id: 'common-pitfalls', title: '常见陷阱与最佳实践' },
  { id: 'conclusion', title: '总结' },
]

const relatedArticles = [
  {
    id: 2,
    gradient: 'from-amber-400/80 via-orange-400/70 to-red-400/60',
    category: '分布式系统',
    title: 'Raft 共识算法工程实现指南',
    date: '2026年6月25日',
    readTime: '18 分钟',
  },
  {
    id: 3,
    image: '/assets/image_0_yi19x4.jpg',
    category: '云原生',
    title: 'Kubernetes Operator 模式深度解析',
    date: '2026年6月20日',
    readTime: '22 分钟',
  },
  {
    id: 7,
    image: '/assets/image_3_yi19x4.jpg',
    category: 'Go语言',
    title: 'Go 内存管理与 GC 调优实战',
    date: '2026年5月30日',
    readTime: '24 分钟',
  },
]

const comments = [
  {
    id: 1,
    author: 'gopher_dev',
    avatar: 'G',
    content: '写得太好了！GMP模型的解释非常清晰，特别是工作窃取那部分，终于搞懂了。请问有推荐的源码阅读路径吗？',
    date: '2026年6月29日',
    likes: 23,
  },
  {
    id: 2,
    author: 'backend_newbie',
    avatar: 'B',
    content: '作为一个刚转Go的后端开发，这篇文章帮我理清了很多概念。Channel的底层实现那节干货满满！',
    date: '2026年6月29日',
    likes: 15,
  },
  {
    id: 3,
    author: 'distributed_fan',
    avatar: 'D',
    content: 'select的用法总结得很到位，特别是timeout和default的场景对比，收藏了！',
    date: '2026年6月30日',
    likes: 8,
  },
]

function BlogDetail() {
  const { id } = useParams()
  const [activeSection, setActiveSection] = useState('introduction')
  const [commentText, setCommentText] = useState('')
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 150

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container-brand py-8 lg:py-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          返回博客列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8 xl:col-span-9">
            {/* Article Header */}
            <header className="mb-8">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-small bg-primary/10 text-primary mb-4">
                Go语言
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                深入理解 Go 语言并发模型：从 Goroutine 到 Channel
              </h1>

              {/* Author Info */}
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
                    2026年6月28日
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    25 分钟阅读
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    8,432 阅读
                  </span>
                </div>
              </div>
            </header>

            {/* Cover Image */}
            <div className="relative aspect-[16/9] rounded-xlarge overflow-hidden mb-10 shadow-lg">
              <img
                src="/assets/image_2_yi19x4.jpg"
                alt="Go 语言并发模型"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
            </div>

            {/* Article Content */}
            <div ref={contentRef} className="prose-content space-y-8">
              {/* Introduction with Drop Cap */}
              <section id="introduction">
                <p className="text-lg leading-relaxed text-foreground">
                  <span className="float-left font-serif text-5xl lg:text-6xl font-bold text-primary leading-none mr-3 mt-1">
                    并
                  </span>
                  发编程是现代软件开发中不可或缺的一部分，而 Go 语言从设计之初就将并发作为一等公民。与传统的线程模型不同，Go 语言采用了基于 CSP（Communicating Sequential Processes）理论的并发模型，通过 Goroutine 和 Channel 提供了一种优雅而高效的并发编程方式。这种模型让开发者能够轻松编写高并发程序，而无需过多关注底层的线程调度和同步机制。
                </p>
                <p className="text-base leading-relaxed text-muted-foreground mt-4">
                  在本文中，我们将深入探索 Go 语言并发模型的核心机制，从 Goroutine 的调度原理到 Channel 的底层实现，再到常见的并发模式和最佳实践，帮助你真正理解 Go 并发的设计哲学。
                </p>
              </section>

              {/* Goroutine Basics */}
              <section id="goroutine-basics" className="pt-4">
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Goroutine 基础
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground mb-4">
                  Goroutine 是 Go 语言中最基本的并发执行单元。与操作系统线程相比，Goroutine 非常轻量，初始栈大小仅为 2KB，并且可以根据需要动态增长和收缩。这使得我们可以轻松创建数万个 Goroutine 而不会导致系统资源耗尽。
                </p>
                <p className="text-base leading-relaxed text-muted-foreground mb-4">
                  创建一个 Goroutine 非常简单，只需在函数调用前加上 <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm">go</code> 关键字：
                </p>

                {/* Code Block */}
                <div className="rounded-xlarge overflow-hidden shadow-lg my-6">
                  <div className="bg-[#1e1e1e] px-4 py-2 flex items-center gap-2 border-b border-[#2d2d2d]">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-gray-500 font-mono">goroutine_demo.go</span>
                  </div>
                  <pre className="bg-[#1e1e1e] p-5 overflow-x-auto">
                    <code className="text-sm font-mono leading-relaxed">
                      <span className="text-[#569cd6]">package</span> main

                      <span className="text-[#569cd6]">import</span> (
                        <span className="text-[#ce9178]">"fmt"</span>
                        <span className="text-[#ce9178]">"time"</span>
                      )

                      <span className="text-[#569cd6]">func</span> <span className="text-[#dcdcaa]">sayHello</span>(name <span className="text-[#569cd6]">string</span>) &#123;
                        <span className="text-[#c586c0]">for</span> i := <span className="text-[#b5cea8]">0</span>; i &lt; <span className="text-[#b5cea8]">3</span>; i++ &#123;
                          fmt.<span className="text-[#dcdcaa]">Printf</span>(<span className="text-[#ce9178]">"Hello, %s!\n"</span>, name)
                          time.<span className="text-[#dcdcaa]">Sleep</span>(time.Millisecond * <span className="text-[#b5cea8]">100</span>)
                        &#125;
                      &#125;

                      <span className="text-[#569cd6]">func</span> <span className="text-[#dcdcaa]">main</span>() &#123;
                        <span className="text-[#6a9955]">// 启动两个 Goroutine</span>
                        <span className="text-[#569cd6]">go</span> <span className="text-[#dcdcaa]">sayHello</span>(<span className="text-[#ce9178]">"Alice"</span>)
                        <span className="text-[#569cd6]">go</span> <span className="text-[#dcdcaa]">sayHello</span>(<span className="text-[#ce9178]">"Bob"</span>)

                        time.<span className="text-[#dcdcaa]">Sleep</span>(time.Second)
                        fmt.<span className="text-[#dcdcaa]">Println</span>(<span className="text-[#ce9178]">"Main function done"</span>)
                      &#125;
                    </code>
                  </pre>
                </div>
              </section>

              {/* GMP Model */}
              <section id="gmp-model" className="pt-4">
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  GMP 调度模型
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground mb-4">
                  Go 运行时的调度器采用了经典的 GMP 模型，这是理解 Go 并发性能的关键：
                </p>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground mb-6 ml-4">
                  <li className="leading-relaxed">
                    <strong className="text-foreground">G (Goroutine)</strong>：Goroutine 的抽象，包含栈、程序计数器、所在的 M 等信息。每个 G 都有自己的栈空间。
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-foreground">M (Machine)</strong>：操作系统线程的抽象，由操作系统管理。M 的数量默认最大为 10000，可以通过 runtime.GOMAXPROCS 设置。
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-foreground">P (Processor)</strong>：逻辑处理器，是 M 和 G 之间的桥梁。P 的数量默认等于 CPU 核心数，每个 P 在同一时刻只能执行一个 G。
                  </li>
                </ol>

                <blockquote className="border-l-4 border-primary bg-primary/5 pl-5 pr-4 py-4 my-6 rounded-r-large">
                  <p className="text-foreground italic leading-relaxed">
                    "不要通过共享内存来通信，而应该通过通信来共享内存。"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">—— Go 语言并发设计哲学</p>
                </blockquote>

                <p className="text-base leading-relaxed text-muted-foreground">
                  P 持有一个 G 的本地队列（LRQ），当本地队列为空时，P 会尝试从其他 P 的队列中"窃取"一半的 G 来执行，这就是著名的工作窃取（Work Stealing）算法。这种机制保证了负载均衡，使得所有线程都能保持忙碌状态。
                </p>
              </section>

              {/* Channel Deep Dive */}
              <section id="channel-deep-dive" className="pt-4">
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Channel 深入剖析
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground mb-4">
                  Channel 是 Goroutine 之间通信的管道，是实现 CSP 模型的核心。Channel 是类型安全的，可以通过 <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm">make(chan T)</code> 来创建。
                </p>

                <div className="rounded-xlarge overflow-hidden shadow-lg my-6">
                  <div className="bg-[#1e1e1e] px-4 py-2 flex items-center gap-2 border-b border-[#2d2d2d]">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-gray-500 font-mono">channel_example.go</span>
                  </div>
                  <pre className="bg-[#1e1e1e] p-5 overflow-x-auto">
                    <code className="text-sm font-mono leading-relaxed">
                      <span className="text-[#569cd6]">func</span> <span className="text-[#dcdcaa]">worker</span>(id <span className="text-[#569cd6]">int</span>, jobs &lt;-<span className="text-[#569cd6]">chan</span> <span className="text-[#569cd6]">int</span>, results <span className="text-[#569cd6]">chan</span>&lt;- <span className="text-[#569cd6]">int</span>) &#123;
                        <span className="text-[#c586c0]">for</span> j := <span className="text-[#c586c0]">range</span> jobs &#123;
                          fmt.<span className="text-[#dcdcaa]">Printf</span>(<span className="text-[#ce9178]">"worker %d processing job %d\n"</span>, id, j)
                          time.<span className="text-[#dcdcaa]">Sleep</span>(time.Millisecond * <span className="text-[#b5cea8]">100</span>)
                          results &lt;- j * <span className="text-[#b5cea8]">2</span>
                        &#125;
                      &#125;

                      <span className="text-[#569cd6]">func</span> <span className="text-[#dcdcaa]">main</span>() &#123;
                        jobs := <span className="text-[#dcdcaa]">make</span>(<span className="text-[#569cd6]">chan</span> <span className="text-[#569cd6]">int</span>, <span className="text-[#b5cea8]">100</span>)
                        results := <span className="text-[#dcdcaa]">make</span>(<span className="text-[#569cd6]">chan</span> <span className="text-[#569cd6]">int</span>, <span className="text-[#b5cea8]">100</span>)

                        <span className="text-[#6a9955]">// 启动 3 个 worker</span>
                        <span className="text-[#c586c0]">for</span> w := <span className="text-[#b5cea8]">1</span>; w &lt;= <span className="text-[#b5cea8]">3</span>; w++ &#123;
                          <span className="text-[#569cd6]">go</span> <span className="text-[#dcdcaa]">worker</span>(w, jobs, results)
                        &#125;

                        <span className="text-[#6a9955]">// 发送 9 个任务</span>
                        <span className="text-[#c586c0]">for</span> j := <span className="text-[#b5cea8]">1</span>; j &lt;= <span className="text-[#b5cea8]">9</span>; j++ &#123;
                          jobs &lt;- j
                        &#125;
                        <span className="text-[#dcdcaa]">close</span>(jobs)

                        <span className="text-[#6a9955]">// 收集结果</span>
                        <span className="text-[#c586c0]">for</span> a := <span className="text-[#b5cea8]">1</span>; a &lt;= <span className="text-[#b5cea8]">9</span>; a++ &#123;
                          &lt;-results
                        &#125;
                      &#125;
                    </code>
                  </pre>
                </div>

                <p className="text-base leading-relaxed text-muted-foreground">
                  Channel 的底层实现是一个带锁的环形缓冲区。对于无缓冲 Channel，发送和接收操作是同步的；对于有缓冲 Channel，缓冲区未满时发送是非阻塞的，缓冲区未空时接收是非阻塞的。
                </p>
              </section>

              {/* Select Patterns */}
              <section id="select-patterns" className="pt-4">
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Select 与并发模式
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground mb-4">
                  <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm">select</code> 语句是 Go 并发编程的瑞士军刀，它允许你同时等待多个 Channel 操作。结合 select，我们可以实现多种强大的并发模式：
                </p>

                <div className="rounded-xlarge overflow-hidden shadow-lg my-6">
                  <div className="bg-[#1e1e1e] px-4 py-2 flex items-center gap-2 border-b border-[#2d2d2d]">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-xs text-gray-500 font-mono">select_patterns.go</span>
                  </div>
                  <pre className="bg-[#1e1e1e] p-5 overflow-x-auto">
                    <code className="text-sm font-mono leading-relaxed">
                      <span className="text-[#6a9955]">// 超时控制</span>
                      <span className="text-[#569cd6]">select</span> &#123;
                      <span className="text-[#c586c0]">case</span> res := &lt;-ch:
                        fmt.<span className="text-[#dcdcaa]">Println</span>(res)
                      <span className="text-[#c586c0]">case</span> &lt;-time.<span className="text-[#dcdcaa]">After</span>(time.Second * <span className="text-[#b5cea8]">5</span>):
                        fmt.<span className="text-[#dcdcaa]">Println</span>(<span className="text-[#ce9178]">"timeout"</span>)
                      &#125;

                      <span className="text-[#6a9955]">// 非阻塞发送/接收</span>
                      <span className="text-[#569cd6]">select</span> &#123;
                      <span className="text-[#c586c0]">case</span> msg := &lt;-ch:
                        fmt.<span className="text-[#dcdcaa]">Println</span>(<span className="text-[#ce9178]">"received:"</span>, msg)
                      <span className="text-[#c586c0]">default</span>:
                        fmt.<span className="text-[#dcdcaa]">Println</span>(<span className="text-[#ce9178]">"no message available"</span>)
                      &#125;
                    </code>
                  </pre>
                </div>
              </section>

              {/* Common Pitfalls */}
              <section id="common-pitfalls" className="pt-4">
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  常见陷阱与最佳实践
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground mb-4">
                  在使用 Go 并发特性时，有一些常见的陷阱需要特别注意：
                </p>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
                  <li className="leading-relaxed">
                    <strong className="text-foreground">Goroutine 泄漏</strong>：确保每个启动的 Goroutine 都有明确的退出路径，使用 context 或 done channel 来通知 Goroutine 退出。
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-foreground">Channel 关闭</strong>：通常由发送方关闭 Channel，接收方可以通过 for-range 自动感知 Channel 关闭。
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-foreground">死锁</strong>：注意 Channel 的发送和接收必须配对，避免所有 Goroutine 都在等待对方。
                  </li>
                  <li className="leading-relaxed">
                    <strong className="text-foreground">数据竞争</strong>：即使使用了 Channel，在某些场景下仍可能需要 sync.Mutex 来保护共享资源。使用 <code className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm">go run -race</code> 检测数据竞争。
                  </li>
                </ol>
              </section>

              {/* Conclusion */}
              <section id="conclusion" className="pt-4">
                <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  总结
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground mb-4">
                  Go 语言的并发模型是其最强大的特性之一。通过 Goroutine 的轻量级调度和 Channel 的安全通信，Go 让并发编程变得更加简单和可靠。理解 GMP 调度模型和 Channel 的底层实现，将帮助你写出更高效、更健壮的并发程序。
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  记住，并发编程没有银弹。在实际项目中，需要根据具体场景选择合适的并发模式——无论是 Channel 通信、互斥锁、还是原子操作，都有其适用的场景。多写、多练、多思考，才能真正掌握 Go 并发的精髓。
                </p>
              </section>
            </div>

            {/* Share & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-8 my-8 border-y border-border">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-medium transition-all ${
                    isLiked
                      ? 'bg-red-50 text-red-500'
                      : 'bg-muted text-muted-foreground hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{isLiked ? '已点赞' : '点赞'}</span>
                  <span className="text-xs">128</span>
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

            {/* Author Card */}
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
                    分布式系统工程师，开源爱好者。专注于 Go 语言、云原生、分布式架构等领域。坚持用简洁的文字讲清复杂的技术概念，希望能帮助更多开发者成长。
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
                  <div className="flex flex-wrap gap-2">
                    {['Go', '并发编程', '分布式系统', 'Kubernetes', '云原生'].map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-10">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-primary" />
                评论 <span className="text-lg text-muted-foreground font-normal">({comments.length})</span>
              </h3>

              {/* Comment Input */}
              <div className="card p-5 bg-card mb-6">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的想法..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-medium bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button className="btn-primary">
                    <Send className="w-4 h-4" />
                    发表评论
                  </button>
                </div>
              </div>

              {/* Comment List */}
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
                          <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            {comment.likes}
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

            {/* Related Articles */}
            <div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">相关推荐</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedArticles.map((article) => (
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
                      <div className="absolute top-2.5 left-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 bg-card/90 backdrop-blur-sm text-xs font-medium rounded-small text-foreground">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <h4 className="font-serif text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2 border-t border-border/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block xl:col-span-3">
            <div className="sticky top-24">
              <div className="card p-5 bg-card">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                  <List className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-lg font-semibold text-foreground">目录</h3>
                </div>
                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left text-sm py-2 px-3 rounded-medium transition-all duration-200 flex items-center gap-2 ${
                        activeSection === item.id
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <ChevronRight className={`w-3 h-3 flex-shrink-0 transition-transform ${
                        activeSection === item.id ? 'rotate-90' : ''
                      }`} />
                      {item.title}
                    </button>
                  ))}
                </nav>
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
