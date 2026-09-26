import { useEffect, useState } from "react";
import { hasUnlockHint, subscribeUnlockHint } from "./unlock-api";

export function useWorkUnlockHint(): boolean {
  const [unlocked, setUnlocked] = useState(hasUnlockHint);

  useEffect(() => {
    return subscribeUnlockHint(() => {
      setUnlocked(hasUnlockHint());
    });
  }, []);

  return unlocked;
}
