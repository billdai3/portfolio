import type { ComponentType } from "react";
import {
  baseMdxComponents,
  type MdxElProps,
} from "@/features/mdx/base-mdx-components";
import { resolveLocalContentAsset } from "@/features/mdx/resolve-local-content-asset";
import { toAssetPath } from "../lib/asset-path";
import type { WorkProjectInfoItem } from "../lib/createWorkPage";
import { Media } from "./mdx-media";
import { ProjectInfo } from "./ProjectInfo";

export type LockedWorkPreviewProps = {
  title: string;
  summary?: string;
  hero?: string;
  projectInfo?: WorkProjectInfoItem[];
};

/** MDXComponents values include nested maps / string tags; narrow for JSX use. */
const MdxH1 = baseMdxComponents.h1 as ComponentType<MdxElProps>;
const MdxP = baseMdxComponents.p as ComponentType<MdxElProps>;

/** Resolve public hero only when the local asset is present in the bundle. */
function resolvePublicHeroSrc(hero: string | undefined): string | null {
  if (!hero?.trim()) return null;

  const asset = toAssetPath(hero);
  if (!asset) return hero;

  const resolved = resolveLocalContentAsset(hero);
  if (resolved === hero) return null;

  return hero;
}

export function LockedWorkPreview({
  title,
  summary,
  hero,
  projectInfo,
}: LockedWorkPreviewProps) {
  const heroSrc = resolvePublicHeroSrc(hero);
  const summaryText = summary?.trim();
  const infoItems = projectInfo?.filter(
    (item) => item.label.trim() && item.value.trim(),
  );

  return (
    <div className="work-prose lab-prose max-w-none">
      {heroSrc ? (
        <Media
          src={heroSrc}
          alt={`${title} Hero`}
          width="page"
          ratio="16 / 9"
        />
      ) : null}
      <MdxH1>{title}</MdxH1>
      {summaryText ? <MdxP>{summaryText}</MdxP> : null}
      {infoItems && infoItems.length > 0 ? (
        <ProjectInfo items={infoItems} />
      ) : null}
    </div>
  );
}
