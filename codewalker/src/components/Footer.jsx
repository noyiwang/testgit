import { Link } from 'react-router-dom';
import { Compass, Github, Twitter, MessageCircle, Video, Rss } from 'lucide-react';

const quickLinks = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '技术博客' },
  { path: '/courses', label: '教学课程' },
  { path: '/projects', label: '开源作品' },
  { path: '/about', label: '关于我' },
];

const communityLinks = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: '微信公众号', href: '#' },
  { label: 'Bilibili', href: 'https://bilibili.com' },
  { label: 'RSS 订阅', href: '/rss.xml' },
];

const socialLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: MessageCircle, label: '微信', href: '#' },
  { icon: Video, label: 'Bilibili', href: 'https://bilibili.com' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card py-10 sm:py-12 mt-20">
      <div className="container-brand">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between lg:gap-16">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <Compass className="w-5 h-5 text-primary" />
              <span className="font-serif text-lg font-bold text-foreground">码上行</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              用代码丈量世界，以开源精神连接每一位开发者。
            </p>
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors bg-muted text-muted-foreground hover:text-primary"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex gap-10 sm:gap-12">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">导航</h4>
              <ul className="space-y-2">
                {quickLinks.map(link => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm transition-colors hover:opacity-80 text-muted-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 text-foreground">社区</h4>
              <ul className="space-y-2">
                {communityLinks.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors hover:opacity-80 text-muted-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {currentYear} 码上行. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
