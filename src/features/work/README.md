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

| 寫法                      | 行為                                    |
| ------------------------- | --------------------------------------- |
| `<Media>` / `![alt](url)` | 與正文同寬；點擊開 lightbox             |
| `width="wide"`            | 外擴至約 `max-w-5xl`                    |
| `width="page"`            | 吃滿內容殼層寬度                        |
| `<Carousel>`              | 同區多圖左右切換；點擊帶整組進 lightbox |

文字樣式與 Lab 共用 `baseMdxComponents`（見 `src/features/mdx/`）。

`ProjectInfo` 已註冊在 Work MDX components 中，可直接在 `.mdx` 使用；建議把會出現在列表卡片的資訊保留在 `metadata`，把詳情頁才需要顯示的欄位改放到 `projectInfo`。

## 上鎖專案（私有內容）

公開 repo 只放空殼 MDX（`metadata.isLocked: true` + 列表用 cover／summary／標題）。完整正文放在私有 GitHub repo；機密圖放在 Supabase Storage 的 private bucket（`portfolio-assets`）。私有 repo 名稱勿寫進公開文件，改用環境變數。

### 環境變數

對齊 `.env.example`（本機 `.env` 與 Vercel 都要設；勿 commit 真實值）：

| 變數                   | 用途                                       |
| ---------------------- | ------------------------------------------ |
| `GITHUB_PRIVATE_TOKEN` | 讀取私有 repo 的 GitHub token              |
| `GITHUB_USERNAME`      | 私有 repo 的 owner                         |
| `GITHUB_REPO_NAME`     | 私有 repo 名稱                             |
| `SUPABASE_URL`         | Supabase project URL                       |
| `SUPABASE_SECRET_KEY`  | 伺服器端讀取 private Storage 的 secret key |
| `WORK_UNLOCK_PASSWORD` | 解鎖密碼                                   |
| `WORK_SESSION_SECRET`  | 簽署 session cookie                        |

本機測解鎖請用 `npm run dev:vercel`（純 `vite` 沒有 `/api`）。

### 公開空殼 MDX

列表標題來自公開殼的 `#` 或匯出的 `title`；都沒有則 registry 會用 slug（例如 `c2c-app` → `C2c App`）。

```mdx
import cover from "./assets/c2c-app/placeholder-cover.jpg";
import { createWorkPage } from "@/features/work/lib/createWorkPage";

export const metadata = {
  cover,
  tag: "App",
  summary: "提供安全、即時的場外交易",
  isLocked: true,
};

export default createWorkPage({ metadata });

# C2C 數位資產交易 App
```

### 私有內容結構

`<slug>.mdx` 檔名須與公開殼 slug 一致。MDX 仍放私有 GitHub repo；圖片改放 Supabase bucket `portfolio-assets`。

```text
<private-repo>/
└── c2c-app.mdx

Supabase bucket `portfolio-assets`/
└── c2c-app/
    └── secret-flow.jpg
```

MDX 裡繼續寫 `./assets/c2c-app/secret-flow.jpg`（或 `assets/...`）。解鎖載入正文時，伺服器會把路徑改成 Supabase signed URL（約 1 小時有效），瀏覽器直連 private bucket 下載。簽發失敗時單張會 fallback 到需 cookie 的 `/api/work-media`。

### 私有 MDX 寫法

- 使用 **YAML frontmatter**（不要 `import`／`export`／`createWorkPage`）。
- Frontmatter 欄位（如 `projectInfo`）會在執行期注入成變數，正文可寫 `items={projectInfo}`。
- 自訂元件直接寫 JSX 標籤：`<Media>`、`<Carousel>`、`<ProjectInfo>`（對應本站 `workMdxComponents`）。
- 圖片路徑用相對 `assets/`，例如 `./assets/c2c-app/secret-flow.jpg`（對應 bucket object key `c2c-app/secret-flow.jpg`）。
- 私有圖預設經 signed URL 直連 Storage；`/api/work-media` 僅作簽發失敗時的 fallback 代理。
- 建議先壓圖再上傳：長邊約 1600–2000px、WebP 或優化 JPEG，可縮短首次載入。

```mdx
---
title: C2C App
tag: App
summary: 提供安全、即時的場外交易
projectInfo:
  - label: 角色
    value: Design
---

# C2C App

<ProjectInfo items={projectInfo} />

<Media src="./assets/c2c-app/secret-flow.jpg" alt="Secret flow" width="wide" />
```
