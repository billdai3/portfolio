# Bill's Portfolio

這是我的個人 UI/UX 作品集網站，主要放了商業專案的 Case Study 與一些 Creative Coding 的實驗。專案採用了 Vite + React 框架，並透過 Cursor 輔助開發 (Vibe Coding) 完成網站的建置及部署。

## 🛠 Tech Stack

- **Framework:** React, Vite
- **Styling & Animation:** Tailwind CSS, GSAP
- **Content Management:** MDX
- **Database & Storage:** Supabase
- **Deployment:** Vercel

## ✨ Key Highlights & Architecture

### 1. AI-Assisted Workflow (Vibe Coding)

專案的底層邏輯與架構主要利用 Cursor 輔助建構，我透過「精準的技術提問與意圖說明」，結合基礎的 Vue/React 概念，以設計工程 (Design Engineering) 的思維角度去做 Prototyping 實現與最終上線。

### 2. Design System & Animation

- **Design Tokens:** 運用對 Design System 的熟悉，將視覺規範透過 Tailwind CSS 實現，讓網站的樣式維持一致性。
- **Custom Icons:** 捨棄初期快速開發用的 Lucide icons，網站圖標最後都替換成利用 Figma 繪製的 SVG。
- **Micro-interactions:** 使用 GSAP 操控 SVG 時間軸，實現流暢的網頁微動畫。

### 3. Content & Performance Optimization

- **MDX Case Studies:** 專案 Case study 使用 MDX 去做封裝，兼具 Markdown 的寫作便利性與 React 元件（如客製 Carousel）的擴充彈性。
- **Secure & Fast Asset Delivery:** 上鎖的專案及圖片原先存放於 GitHub Private Repo，但因 GitHub API 提取有延遲，後續將圖片遷移到 Supabase。透過具時效性的 Signed URL 提取圖片，除了保有不公開的安全性，也優化專案頁的載入效能。

## 🚀 Local Development

如果你想在本地端運行此專案，請參考以下步驟：

```bash
# 1. Clone the repository
git clone https://github.com/billdai3/portfolio.git

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
# 請在根目錄建立 .env 檔，並填入 Supabase 等相關金鑰（可參考 .env.example）

# 4. Start the development server
npm run dev
```
