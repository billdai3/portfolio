export type IconDirection = "right" | "down" | "left" | "up";

const DIRECTION_CLASS: Record<IconDirection, string | undefined> = {
  right: undefined,
  down: "rotate-90",
  left: "rotate-180",
  up: "-rotate-90",
};

export function iconDirectionClass(direction: IconDirection): string | undefined {
  return DIRECTION_CLASS[direction];
}

export function joinIconClassName(
  ...parts: Array<string | undefined | false>
): string | undefined {
  const value = parts.filter(Boolean).join(" ");
  return value || undefined;
}
