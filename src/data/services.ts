export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: "1",
    number: "01",
    title: "品牌策略",
    description: "从市场洞察到品牌定位，我们帮助品牌找到独特的声音和视觉语言，构建持久的品牌资产。",
    icon: "Target",
  },
  {
    id: "2",
    number: "02",
    title: "视觉识别",
    description: "打造令人难忘的品牌标识系统，从Logo到完整的视觉规范，确保每个触点都传达一致的品牌价值。",
    icon: "Palette",
  },
  {
    id: "3",
    number: "03",
    title: "数字体验",
    description: "网站、应用、交互装置——我们用代码创造流畅、直觉、令人愉悦的数字产品体验。",
    icon: "Monitor",
  },
  {
    id: "4",
    number: "04",
    title: "动态影像",
    description: "从品牌短片到产品演示，用运动的画面讲述品牌故事，在社交媒体时代抓住眼球。",
    icon: "Film",
  },
  {
    id: "5",
    number: "05",
    title: "空间体验",
    description: "将品牌延伸到物理空间，快闪店、展览、办公室——创造可触摸、可感知的品牌世界。",
    icon: "Building",
  },
  {
    id: "6",
    number: "06",
    title: "艺术指导",
    description: "从创意概念到最终执行，我们提供全方位的艺术方向把控，确保每个项目都达到最高水准。",
    icon: "Sparkles",
  },
];

export interface Stat {
  number: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { number: 12, suffix: "+", label: "年行业经验" },
  { number: 200, suffix: "+", label: "完成项目" },
  { number: 45, suffix: "", label: "国际奖项" },
  { number: 30, suffix: "+", label: "合作品牌" },
];

export const marqueeWords = [
  "创意",
  "设计",
  "品牌",
  "数字",
  "体验",
  "艺术",
  "创新",
  "美学",
];
