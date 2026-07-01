import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { marqueeWords } from "../../data/services";
import { useParallax } from "../../hooks/useScrollAnimation";

export default function Hero() {
  const scrollY = useParallax();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const wordVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink/5 rounded-full blur-[100px]" />
      </div>

      <div className="container pt-32 pb-16 relative z-10">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="font-mono text-xs tracking-widest text-accent uppercase">
            Creative Design Studio — Est. 2012
          </span>
        </motion.div>

        <motion.h1
          className="font-display font-bold leading-[0.9] tracking-tight mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="block text-clamp-hero overflow-hidden"
            variants={wordVariants}
          >
            We create
          </motion.span>
          <motion.span
            className="block text-clamp-hero italic text-stroke-accent overflow-hidden pl-[15vw]"
            variants={wordVariants}
          >
            unforgettable
          </motion.span>
          <motion.span
            className="block text-clamp-hero overflow-hidden"
            variants={wordVariants}
          >
            brand <span className="text-accent">experiences.</span>
          </motion.span>
        </motion.h1>

        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-lg md:text-xl text-cream/70 max-w-md font-light leading-relaxed">
            STUDIO NOVA 是一家位于上海的创意设计工作室，专注于为野心勃勃的品牌打造独特的视觉语言和数字体验。
          </p>

          <a
            href="#works"
            className="group flex items-center gap-4 font-mono text-sm uppercase tracking-widest hoverable w-fit"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#works")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="link-underline">探索作品</span>
            <motion.span
              className="w-12 h-12 border border-cream/30 rounded-full flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-colors duration-300"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={18} className="group-hover:text-accent transition-colors" />
            </motion.span>
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 py-6 border-t border-cream/10 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map(
              (word, index) => (
                <span
                  key={index}
                  className="font-display text-4xl md:text-6xl mx-8 text-cream/20 italic"
                >
                  {word}
                  <span className="text-accent mx-8">✦</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
