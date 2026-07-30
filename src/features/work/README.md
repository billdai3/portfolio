# Work

## 新增專案

1. 在 `src/content/work/<slug>.mdx` 新增 MDX（slug = 檔名，kebab-case）。
2. Work 列表、Home Selected Works 與 `/work/<slug>` 路由會由 `lib/registry.ts` 自動掃描 MDX。

## MDX 範本

```mdx
import { createWorkPage } from "@/features/work/lib/createWorkPage";
import { Carousel, Media } from "@/features/work/components/mdx-media";
// 可選：import cover from "./assets/my-project/cover.jpg";

export const metadata = {
  tag: "Product design",
  summary: "列表頁簡述",
  cover: "https://…", // 或 Vite 匯入的圖片 URL
};

export const projectInfo = [
  { label: "專案年份", value: "2025" },
  { label: "角色", value: "Design + front-end" },
];

export default createWorkPage({ metadata });

# 專案標題

<ProjectInfo items={projectInfo} />

正文以單一 `#` 作為頁面標題；列表會由 `rehype-mdx-title` 匯出 `title`。其餘章節用 `##`、`###`。

<Media src="…" alt="…" caption="…" />
<Media src="…" alt="…" width="wide" />
<Media src="…" alt="…" width="page" />

<Carousel caption="流程稿">
  <Media src="…" alt="…" />
  <Media src="…" alt="…" />
</Carousel>
```

## 媒體規則

| 寫法 | 行為 |
|------|------|
| `<Media>` / `![alt](url)` | 與正文同寬；點擊開 lightbox |
| `width="wide"` | 外擴至約 `max-w-5xl` |
| `width="page"` | 吃滿內容殼層寬度 |
| `<Carousel>` | 同區多圖左右切換；點擊帶整組進 lightbox |

文字樣式與 Lab 共用 `baseMdxComponents`（見 `src/features/mdx/`）。

`ProjectInfo` 已註冊在 Work MDX components 中，可直接在 `.mdx` 使用；建議把會出現在列表卡片的資訊保留在 `metadata`，把詳情頁才需要顯示的欄位改放到 `projectInfo`。
