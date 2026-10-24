# Lab

## 新增作品

1. 在 `src/components/sketches/` 新增 sketch（PascalCase 檔名，例如 `MySketch.tsx`）。
2. 新增 `src/content/lab/<slug>.meta.ts`（列表 metadata）與 `<slug>.mdx`（詳情；同名）。
3. Lab 列表與 `/lab/<slug>` 由 `lib/registry.ts` 掃描 `*.meta.ts` + lazy `*.mdx`（Sketch 只進詳情 chunk）。

## OpenProcessing / 獨立 HTML sketch

來自 OpenProcessing 等平台的 `index.html` + sketch JS，可放在 `public/<slug>/`（Vite 會原樣掛到網站根路徑）。

1. Sketch 元件用滿版 iframe 指向該路徑（例如 `src="/abstract-clock/index.html"`）。
2. 在 MDX 裡照常 `createLabPage({ Sketch, metadata })`。
3. 需要跟 React / Leva 深度整合時，再把 sketch 改成 instance mode 搬進 `src/components/sketches/`。

## MDX 範本

```ts
// src/content/lab/my-project.meta.ts
import type { LabProjectMetadata } from "@/features/lab/lib/createLabPage";

export const metadata: LabProjectMetadata = {
  title: "作品標題",
  tag: "Canvas",
  summary: "列表頁簡述",
  cover: "./assets/my-project/cover.jpg",
  coverVideo: "./assets/my-project/cover-hover.mp4",
};
```

```mdx
import { createLabPage } from "@/features/lab/lib/createLabPage";
import MySketch from "@/components/sketches/MySketch";
import { metadata } from "./my-project.meta";

export default createLabPage({
  Sketch: MySketch,
  metadata,
});

# 作品標題

列表標題寫在 `.meta.ts`。Sketch 只隨詳情 MDX lazy 載入。正文可保留單一 `#`；其餘章節用 `##`、`###`、`####`。

Markdown 內容…
```
