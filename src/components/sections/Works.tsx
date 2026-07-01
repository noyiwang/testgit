import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { projects, categories, Project } from "../../data/projects";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export default function Works() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { ref, isInView } = useScrollAnimation(0.1);

  const filteredProjects =
    activeCategory === "全部"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="works" className="section-padding">
      <div className="container" ref={ref}>
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div>
            <span className="font-mono text-xs tracking-widest text-accent uppercase mb-4 block">
              Selected Works
            </span>
            <h2 className="font-display text-clamp-section font-bold leading-tight">
              精选<span className="italic text-stroke">项目</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-300 hoverable ${
                  activeCategory === category
                    ? "bg-cream text-dark border-cream"
                    : "border-cream/20 text-cream/60 hover:border-cream hover:text-cream"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.65, 0, 0.35, 1],
                  },
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`project-card group cursor-pointer hoverable ${
                  index % 3 === 0 ? "md:col-span-2" : ""
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden border border-cream/10">
                  <div className="aspect-[16/10] overflow-hidden bg-dark-lighter">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="project-card-image w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/60 transition-colors duration-500 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                        <ArrowUpRight size={24} className="text-dark" />
                      </span>
                    </motion.div>
                  </div>
                </div>

                <div className="pt-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-2xl md:text-clamp-card font-medium mb-2 group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-4 font-mono text-xs text-cream/50">
                      <span>{project.category}</span>
                      <span>—</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-cream/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
              className="container py-20 md:py-32"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="fixed top-6 right-6 w-12 h-12 border border-cream/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors hoverable z-10"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <span className="font-mono text-xs tracking-widest text-accent uppercase">
                  {selectedProject.category} — {selectedProject.year}
                </span>
              </div>

              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                {selectedProject.title}
              </h2>

              <div className="aspect-video w-full overflow-hidden mb-12 border border-cream/10">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2">
                  <p className="text-lg md:text-xl text-cream/80 font-light leading-relaxed mb-8">
                    {selectedProject.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-cream/20 font-mono text-xs text-cream/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedProject.client && (
                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-widest text-cream/40 mb-2">
                        客户
                      </h4>
                      <p className="text-cream">{selectedProject.client}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-cream/40 mb-2">
                      年份
                    </h4>
                    <p className="text-cream">{selectedProject.year}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-cream/40 mb-2">
                      类别
                    </h4>
                    <p className="text-cream">{selectedProject.category}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
