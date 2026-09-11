# Papillon

[momotom](https://github.com/ChenHaoJie9527) 的个人前端博客。记录 JavaScript、TypeScript、React 和前端工程里真正踩过的问题。

**站点：** [https://papillon-x.netlify.app](https://papillon-x.netlify.app)

## 写什么

- JavaScript 语言机制：闭包、原型、事件循环、异步
- TypeScript：泛型、工具类型、条件类型
- React Hooks 与常见前端实践
- 浏览器与工程：Service Worker、截图方案、CSS 布局

文章在 `src/content/posts/`。首页是仪表盘，归档是卡片列表，`/custom-components` 放自己写过的组件演示。

## 本地运行

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm preview
```

站点配置在 `src/site.config.ts`。

## 技术栈

Astro 5、React 19、MDX、Tailwind CSS v4。基于 [MultiTerm Astro](https://github.com/stelcodes/multiterm-astro) 改造。

## License

[MIT](LICENSE)
