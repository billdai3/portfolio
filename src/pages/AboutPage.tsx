import { useState, type ComponentType } from "react";

import CtaLink from "../components/CtaLink";
import SkillCodingAnimation from "../components/SkillCodingAnimation";
import SkillDesignAnimation from "../components/SkillDesignAnimation";
import SkillSystemAnimation from "../components/SkillSystemAnimation";
import SkillWorkflowAnimation from "../components/SkillWorkflowAnimation";

type SkillAnimationProps = {
  className?: string;
  active?: boolean;
};

const skills: {
  title: string;
  description: string;
  Animation: ComponentType<SkillAnimationProps>;
}[] = [
  {
    title: "Figma & UI Prototyping",
    description:
      "熟練運用 Figma 製作數位產品的設計稿及可動原型。有設計、優化過多個網站及 App 的經驗。",
    Animation: SkillDesignAnimation,
  },
  {
    title: "Design System Architecture",
    description:
      "熟悉設計系統的建立及維護，包含 Design Tokens 的使用、元件庫的製作、設計規格的撰寫等。",
    Animation: SkillSystemAnimation,
  },
  {
    title: "Design-to-Code",
    description:
      "瞭解網頁結構、樣式規則及互動邏輯等前端知識，並能運用相關技術來設計標準的互動式 RWD 網頁，讓設計能夠準確地落地實現。",
    Animation: SkillCodingAnimation,
  },
  {
    title: "AI-Empowered Delivery",
    description:
      "擁有完整的實務經驗，也能夠運用 Coding Agent 參與開發。能夠有效地與利害關係人、團隊溝通協作，推動專案順利上線。",
    Animation: SkillWorkflowAnimation,
  },
];

const buildNotes: { title: string; description: string }[] = [
  {
    title: "開發框架",
    description:
      "主要使用 Cursor 輔助開發，透過 Vibe coding 的方式去一步步建構網站。框架是選用目前主流且能夠快速啟動的 Vite + React，雖然較深入的技術架構還不是很熟悉，但透過 Cursor 以及自學過一點 Vue 的知識，在開發過程中還是能夠大致理解進程、並且精準向 AI 提問或是說明意圖。",
  },
  {
    title: "視覺與動態",
    description:
      "視覺方面是使用 Tailwind CSS 來做處理，原先就很熟悉 Design tokens 了，所以使用起來很順手。網站中的一些小動畫是利用 GSAP 去操控 SVG 做時間軸動畫。Icon 部分，原先使用 Lucide icon 來做快速開發，最後決定替換成自己用 Figma 繪製的 Icon。",
  },
  {
    title: "內容與資料庫",
    description:
      "專案 Case study 使用了 MDX 的技術去做包裝，讓我可以用 Markdown 的格式去撰寫，也能自己決定 Markdown 的樣式，且能安插自製的 React 元件（主要是圖片類的元件如 Carousel 等）。上鎖的專案 MDX 是另外存放在 Github 的 Private repo 裡，圖片原先也是，不過後來發現用 Github API 提取圖片太久 ，所以改成存放在 Supabase 中，透過有時效性的 Signed URL，讓我能夠快速提取圖片的同時保有安全性。最後再使用 Vercel 的服務去做網站的部署上線。過程中也算是邊做邊學，詳細的程式架構及過程中的 Commits 可以在我的作品集 Repo 中看到。",
  },
];

function SkillCard({
  title,
  description,
  Animation,
}: {
  title: string;
  description: string;
  Animation: ComponentType<SkillAnimationProps>;
}) {
  const [active, setActive] = useState(false);

  return (
    <li
      className="group flex flex-col items-center gap-4 rounded-3xl bg-bg-card p-5 text-center sm:flex-row sm:gap-5 sm:p-6 sm:text-left"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="size-30 shrink-0 overflow-hidden rounded-xl" aria-hidden>
        <Animation className="size-full" active={active} />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-base font-extrabold tracking-tight text-text-primary transition-colors group-hover:text-brand sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary transition-colors group-hover:text-text-primary">
          {description}
        </p>
      </div>
    </li>
  );
}

export default function AboutPage() {
  return (
    <div className="text-text-primary">
      <section
        className="section-shell bg-bg-section pt-32 pb-16 sm:pt-40 sm:pb-24"
        aria-label="About me"
      >
        <div className="section-inner">
          <div className="group flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
            <div
              className="size-40 shrink-0 rounded-full bg-ash-600 sm:size-48"
              aria-hidden
            />
            <div className="max-w-xl min-w-0 text-center sm:text-left">
              <h1 className="type-hero-subtitle text-text-primary transition-colors group-hover:text-brand">
                我是 Bill
              </h1>
              <p className="mt-4 text-base leading-relaxed text-text-secondary transition-colors group-hover:text-text-primary">
                UI/UX 設計師，參與過多個從 0 到 1 的 Web 與 App
                專案，負責從需求釐清到設計落地，並與 PM、工程團隊密切合作。熟悉
                Figma、Adobe
                等設計工具，擅長設計系統建立及維護，並協助團隊建立設計流程、提升專案效率與設計一致性。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-shell bg-bg-section-alt"
        aria-labelledby="skills-heading"
      >
        <div className="section-inner">
          <h2
            id="skills-heading"
            className="type-section-title section-heading"
          >
            Skills
          </h2>

          <ul className="grid gap-6 lg:grid-cols-2">
            {skills.map((skill) => (
              <SkillCard key={skill.title} {...skill} />
            ))}
          </ul>
        </div>
      </section>

      <section
        className="section-shell bg-bg-section"
        aria-labelledby="how-i-built-heading"
      >
        <div className="section-inner">
          <h2
            id="how-i-built-heading"
            className="type-section-title section-heading"
          >
            How I Built This Site
          </h2>

          <ul className="mx-auto max-w-2xl list-none space-y-8">
            {buildNotes.map((note) => (
              <li key={note.title} className="group">
                <h3 className="font-display text-base font-extrabold tracking-tight text-text-primary transition-colors group-hover:text-brand sm:text-lg">
                  {note.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary transition-colors group-hover:text-text-primary">
                  {note.description}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center sm:mt-12">
            <CtaLink
              href="https://github.com/billdai3/portfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </CtaLink>
          </p>
        </div>
      </section>
    </div>
  );
}
