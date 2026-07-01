import { motion } from "framer-motion";
import { ArrowUpRight, Target, Palette, Monitor, Film, Building, Sparkles, type LucideIcon } from "lucide-react";
import { services } from "../../data/services";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Palette,
  Monitor,
  Film,
  Building,
  Sparkles,
};

export default function Services() {
  const { ref, isInView } = useScrollAnimation(0.1);

  return (
    <section id="services" className="section-padding border-t border-cream/10">
      <div className="container" ref={ref}>
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs tracking-widest text-accent uppercase mb-4 block">
            What We Do
          </span>
          <h2 className="font-display text-clamp-section font-bold leading-tight">
            我们的<span className="italic text-accent">服务</span>
          </h2>
        </motion.div>

        <div className="border-t border-cream/10">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon];
            return (
              <motion.div
                key={service.id}
                className="service-item border-b border-cream/10 py-8 md:py-12 cursor-pointer group hoverable"
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                  <span className="font-mono text-sm text-cream/40 w-16">
                    {service.number}
                  </span>

                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-4 md:w-80">
                      <span className="w-12 h-12 border border-cream/20 flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-colors duration-300">
                        {IconComponent && <IconComponent size={20} />}
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl font-medium group-hover:text-accent transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-cream/60 font-light text-sm md:text-base md:flex-1 max-w-xl">
                      {service.description}
                    </p>
                  </div>

                  <motion.span
                    className="w-12 h-12 border border-cream/20 rounded-full flex items-center justify-center ml-auto md:ml-0 group-hover:bg-accent group-hover:border-accent group-hover:text-dark transition-all duration-300"
                    whileHover={{ rotate: 45 }}
                  >
                    <ArrowUpRight size={18} />
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
