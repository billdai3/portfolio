# Lab

## 新增作品

1. 在 `src/components/sketches/` 新增 sketch（PascalCase 檔名，例如 `MySketch.tsx`）。
2. 在 `src/content/lab/<slug>.mdx` 新增 MDX（slug = 檔名，kebab-case）。
3. Lab 列表與 `/lab/<slug>` 路由會由 `registry.ts` 自動掃描 MDX。

## MDX 範本

```mdx
import { createLabPage } from "@/lab/createLabPage";
import MySketch from "@/components/sketches/MySketch";

export const metadata = {
  title: "作品標題",
  tag: "Canvas",
  summary: "列表頁簡述",
};

export default createLabPage({
  Sketch: MySketch,
  metadata,
});

# 正文標題

Markdown 內容…
```
