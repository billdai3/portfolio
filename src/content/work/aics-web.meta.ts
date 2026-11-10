import type { WorkProjectMetadata } from "@/features/work/lib/createWorkPage";

export const metadata: WorkProjectMetadata = {
  title: "AI 課程報名網頁",
  cover: "./assets/aics-web/cover.webp",
  coverVideo: "./assets/aics-web/cover-hover.mp4",
  hero: "./assets/aics-web/hero.webp",
  summary: "跳脫傳統的表單體驗，以風格化的視覺引導報名",
  projectInfo: [
    {label: "服務公司", value: "Aetheras"},
    {label: "負責項目", value: "團隊溝通、視覺規劃、UI/UX 設計、工程交付"},
    {label: "專案期間", value: "2025.09 ~ 2025.10 (為期約 3 週)"}
  ],
  tag: "Web",
  isLocked: true,
  order: 20,
};
