import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Phone, Check } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

export default function Contact() {
  const { ref, isInView } = useScrollAnimation(0.1);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: "", email: "", message: "" });
    }, 3000);
  };

  const contactInfo = [
    { icon: Mail, label: "邮箱", value: "hello@studionova.com" },
    { icon: Phone, label: "电话", value: "+86 21 1234 5678" },
    { icon: MapPin, label: "地址", value: "上海市静安区南京西路1788号" },
  ];

  return (
    <section id="contact" className="section-padding border-t border-cream/10">
      <div className="container" ref={ref}>
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs tracking-widest text-accent uppercase mb-4 block">
            Let's Work Together
          </span>
          <h2 className="font-display text-clamp-hero font-bold leading-[0.9]">
            开始您的
            <br />
            <span className="italic text-stroke-accent">项目</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-cream/70 font-light leading-relaxed mb-12">
              无论您是想打造全新品牌，还是升级现有视觉系统，我们都期待与您交流。告诉我们您的想法，让我们一起创造不凡。
            </p>

            <div className="space-y-6 mb-12">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <span className="w-10 h-10 border border-cream/20 flex items-center justify-center group-hover:border-accent group-hover:text-accent transition-colors duration-300 shrink-0">
                    <info.icon size={16} />
                  </span>
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest text-cream/40 mb-1">
                      {info.label}
                    </div>
                    <div className="text-cream group-hover:text-accent transition-colors duration-300">
                      {info.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="mailto:hello@studionova.com"
              className="magnetic-button inline-flex items-center gap-3 border-2 border-cream px-8 py-4 font-mono text-sm uppercase tracking-widest hoverable"
            >
              <span className="button-fill" />
              <span className="button-text flex items-center gap-3">
                发送邮件
                <ArrowUpRight size={18} />
              </span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex flex-col items-center justify-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6"
                  >
                    <Check size={36} className="text-dark" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-medium mb-2">
                    消息已发送
                  </h3>
                  <p className="text-cream/60 font-light text-center">
                    感谢您的来信，我们会在 24 小时内回复您。
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-cream/40 block mb-2">
                      您的姓名
                    </label>
                    <input
                      type="text"
                      className="input-field hoverable"
                      placeholder="请输入姓名"
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-cream/40 block mb-2">
                      电子邮箱
                    </label>
                    <input
                      type="email"
                      className="input-field hoverable"
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-cream/40 block mb-2">
                      项目描述
                    </label>
                    <textarea
                      className="input-field resize-none min-h-[150px] hoverable"
                      placeholder="告诉我们关于您的项目..."
                      rows={6}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="magnetic-button w-full border-2 border-cream py-4 font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-3 mt-8 hoverable"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="button-fill" />
                    <span className="button-text flex items-center gap-3">
                      提交咨询
                      <ArrowUpRight size={18} />
                    </span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
