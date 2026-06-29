export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: {
    name: string;
    username: string;
    avatarUrl?: string;
  };
  likes: number;
  copies: number;
}

export const SAMPLE_PROMPTS: Prompt[] = [
  {
    id: "1",
    title: "React Component Generator",
    description: "Generates modern React components with Tailwind CSS styling and clean hooks.",
    content: "Create a clean, responsive, and modern React component for a {{component_name}} using {{css_framework}}. The design should be sleek with tailored colors and support dark mode. Ensure it is written in {{language}} and follows modern standards, including accessibility (ARIA) attributes where appropriate.",
    category: "Development",
    author: {
      name: "Alex Dev",
      username: "alexdev",
    },
    likes: 124,
    copies: 382,
  },
  {
    id: "2",
    title: "Cold Email Outreach Copy",
    description: "Craft highly personalized outreach emails for B2B prospecting.",
    content: "Write a compelling and highly personalized outreach cold email to a {{prospect_role}} at {{company_name}} offering our services in {{service_offered}}. The tone should be {{tone}} and the call to action should be low-friction. Keep it under 150 words.",
    category: "Marketing",
    author: {
      name: "Sarah Chen",
      username: "schen_marketing",
    },
    likes: 89,
    copies: 243,
  },
  {
    id: "3",
    title: "Creative Novel Opener",
    description: "Generate engaging opening scenes for creative writing or novels.",
    content: "Write a captivating opening scene for a {{genre}} novel about a protagonist named {{hero_name}} who discovers a {{mysterious_object}}. The atmosphere should feel {{mood}} and use vivid sensory descriptions. Establish a hook in the first three paragraphs.",
    category: "Creative Writing",
    author: {
      name: "Marcus Vance",
      username: "marcuswriter",
    },
    likes: 156,
    copies: 198,
  },
  {
    id: "4",
    title: "SQL Query Performance Tuning",
    description: "Optimize complex SQL queries for performance, indexing, and readability.",
    content: "Optimize the following SQL query for {{database_engine}} to improve execution performance:\n\n{{sql_query}}\n\nAnalyze potential bottlenecks, suggest indexing strategies, and rewrite the query using CTEs (Common Table Expressions) or window functions if it improves efficiency.",
    category: "Development",
    author: {
      name: "Diana DB",
      username: "diana_data",
    },
    likes: 95,
    copies: 310,
  },
  {
    id: "5",
    title: "SEO Blog Post Outline",
    description: "Structure search engine optimized blog outlines with headings and keywords.",
    content: "Create a detailed SEO-friendly blog post outline for the topic \"{{blog_topic}}\" targeted at {{audience_type}}. Include headings H1-H3, key talking points for each section, primary keywords to target, and a recommended word count of {{word_count}}.",
    category: "Creative Writing",
    author: {
      name: "Leo Content",
      username: "leo_seo",
    },
    likes: 72,
    copies: 188,
  },
  {
    id: "6",
    title: "SaaS Landing Page Hooks",
    description: "High-converting hook headlines for tech/SaaS landing pages.",
    content: "Generate 5 high-converting SaaS landing page hooks for a product called {{product_name}} which helps users {{core_benefit}}. The tone should be {{copywriting_style}} (e.g. bold, analytical, or friendly) and should target pain points directly.",
    category: "Marketing",
    author: {
      name: "Ema Sell",
      username: "ema_saas",
    },
    likes: 112,
    copies: 295,
  },
];
