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
      "熟練使用 Figma 製作數位產品的介面設計稿及互動原型，具備多個網站及 App 的設計與優化經驗。",
    Animation: lazy(() => import("../components/SkillDesignAnimation")),
  },
  {
    title: "Design System Architecture",
    description:
      "熟悉設計系統的建立及維護，包括 Design Tokens 的管理、元件庫的製作，以及設計規格的整理及撰寫。",
    Animation: lazy(() => import("../components/SkillSystemAnimation")),
  },
  {
    title: "Design-to-Code",
    description:
      "熟悉 HTML、CSS 、JS 等網頁基礎，能閱讀及修改既有程式碼，並將設計需求準確實現成標準的互動式 RWD 網頁。",
    Animation: lazy(() => import("../components/SkillCodingAnimation")),
  },
  {
    title: "AI-Assisted Delivery",
    description:
      "擁有完整的 UI/UX 實務經驗，能運用 Coding Agent 輔助開發，並與客戶及團隊溝通協作，推動專案完成與上線。",
    Animation: lazy(() => import("../components/SkillWorkflowAnimation")),
  },
];

const buildNotes: { title: string; description: string }[] = [
  {
    title: "開發流程與技術應用",
    description:
      "網站以 Vite + React 建置。前期先和 Gemini 討論網站架構與功能方向，再使用 Cursor 協助撰寫程式。結合過去接觸的前端知識 (HTML, CSS, Vue 等)，用 Vibe coding 的方式一步步建構網站。",
  },
  {
    title: "視覺與動態",
    description:
      "使用 Tailwind CSS 來處理樣式，因為過去就熟悉 Design tokens，所以使用起來很順手。網站中的小動畫是利用 GSAP 操控 SVG 做時間軸動畫。Icon 前期使用 Lucide 加快開發，最後再替換成自己用 Figma 繪製的版本。",
  },
  {
    title: "內容與資料管理",
    description:
      "專案 Case study 使用 MDX 管理，讓我可以用 Markdown 語法撰寫內容、自訂樣式，也能安插自製的 React 元件（如圖片 Carousel）。上鎖專案的 MDX 存放在 Github 的 Private repo，圖片則放在 Supabase，透過有時效性的 Signed URL 控制存取權限。原先圖片也放在 Github，但考量 API 的讀取速度，後來才改成用 Supabase。",
  },
  {
    title: "部署與版本管理",
    description:
      "使用 Vercel 部署網站，並透過 Github 管理程式碼。詳細的程式架構及 Commits 可以在作品集 Repo 中查看。",
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
                <h3 className="font-display text-xl font-extrabold tracking-tight text-text-primary transition-colors group-hover:text-brand">
                  {note.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-text-secondary transition-colors group-hover:text-text-primary">
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
