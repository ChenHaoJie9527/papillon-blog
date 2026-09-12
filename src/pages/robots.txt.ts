import type { APIRoute } from 'astro'
import { withBase } from '../utils'

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
  // `site` is the bare origin, so the base path has to be added explicitly.
  const sitemapURL = new URL(withBase('/sitemap-index.xml'), site)
  return new Response(getRobotsTxt(sitemapURL))
}
