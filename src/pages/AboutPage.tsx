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
    title: "Figma",
    description:
      "熟悉軟體操作，有設計和優化多個網頁及 App 的經驗，包括製作 Wireframe、Mockup 及 Prototype 等。",
    Animation: SkillDesignAnimation,
  },
  {
    title: "Design System",
    description:
      "熟悉設計系統的建立及維護，包括 Design Tokens 的使用、組件庫的製作等，能夠與工程師協作，一起提升開發效率。",
    Animation: SkillSystemAnimation,
  },
  {
    title: "HTML & CSS",
    description:
      "熟悉網頁結構及樣式，有在多個專案應用 RWD 的經驗，確保設計能夠在不同裝置都有良好體驗。",
    Animation: SkillCodingAnimation,
  },
  {
    title: "End-to-End Design Process",
    description:
      "擁有完整的設計流程經驗，從需求分析、設計到交付和測試。能夠有效地與利害關係人及團隊溝通協作，一起推動專案到上線。",
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
      className="flex gap-4 rounded-3xl bg-bg-card p-5 sm:gap-5 sm:p-6"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="size-30 shrink-0 overflow-hidden rounded-xl" aria-hidden>
        <Animation className="size-full" active={active} />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-base font-extrabold tracking-tight text-text-primary sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
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
        className="bg-bg-section px-6 py-20 sm:py-24"
        aria-labelledby="about-me-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h1
            id="about-me-heading"
            className="type-section-title mb-10 text-center sm:mb-12"
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
                擁有 5 年 UI/UX
                設計經驗，精通設計系統、規格及資訊架構的規劃，擅長透過設計稿、原型及簡報來推動專案進度。具備跨職能協作、領導力及溝通能力，能夠帶領團隊實現設計目標。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-bg-section-alt px-6 py-20 sm:py-24"
        aria-labelledby="skills-heading"
      >
        <div className="mx-auto max-w-5xl">
          <h2
            id="skills-heading"
            className="type-section-title mb-10 text-center sm:mb-12"
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
