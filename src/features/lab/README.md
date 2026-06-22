# Lab

## 新增作品

1. 在 `src/components/sketches/` 新增 sketch（PascalCase 檔名，例如 `MySketch.tsx`）。
2. 在 `src/content/lab/<slug>.mdx` 新增 MDX（slug = 檔名，kebab-case）。
3. Lab 列表與 `/lab/<slug>` 路由會由 `lib/registry.ts` 自動掃描 MDX。

## MDX 範本

```mdx
import { createLabPage } from "@/features/lab/lib/createLabPage";
import MySketch from "@/components/sketches/MySketch";

export const metadata = {
  tag: "Canvas",
  summary: "列表頁簡述",
};

export default createLabPage({
  Sketch: MySketch,
  metadata,
});

# 作品標題

正文以單一 `#` 作為頁面標題；Lab 列表會在 MDX 編譯時由 `rehype-mdx-title` 從此 heading 匯出 `title`（勿依賴 `?raw`）。其餘章節用 `##`、`###`。

Markdown 內容…
```
