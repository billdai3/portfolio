import {
  lazy,
  Suspense,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

import aboutMe from "../assets/about-me.webp";
import CtaLink from "../components/CtaLink";
import {
  formatDocumentTitle,
  useDocumentTitle,
} from "../hooks/useDocumentTitle";

type SkillAnimationProps = {
  className?: string;
  active?: boolean;
};

type SkillAnimationComponent =
  | ComponentType<SkillAnimationProps>
  | LazyExoticComponent<ComponentType<SkillAnimationProps>>;

const skills: {
  title: string;
  description: string;
  Animation: SkillAnimationComponent;
}[] = [
  {
    title: "Figma & UI Prototyping",
    description:
      "熟練運用 Figma 製作數位產品的設計稿及可動原型。有設計、優化過多個網站及 App 的經驗。",
    Animation: lazy(() => import("../components/SkillDesignAnimation")),
  },
  {
    title: "Design System Architecture",
    description:
      "熟悉設計系統的建立及維護，包含 Design Tokens 的使用、元件庫的製作、設計規格的撰寫等。",
    Animation: lazy(() => import("../components/SkillSystemAnimation")),
  },
  {
    title: "Design-to-Code",
    description:
      "瞭解網頁結構、樣式規則及互動邏輯等前端知識，並能運用相關技術來設計標準的互動式 RWD 網頁，讓設計能夠準確地落地實現。",
    Animation: lazy(() => import("../components/SkillCodingAnimation")),
  },
  {
    title: "AI-Assisted Delivery",
    description:
      "擁有完整的實務經驗，也能夠運用 Coding Agent 參與開發。能夠有效地與利害關係人、團隊溝通協作，推動專案順利上線。",
    Animation: lazy(() => import("../components/SkillWorkflowAnimation")),
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

const HOVER_MEDIA = "(hover: hover) and (pointer: fine)";

function useCanHover() {
  const [canHover, setCanHover] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(HOVER_MEDIA).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(HOVER_MEDIA);
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return canHover;
}

function SkillCard({
  title,
  description,
  Animation,
}: {
  title: string;
  description: string;
  Animation: SkillAnimationComponent;
}) {
  const [active, setActive] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const canHover = useCanHover();
  const cardRef = useRef<HTMLLIElement>(null);

  const onIntersect = useEffectEvent((near: boolean) => {
    setNearViewport(near);
    if (!near) setActive(false);
  });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onIntersect(entry.isIntersecting);
      },
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <li
      ref={cardRef}
      className="group flex flex-col items-center gap-4 rounded-3xl bg-bg-card p-5 text-center sm:flex-row sm:gap-5 sm:p-6 sm:text-left"
      onMouseEnter={canHover ? () => setActive(true) : undefined}
      onMouseLeave={canHover ? () => setActive(false) : undefined}
      onClick={canHover ? undefined : () => setActive((prev) => !prev)}
    >
      <div className="size-30 shrink-0 overflow-hidden rounded-xl" aria-hidden>
        {nearViewport ? (
          <Suspense fallback={<div className="size-full" />}>
            <Animation className="size-full" active={active} />
          </Suspense>
        ) : (
          <div className="size-full" />
        )}
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
  useDocumentTitle(formatDocumentTitle("About"));

  return (
    <div className="text-text-primary">
      <section
        className="page-shell page-shell--about bg-bg-section"
        aria-label="About me"
      >
        <div className="section-inner">
          <div className="group flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-center sm:gap-12">
            <img
              src={aboutMe}
              alt="Bill"
              className="size-40 shrink-0 rounded-full object-cover sm:size-48"
            />
            <div className="max-w-xl min-w-0 text-center sm:text-left">
              <h1 className="type-hero-subtitle text-text-primary transition-colors group-hover:text-brand">
                Hi! 我是 Bill
              </h1>
              <p className="mt-4 text-base leading-relaxed text-text-secondary transition-colors group-hover:text-text-primary">
                UI/UX 設計師，擁有 6 年以上 Web/App
                數位產品設計經驗，參與過多個從 0 到 1 的專案。熟悉跨平台 Design
                System 建立與 Design Tokens 應用，具備基礎前端概念與動態視覺思維
                (Tailwind CSS, GSAP, React/Vue 等)，並能透過 Cursor 等 AI
                工具建構產品原型及網站。擅長在商業需求、介面美感與工程可行性之間取得平衡，降低跨部門的溝通成本。
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
