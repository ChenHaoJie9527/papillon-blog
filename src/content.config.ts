import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const schemas = {
  post: ({ image }: { image: any }) =>
    z.object({
      title: z.string(),
      published: z.coerce.date(),
      // updated: z.coerce.date().optional(),
      draft: z.boolean().optional().default(false),
      description: z.string().optional(),
      author: z.string().optional(),
      tags: z.array(z.string()).optional().default([]),
      coverImage: z
        .strictObject({
          src: image(),
          alt: z.string(),
        })
        .optional(),
    }),
  avatarImage: ({ image }: { image: any }) =>
    z.object({
      avatarImage: z
        .object({
          src: image(),
          alt: z.string().optional().default('My avatar'),
        })
        .optional(),
      githubCalendar: z.string().optional(), // GitHub username for calendar
    }),
  coverImage: ({ image }: { image: any }) =>
    z.object({
      avatarImage: z
        .object({
          src: image(),
          alt: z.string().optional().default('My avatar'),
        })
        .optional(),
    }),
}

function createCollection(config: {
  pattern: string | string[]
  base: string
  schema: (params: {image: any}) => z.ZodObject<any>
}) {
  return defineCollection({
    loader: glob({pattern: config.pattern, base: config.base}),
    schema: config.schema,
  })
}

const postsCollection = createCollection({
  pattern: ['**/*.md', '**/*.mdx'],
  base: './src/content/posts',
  schema: schemas.post,
})

const homeCollection = createCollection({
  pattern: ['home.md', 'home.mdx'],
  base: './src/content',
  schema: schemas.avatarImage,
})

// 英文版home集合
const homeEnCollection = createCollection({
  pattern: ['home-en.md', 'home-en.mdx'],
  base: './src/content',
  schema: schemas.avatarImage,
})

// 西班牙语版home集合
const homeEsCollection = createCollection({
  pattern: ['home-es.md', 'home-es.mdx'],
  base: './src/content',
  schema: schemas.avatarImage,
})

const addendumCollection = createCollection({
  pattern: ['addendum.md', 'addendum.mdx'],
  base: './src/content',
  schema: schemas.coverImage,
})

export const collections = {
  posts: postsCollection, // 博客文章集合
  home: homeCollection, // 中文首页内容集合
  'home-en': homeEnCollection, // 英文首页内容集合
  'home-es': homeEsCollection, // 西班牙语首页内容集合
  addendum: addendumCollection, // 附录内容集合
}
