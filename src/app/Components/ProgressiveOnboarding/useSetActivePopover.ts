import { GlobalStore } from "app/store/GlobalStore"
import { RandomNumberGenerator } from "app/utils/placeholders"
import { useEffect, useState } from "react"

export const useSetActivePopover = (isDisplayable: boolean) => {
  const [popoverId] = useState(() => new RandomNumberGenerator(Math.random()).next().toString())
  const {
    sessionState: { activePopover },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { setActivePopover } = GlobalStore.actions.progressiveOnboarding

  useEffect(() => {
    if (!isDisplayable || activePopover || !popoverId) {
      return
    }
    if (isDisplayable && !activePopover) {
      setActivePopover(popoverId)
    }
  }, [activePopover, isDisplayable, popoverId])

  return { isActive: !!isDisplayable && activePopover === popoverId }
}
