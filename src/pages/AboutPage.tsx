import { useState, type ComponentType } from "react";

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
    title: "Creative Front-End",
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
      className="group flex gap-4 rounded-3xl bg-bg-card p-5 sm:gap-5 sm:p-6"
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
        className="section-shell bg-bg-section"
        aria-labelledby="about-me-heading"
      >
        <div className="section-inner">
          <h1
            id="about-me-heading"
            className="type-section-title section-heading"
          >
            About Me
          </h1>

          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
            <div
              className="size-40 shrink-0 rounded-full bg-ash-600 sm:size-48"
              aria-hidden
            />
            <div className="min-w-0 max-w-xl text-center sm:text-left">
              <h2 className="type-hero-subtitle text-text-primary">
                I&apos;m Bill.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">
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

          <ul className="grid gap-6 sm:grid-cols-2">
            {skills.map((skill) => (
              <SkillCard key={skill.title} {...skill} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
