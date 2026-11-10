import type { WorkProjectMetadata } from "@/features/work/lib/createWorkPage";

export const metadata: WorkProjectMetadata = {
  title: "C2C 雙後台系統：介面標準化與設計系統建置",
  cover: "./assets/c2c-admins/cover.webp",
  coverVideo: "./assets/c2c-admins/cover-hover.mp4",
  hero: "./assets/c2c-admins/hero.webp",
  summary: "視覺收斂，建立更具擴充性的元件庫",
  projectInfo: [
    {label: "服務公司", value: "數位資產服務公司 (名稱保密)"},
    {label: "負責項目", value: "客戶溝通、架構規劃、UI/UX 設計、工程交付"},
    {label: "專案期間", value: "Phase 1 (MVP)：2024.06 ~ 2024.09 (核心設計 3 個月 + 後續迭代微調) | Phase 2 (自主 UI 調整)：2025.05 (為期約 2 週)"}
  ],
  tag: "Web",
  isLocked: true,
  order: 30,
};
