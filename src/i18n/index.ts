export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      archive: 'Archive',
      tags: 'Tags',
      latestPosts: 'Latest Posts',
      next: 'Next',
      previous: 'Previous',
    },
    // Common
    common: {
      readMore: 'Read More',
      readingTime: '{{time}} min read',
      publishedOn: 'Published on {{date}}',
      updatedOn: 'Updated on {{date}}',
      tags: 'Tags',
      noTags: 'No tags',
      search: 'Search',
      searchPlaceholder: 'Search posts...',
      noResults: 'No results found',
      loading: 'Loading...',
      error: 'Error',
      backToTop: 'Back to top',
    },
    // Footer
    footer: {
      poweredBy: 'Powered by',
      madeWith: 'Made with',
      by: 'by',
      allRightsReserved: 'All rights reserved',
    },
    // Home page
    home: {
      welcome: 'Welcome',
      description:
        'Personal development blog focusing on React, Vue, Astro, JavaScript, TypeScript and other technology stacks',
      viewAllPosts: 'View all posts',
    },
    // Posts
    posts: {
      relatedPosts: 'Related Posts',
      tableOfContents: 'Table of Contents',
      shareThisPost: 'Share this post',
      comments: 'Comments',
      noComments: 'No comments yet',
    },
    // 404
    notFound: {
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist.',
      backHome: 'Back to Home',
    },
    // Language switcher
    language: {
      en: 'English',
      es: 'Español',
      zh: '中文',
    },
  },
  es: {
    // Navigation
    nav: {
      home: 'Inicio',
      archive: 'Archivo',
      tags: 'Etiquetas',
      latestPosts: 'Últimas Publicaciones',
      next: 'Siguiente',
      previous: 'Anterior',
    },
    // Common
    common: {
      readMore: 'Leer Más',
      readingTime: '{{time}} min de lectura',
      publishedOn: 'Publicado el {{date}}',
      updatedOn: 'Actualizado el {{date}}',
      tags: 'Etiquetas',
      noTags: 'Sin etiquetas',
      search: 'Buscar',
      searchPlaceholder: 'Buscar publicaciones...',
      noResults: 'No se encontraron resultados',
      loading: 'Cargando...',
      error: 'Error',
      backToTop: 'Volver arriba',
    },
    // Footer
    footer: {
      poweredBy: 'Desarrollado con',
      madeWith: 'Hecho con',
      by: 'por',
      allRightsReserved: 'Todos los derechos reservados',
    },
    // Home page
    home: {
      welcome: 'Bienvenido',
      description:
        'Blog de desarrollo personal enfocado en React, Vue, Astro, JavaScript, TypeScript y otras tecnologías',
      viewAllPosts: 'Ver todas las publicaciones',
    },
    // Posts
    posts: {
      relatedPosts: 'Publicaciones Relacionadas',
      tableOfContents: 'Tabla de Contenidos',
      shareThisPost: 'Compartir esta publicación',
      comments: 'Comentarios',
      noComments: 'Aún no hay comentarios',
    },
    // 404
    notFound: {
      title: 'Página No Encontrada',
      message: 'La página que buscas no existe.',
      backHome: 'Volver al Inicio',
    },
    // Language switcher
    language: {
      en: 'English',
      es: 'Español',
      zh: '中文',
    },
  },
  zh: {
    // Navigation
    nav: {
      home: '首页',
      archive: '归档',
      tags: '标签',
      latestPosts: '最新文章',
      next: '下一页',
      previous: '上一页',
    },
    // Common
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
    },
    // Footer
    footer: {
      poweredBy: '由',
      madeWith: '使用',
      by: '制作',
      allRightsReserved: '版权所有',
    },
    // Home page
    home: {
      welcome: '欢迎',
      description:
        '专注于React、Vue、Astro、JavaScript、TypeScript等技术栈的个人开发博客',
      viewAllPosts: '查看所有文章',
    },
    // Posts
    posts: {
      relatedPosts: '相关文章',
      tableOfContents: '目录',
      shareThisPost: '分享这篇文章',
      comments: '评论',
      noComments: '暂无评论',
    },
    // 404
    notFound: {
      title: '页面未找到',
      message: '您访问的页面不存在。',
      backHome: '返回首页',
    },
    // Language switcher
    language: {
      en: 'English',
      es: 'Español',
      zh: '中文',
    },
  },
}

export type Locale = keyof typeof translations
export type TranslationKey = string

// Helper function to get nested value from object by key path
function getNestedValue(obj: any, keyPath: string[]): any {
  let current = obj
  for (const key of keyPath) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return current
}

export function getTranslation(locale: Locale, key: TranslationKey): string {
  const keys = key.split('.')
  
  // Try to get value from requested locale
  let value = getNestedValue(translations[locale], keys)
  
  // If not found and locale is not 'en', fallback to English
  if (value === undefined && locale !== 'en') {
    value = getNestedValue(translations['en'], keys)
  }
  
  // If still not found, return the key itself
  return typeof value === 'string' ? value : key
}

export function t(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string>,
): string {
  let translation = getTranslation(locale, key)

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue)
    })
  }

  return translation
}

// Helper function to get current locale from URL
export function getCurrentLocale(pathname: string): Locale {
  if (pathname.startsWith('/en')) return 'en'
  if (pathname.startsWith('/es')) return 'es'
  if (pathname.startsWith('/zh')) return 'zh'
  return 'zh' // default
}
