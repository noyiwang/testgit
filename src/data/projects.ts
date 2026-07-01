export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  client?: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: "1",
    title: "LUMIERE",
    category: "品牌设计",
    year: "2024",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimalist%20luxury%20fashion%20brand%20campaign%20photo%20editorial%20style%20black%20and%20white%20high%20contrast&image_size=landscape_16_9",
    description: "为高端时尚品牌 LUMIERE 打造的全新视觉识别系统，融合极简美学与东方意蕴，重新定义奢侈品在数字时代的表达方式。",
    client: "LUMIERE Paris",
    tags: ["品牌策略", "视觉识别", "艺术指导"],
  },
  {
    id: "2",
    title: "NEON PULSE",
    category: "数字体验",
    year: "2024",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=neon%20cyberpunk%20digital%20art%20abstract%20geometric%20shapes%20dark%20background%20electric%20blue%20glow&image_size=landscape_16_9",
    description: "沉浸式音乐流媒体平台的交互设计，通过动态视觉系统和3D音频可视化，创造独特的感官体验。",
    client: "Neon Pulse Music",
    tags: ["UI/UX", "动效设计", "WebGL"],
  },
  {
    id: "3",
    title: "TERRA",
    category: "空间设计",
    year: "2023",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20organic%20architecture%20interior%20design%20natural%20materials%20wood%20stone%20warm%20lighting%20minimalist&image_size=landscape_16_9",
    description: "可持续生活方式品牌 TERRA 的线下体验空间设计，将自然元素融入现代建筑，营造沉浸式品牌叙事。",
    client: "TERRA Living",
    tags: ["空间设计", "品牌体验", "可持续设计"],
  },
  {
    id: "4",
    title: "ECHO",
    category: "品牌设计",
    year: "2023",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=editorial%20typography%20design%20bold%20serif%20fonts%20magazine%20layout%20black%20cream%20colors%20artistic&image_size=landscape_16_9",
    description: "独立出版机构 ECHO 的品牌重塑项目，以文字为核心视觉元素，致敬印刷工艺与阅读文化。",
    client: "ECHO Press",
    tags: ["品牌设计", "印刷品设计", "字体定制"],
  },
  {
    id: "5",
    title: "VAPOR",
    category: "数字体验",
    year: "2024",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ethereal%20gradient%20mesh%20art%20soft%20pastel%20colors%20purple%20pink%20dreamy%20abstract%20digital&image_size=landscape_16_9",
    description: "健康科技应用 VAPOR 的产品设计，通过柔和的渐变和有机形态，将冥想体验转化为直观的数字界面。",
    client: "Vapor Wellness",
    tags: ["产品设计", "UI/UX", "动效"],
  },
  {
    id: "6",
    title: "MONOLITH",
    category: "艺术指导",
    year: "2023",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=brutalist%20architecture%20photography%20concrete%20geometric%20shapes%20dramatic%20shadows%20monochrome&image_size=landscape_16_9",
    description: "当代艺术展览 MONOLITH 的整体视觉规划，从展览空间到画册出版，构建完整的感官叙事。",
    client: "Nova Art Foundation",
    tags: ["艺术指导", "展览设计", "出版物"],
  },
];

export const categories = ["全部", "品牌设计", "数字体验", "空间设计", "艺术指导"];
