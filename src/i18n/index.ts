export const copy = {
  nav: {
    home: '首页',
    archive: '归档',
    tags: '标签',
    latestPosts: '最新文章',
    next: '下一页',
    previous: '上一页',
    components: '组件',
  },
  common: {
    readMore: '阅读更多',
    readingTime: '{{time}} 分钟阅读',
    publishedOn: '发布于 {{date}}',
    updatedOn: '更新于 {{date}}',
    tags: '标签',
    noTags: '无标签',
    search: '搜索',
    searchPlaceholder: '搜索文章...',
    noResults: '未找到结果',
    loading: '加载中...',
    error: '错误',
    backToTop: '返回顶部',
    skipToContent: '跳到正文',
    close: '关闭',
    clear: '清除',
  },
  theme: {
    select: '选择主题',
    searchPlaceholder: '筛选主题',
    noResults: '没有匹配的主题',
  },
  tags: {
    showMore: '显示更多标签',
    showLess: '收起标签',
  },
  components: {
    showcase: '组件展示',
    searchLabel: '搜索组件',
    searchPlaceholder: '搜索组件...',
    category: '分类',
    allCategories: '所有分类',
    categoryUI: 'UI',
    categoryLayout: '布局',
    categoryForm: '表单',
    clearFilters: '清除筛选',
    noMatches: '没有符合筛选条件的组件',
    usage: '使用示例',
    viewSource: '查看源码',
    hideSource: '收起源码',
    sourceCode: '组件源码',
    copy: '复制',
    copied: '已复制',
  },
  codeRunner: {
    run: '运行代码',
    clear: '清空输出',
    running: '运行中',
    output: '输出结果',
    console: '控制台输出',
    returnValue: '返回值',
    noReturn: '代码执行完成（无返回值）',
    error: '错误',
  },
  home: {
    welcome: '欢迎',
    description:
      '专注于React、Vue、Astro、JavaScript、TypeScript等技术栈的个人开发博客',
    viewAllPosts: '查看所有文章',
  },
  posts: {
    relatedPosts: '相关文章',
    tableOfContents: '目录',
    shareThisPost: '分享这篇文章',
    comments: '评论',
    noComments: '暂无评论',
  },
  notFound: {
    title: '页面未找到',
    message: '您访问的页面不存在。',
    backHome: '返回首页',
  },
}

export type TranslationKey = string

function getNestedValue(obj: unknown, keyPath: string[]): unknown {
  let current = obj
  for (const key of keyPath) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }
  return current
}

export function t(key: TranslationKey, params?: Record<string, string>): string {
  const value = getNestedValue(copy, key.split('.'))
  let translation = typeof value === 'string' ? value : key

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue)
    })
  }

  return translation
}
