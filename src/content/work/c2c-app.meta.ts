import type { WorkProjectMetadata } from "@/features/work/lib/createWorkPage";

export const metadata: WorkProjectMetadata = {
  title: "C2C 數位資產交易 App",
  cover: "./assets/c2c-app/cover.webp",
  coverVideo: "./assets/c2c-app/cover-hover.mp4",
  hero: "./assets/c2c-app/hero.webp",
  summary: "提供安全、即時的場外交易",
  projectInfo: [
    {label: "服務公司", value: "數位資產服務公司 (名稱保密)"},
    {label: "負責項目", value: "客戶溝通、競品分析、架構規劃、UI/UX 設計、工程交付"},
    {label: "專案期間", value: "2024.01 ~ 2024.05（核心設計 4 個月 + 後續迭代微調）"},
    {label: "交付形式", value: "Web-view 封裝 App"}
  ],
  tag: "App",
  isLocked: true,
  order: 10,
};
