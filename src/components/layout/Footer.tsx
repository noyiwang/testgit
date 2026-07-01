import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, ArrowUpRight } from "lucide-react";

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
];

const footerLinks = [
  {
    title: "导航",
    links: [
      { label: "作品", href: "#works" },
      { label: "服务", href: "#services" },
      { label: "关于", href: "#about" },
      { label: "联系", href: "#contact" },
    ],
  },
  {
    title: "服务",
    links: [
      { label: "品牌策略", href: "#" },
      { label: "视觉识别", href: "#" },
      { label: "数字体验", href: "#" },
      { label: "艺术指导", href: "#" },
    ],
  },
  {
    title: "联系",
    links: [
      { label: "hello@studionova.com", href: "mailto:hello@studionova.com" },
      { label: "+86 21 1234 5678", href: "tel:+862112345678" },
      { label: "上海市静安区", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 pt-20 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <motion.a
              href="#"
              className="font-display text-4xl md:text-5xl font-bold tracking-tight block mb-6 hoverable"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              STUDIO<span className="text-accent">/</span>NOVA
            </motion.a>
            <p className="text-cream/60 max-w-sm mb-8 font-light leading-relaxed">
              我们是一家创意设计工作室，致力于为野心勃勃的品牌创造令人难忘的视觉体验。
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 border border-cream/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors duration-300 hoverable"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {footerLinks.map((column, colIndex) => (
            <div key={column.title}>
              <motion.h4
                className="font-mono text-xs uppercase tracking-widest text-cream/40 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: colIndex * 0.1 }}
              >
                {column.title}
              </motion.h4>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: colIndex * 0.1 + linkIndex * 0.05,
                    }}
                  >
                    <a
                      href={link.href}
                      className="text-cream/80 hover:text-accent transition-colors duration-300 inline-flex items-center gap-1 group hoverable"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-cream/40">
            © 2024 STUDIO NOVA. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="font-mono text-xs text-cream/40 hover:text-cream transition-colors hoverable">
              隐私政策
            </a>
            <a href="#" className="font-mono text-xs text-cream/40 hover:text-cream transition-colors hoverable">
              使用条款
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
