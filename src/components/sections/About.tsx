import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { stats } from "../../data/services";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

function CountUp({ end, suffix, duration = 2000 }: { end: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useScrollAnimation(0.3);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-mono">
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  const { ref, isInView } = useScrollAnimation(0.1);

  return (
    <section id="about" className="section-padding border-t border-cream/10 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="font-mono text-xs tracking-widest text-accent uppercase mb-4 block">
              About Us
            </span>
            <h2 className="font-display text-clamp-section font-bold leading-tight mb-8">
              创意
              <br />
              <span className="italic text-stroke">无界</span>
            </h2>

            <div className="space-y-6 text-cream/70 font-light leading-relaxed">
              <p className="text-lg md:text-xl">
                STUDIO NOVA 成立于 2012 年，是一家位于上海的独立创意设计工作室。我们相信优秀的设计能够改变品牌与人们的连接方式。
              </p>
              <p>
                十二年来，我们与来自全球的品牌合作，从初创公司到财富 500 强企业，始终坚持以创意为核心，以策略为导向，为每一个项目注入独特的灵魂。我们的作品横跨品牌设计、数字体验、空间装置等多个领域，斩获包括戛纳创意节、D&AD、One Show 在内的 45 项国际大奖。
              </p>
              <p>
                我们的团队由 15 位来自不同文化背景的设计师、策略师、开发者和艺术家组成。多元的视角让我们能够打破常规，创造真正令人难忘的作品。
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="border-t border-cream/20 pt-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-accent mb-2">
                    <CountUp end={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-widest text-cream/50">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-16 p-8 border border-cream/10 bg-cream/5"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <blockquote className="font-display text-xl md:text-2xl italic leading-relaxed mb-4">
                "设计不是装饰，而是解决问题的艺术。我们追求的，是美与功能的完美平衡。"
              </blockquote>
              <cite className="font-mono text-xs text-cream/50 not-italic">
                — 陈明 / 创始人 & 创意总监
              </cite>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
