import type { SiteConfig } from '@types'

const config: SiteConfig = {
  // 您已发布网站的根目录的绝对网址，用于生成链接和网站地图。
  site: 'https://papillon-x.netlify.app',
  // 网站的名称，用于标题和SEO。
  title: 'Papillon',
  // 网站的描述，用于SEO和RSS订阅。
  description: '专注于React、Next.js、Astro、JavaScript、TypeScript等技术栈的个人开发博客',
  // 网站的作者，用于页脚、SEO和RSS订阅。
  author: 'momotom(ChenHaoJie9527)',
  // SEO的关键词，用于元标签。
  tags: ['Astro', 'Terminal', 'Theme'],
  // 用于生成社交媒体预览的图片路径。
  // 由于社交媒体卡生成器的限制，需要是方形JPEG文件。
  // 尝试使用https://squoosh.app/轻松转换图像为JPEG。
  socialCardAvatarImage: './src/content/avatar.jpg',
  // 从@fontsource或其他地方导入的字体，用于整个网站。
  // 要更改此内容，请参阅src/styles/global.css并导入不同的字体。
  font: 'JetBrains Mono Variable',
  // 分页，每页显示的帖子数量。
  pageSize: 5,
  // 导航链接，显示在页眉中。
  navLinks: [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'Archive',
      url: '/posts',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/ChenHaoJie9527/papillon-blog',
      external: true,
    },
    {
      name: 'Components',
      url: '/custom-components',
    },
  ],
  // 网站的主题配置。
  themes: {
    // 主题模式。"single" | "select" | "light-dark-auto"。
    mode: 'select',
    // 默认主题标识符，当themeMode为"select"或"light-dark-auto"时使用。
    // 确保这是`themes`中列出的主题之一，或"auto"用于"light-dark-auto"模式。
    default: 'houston',
    // 与网站捆绑在一起的Shiki主题。
    // https://expressive-code.com/guides/themes/#using-bundled-themes
    // 这些将用于主题整个网站，以及语法高亮。
    // 要使用light-dark-auto模式，只需按顺序包含一个亮色和一个暗色主题。
    // include: [
    //   'github-light',
    //   'github-dark',
    // ]
    include: [
      'andromeeda',
      'aurora-x',
      'ayu-dark',
      'catppuccin-frappe',
      'catppuccin-latte',
      'catppuccin-macchiato',
      'catppuccin-mocha',
      'dark-plus',
      'dracula',
      'dracula-soft',
      'everforest-dark',
      'everforest-light',
      'github-dark',
      'github-dark-default',
      'github-dark-dimmed',
      'github-dark-high-contrast',
      'github-light',
      'github-light-default',
      'github-light-high-contrast',
      'gruvbox-dark-hard',
      'gruvbox-dark-medium',
      'gruvbox-dark-soft',
      'gruvbox-light-hard',
      'gruvbox-light-medium',
      'gruvbox-light-soft',
      'houston',
      'kanagawa-dragon',
      'kanagawa-lotus',
      'kanagawa-wave',
      'laserwave',
      'light-plus',
      'material-theme',
      'material-theme-darker',
      'material-theme-lighter',
      'material-theme-ocean',
      'material-theme-palenight',
      'min-dark',
      'min-light',
      'monokai',
      'night-owl',
      'nord',
      'one-dark-pro',
      'one-light',
      'plastic',
      'poimandres',
      'red',
      'rose-pine',
      'rose-pine-dawn',
      'rose-pine-moon',
      'slack-dark',
      'slack-ochin',
      'snazzy-light',
      'solarized-dark',
      'solarized-light',
      'synthwave-84',
      'tokyo-night',
      'vesper',
      'vitesse-black',
      'vitesse-dark',
      'vitesse-light',
    ],
  },
  // 社交媒体链接，显示在页脚中。
  socialLinks: {
    github: 'https://github.com/ChenHaoJie9527/papillon-blog',
    // mastodon: 'https://github.com/ChenHaoJie9527/papillon-blog',
    email: '13802406705@163.com',
    // linkedin: 'https://github.com/ChenHaoJie9527/papillon-blog',
    // bluesky: 'https://github.com/ChenHaoJie9527/papillon-blog',
    // twitter: 'https://github.com/ChenHaoJie9527/papillon-blog',
  },
  // Giscus评论的配置。
  // 要设置Giscus，请按照https://giscus.app/的说明进行操作。
  // 要设置Giscus，请按照https://giscus.app/的说明进行操作。
  // 您需要一个带有讨论功能的GitHub存储库，并安装Giscus应用程序。
  // 从https://giscus.app生成的脚本标签中获取值，并将其填入此处。
  // 如果您不想使用Giscus，请将其设置为undefined。
  giscus: {
    repo: 'ChenHaoJie9527/papillon-blog',
    repoId: 'R_kgDOPXEF4g',
    category: 'General',
    categoryId: 'DIC_kwDOPXEF4s4CttwV',
    reactionsEnabled: true, // 启用帖子本身的反应
  },
}

export default config
