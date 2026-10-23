import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import ArrowIcon from "./icons/ArrowIcon";

const baseClassName =
  "group type-btn inline-flex items-center rounded-full bg-bg-card px-6 py-3 text-text-primary transition-colors duration-300 ease-out hover:bg-brand hover:text-ash-900 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

const iconWrapClassName =
  "inline-flex w-0 overflow-hidden opacity-0 transition-[width,opacity,margin] duration-300 ease-out motion-reduce:transition-none group-hover:ml-1 group-hover:w-4 group-hover:opacity-100 group-focus-visible:ml-1 group-focus-visible:w-4 group-focus-visible:opacity-100";

type CtaLinkSharedProps = {
  children: ReactNode;
  className?: string;
};

type CtaLinkInternalProps = CtaLinkSharedProps & {
  to: string;
  href?: never;
  target?: never;
  rel?: never;
};

type CtaLinkExternalProps = CtaLinkSharedProps & {
  href: string;
  to?: never;
  target?: string;
  rel?: string;
};

type CtaLinkProps = CtaLinkInternalProps | CtaLinkExternalProps;

function joinClassName(base: string, extra?: string) {
  return extra ? `${base} ${extra}` : base;
}

function CtaLinkContent({ children }: { children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      <span className={iconWrapClassName} aria-hidden>
        <ArrowIcon direction="right" className="size-4 shrink-0" />
      </span>
    </>
  );
}

export default function CtaLink(props: CtaLinkProps) {
  const { children, className } = props;
  const classNames = joinClassName(baseClassName, className);

  if ("to" in props && props.to != null) {
    return (
      <Link to={props.to} className={classNames}>
        <CtaLinkContent>{children}</CtaLinkContent>
      </Link>
    );
  }

  return (
    <a
      href={props.href}
      target={props.target}
      rel={props.rel}
      className={classNames}
    >
      <CtaLinkContent>{children}</CtaLinkContent>
    </a>
  );
}
