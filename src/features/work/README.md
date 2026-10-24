# Work

## 新增專案

1. 新增 `src/content/work/<slug>.meta.ts`（列表用 metadata；slug = 檔名）。
2. 新增 `src/content/work/<slug>.mdx`（詳情正文；與 meta 同名）。
3. Work 列表、Home Selected Works 與 `/work/<slug>` 由 `lib/registry.ts` 掃描 `*.meta.ts` + lazy `*.mdx`。

## Metadata + MDX 範本

```ts
// src/content/work/my-project.meta.ts
import type { WorkProjectMetadata } from "@/features/work/lib/createWorkPage";

export const metadata: WorkProjectMetadata = {
  title: "專案標題",
  tag: "Product design",
  summary: "列表頁簡述",
  // 字串路徑（cover-only resolver；勿在 meta 裡靜態 import 媒體）
  cover: "./assets/my-project/cover.jpg",
  coverVideo: "./assets/my-project/cover-hover.mp4",
};
```

```mdx
import { createWorkPage } from "@/features/work/lib/createWorkPage";
import { metadata } from "./my-project.meta";

export const projectInfo = [
  { label: "專案年份", value: "2025" },
  { label: "角色", value: "Design + front-end" },
];

export default createWorkPage({ metadata });

# 專案標題

<ProjectInfo items={projectInfo} />

列表標題寫在 `.meta.ts` 的 `metadata.title`。正文可保留單一 `#`；其餘章節用 `##`、`###`、`####`。

正文媒體可寫相對路徑（與遠端私有 MDX 相同）；`Media` 會解析成 Vite URL，不必逐張 import：

<Media src="./assets/my-project/hero.webp" alt="…" caption="…" />
<Media src="./assets/my-project/wide.webp" alt="…" width="wide" />
<Media src="./assets/my-project/page.webp" alt="…" width="page" />
<Media
  type="video"
  src="./assets/my-project/demo.mp4"
  poster="./assets/my-project/poster.webp"
  alt="…"
  caption="…"
  width="wide"
  autoPlay
  muted
  loop
/>

<Carousel caption="流程稿">
  <Media src="./assets/my-project/frame-1.webp" alt="…" />
  <Media src="./assets/my-project/frame-2.webp" alt="…" />
</Carousel>

<Comparison
  before="./assets/my-project/before.webp"
  after="./assets/my-project/after.webp"
  alt="…"
  caption="…"
  width="wide"
/>
```

## 媒體規則

| 寫法                      | 行為                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `<Media>` / `![alt](url)` | 與正文同寬；點擊開 lightbox                                   |
| `type="video"`            | self-hosted mp4/webm；預設 `controls` + `playsInline`；無 lightbox |
| `width="wide"`            | 外擴至約 `max-w-5xl`                                          |
| `width="page"`            | 吃滿內容殼層寬度                                              |
| `<Carousel>`              | 同區多圖左右切換；點擊帶整組進 lightbox；僅支援圖片           |
| `<Comparison>`            | before/after 水平擦除對比；可拖中間分隔線；僅圖片、無 lightbox |

影片可用 props：`poster`、`autoPlay`、`muted`、`loop`、`controls`（預設 `true`），以及共用的 `width` / `ratio` / `fit` / `caption`。請勿把 `type="video"` 放進 `<Carousel>`。

`<Comparison>` 用 `before` / `after` 路徑（與 `src` 相同解析規則），可選 `beforeLabel` / `afterLabel`；共用 `width` / `ratio` / `fit` / `caption`。

本地公開正文可用 `./assets/<slug>/...`（檔案放 `src/content/work/assets/`）；`http(s)` 與 Vite `import` 結果仍可直接當 `src`。列表 `metadata.cover`／`coverVideo` 同樣用 `./assets/...` 字串（cover-only resolver，不經正文 Media）。

文字樣式與 Lab 共用 `baseMdxComponents`（見 `src/features/mdx/`）。

`ProjectInfo`、`Media`、`Carousel`、`Comparison` 已註冊在 Work MDX components 中，可直接在 `.mdx` 使用（不必 import）；建議把會出現在列表卡片的資訊保留在 `metadata`，把詳情頁才需要顯示的欄位改放到 `projectInfo`。

## 上鎖專案（私有內容）

公開 repo 只放空殼 MDX（`metadata.isLocked: true` + 列表用 cover／summary／標題）。完整正文放在私有 GitHub repo；機密圖放在 Supabase Storage 的 private bucket（`portfolio-assets`）。私有 repo 名稱勿寫進公開文件，改用環境變數。

### 環境變數

對齊 `.env.example`（本機 `.env` 與 Vercel 都要設；勿 commit 真實值）：

| 變數                   | 用途                                       |
| ---------------------- | ------------------------------------------ |
| `GITHUB_PRIVATE_TOKEN` | 讀取私有 repo 的 GitHub token              |
| `GITHUB_USERNAME`      | 私有 repo 的 owner                         |
| `GITHUB_REPO_NAME`     | 私有 repo 名稱                             |
| `SUPABASE_URL`         | Supabase project URL（Storage + unlock rate limit） |
| `SUPABASE_SECRET_KEY`  | 伺服器端 secret key（Storage 與 `unlock_attempts`） |
| `WORK_UNLOCK_PASSWORD` | 解鎖密碼                                            |
| `WORK_SESSION_SECRET`  | 簽署 session cookie                                 |

本機測解鎖請用：

```bash
# 1) 先烘焙鎖定正文（需要 GITHUB_*）
npm run prebuild:locked-work

# 2) 再開帶 API 的開發伺服器（純 vite 沒有 /api）
npm run dev:vercel
```

`npm run build`（含 Vercel deploy）會自動跑 `prebuild:locked-work`。請確認 Vercel 專案的 **Build** 與 Runtime 都能讀到 `GITHUB_*`；改私人 repo 文章後需重新 deploy 才會更新。

### Unlock rate limit

`POST /api/work-unlock` 依客戶端 IP 計失敗次數（寫入 Supabase 表 `unlock_attempts`）。連續失敗 5 次後冷卻 15 分鐘，回 `429`；密碼正確則清除該 IP 紀錄。未設定 Supabase env 時不擋解鎖（fail open）。

表欄位：

| 欄位           | 說明                                      |
| -------------- | ----------------------------------------- |
| `key`          | text PK，例如 `ip:1.2.3.4`                |
| `fail_count`   | int，目前累計失敗次數                     |
| `locked_until` | timestamptz，冷卻結束時間；未鎖則為 null  |
| `updated_at`   | timestamptz                               |

建議開啟 RLS、不建 anon／authenticated policy（僅 service role 讀寫）。

### 公開空殼 MDX

列表標題請寫在公開殼的 `.meta.ts`；缺則 registry 會用 slug（例如 `c2c-app` → `C2c App`）。

```ts
// c2c-app.meta.ts
export const metadata = {
  title: "C2C 數位資產交易 App",
  cover: "./assets/c2c-app/cover.webp",
  coverVideo: "./assets/c2c-app/cover-hover.mp4",
  tag: "App",
  summary: "提供安全、即時的場外交易",
  isLocked: true,
};
```

```mdx
import { createWorkPage } from "@/features/work/lib/createWorkPage";
import { metadata } from "./c2c-app.meta";

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

MDX 裡繼續寫 `./assets/c2c-app/secret-flow.jpg`（或 `assets/...`）。解鎖 API 回傳前，伺服器會把文件樹裡的路徑改成 Supabase signed URL（`SIGNED_MEDIA_URL_EXPIRES_IN`，目前 1 小時），瀏覽器直連 private bucket 下載。簽發失敗時單張會 fallback 到需 cookie 的 `/api/work-media`。

**Signed URL 洩漏面（刻意取捨）：** 取得內容仍要通過 session／解鎖；但 JSON 內嵌的簽名網址本身是短時通行證——過期前，任何人持有該 URL 即可取檔，**不必再帶 `work_session`**。這是為了少打自家 proxy、加快媒體載入的常見預簽模式，不是疏漏。TTL 刻意長於 work-content 記憶體快取（5 分鐘），避免快取命中時圖鏈已失效。若威脅模型要求「吊銷 session 後媒體立刻不可讀」，需改成一律經 `/api/work-media`（或縮短 TTL 並接受長讀頁中途失效）。

### 私有 MDX 寫法

- 使用 **YAML frontmatter**（不要 `import`／`export`／`createWorkPage`）。
- 一般 JSX **不要**寫 `{...}` 運算式（建置會失敗）。例外：`<ProjectInfo items={projectInfo} />` 會在烘焙時正規化成位置標記，資料仍來自 YAML `projectInfo`，**渲染順序與 MDX 寫的位置相同**（例如 hero `<Media>` 在上、ProjectInfo 在下）。沒寫標記則不插入 ProjectInfo。
- 自訂元件只用字面量 props 的 JSX：`<Media>`、`<Carousel>`、`<Comparison>`（對應本站 `workMdxComponents`）。
- 圖片／影片路徑用相對 `assets/`，例如 `./assets/c2c-app/secret-flow.jpg`（對應 bucket object key `c2c-app/secret-flow.jpg`）。`Media` 的 `src` 與 `poster` 都會在**請求時**簽發（非建置時）。
- 私有圖預設經 signed URL 直連 Storage（見上「洩漏面」）；`/api/work-media` 僅作簽發失敗時的 fallback 代理。
- 建議先壓圖再上傳：長邊約 1600–2000px、WebP 或優化 JPEG，可縮短首次載入。

建置時會把私人 MDX 編成 `lib/server/prebuilt-work/{slug}.json`（gitignore，不進公開前端 bundle）。解鎖 API 只回這份安全文件樹，瀏覽器**不再** `evaluate()` MDX。

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

<Media src="./assets/c2c-app/secret-flow.jpg" alt="Secret flow" width="wide" />

<ProjectInfo items={projectInfo} />
```