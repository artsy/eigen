import { useIsFocused } from "@react-navigation/native"
import { useEffect, useRef } from "react"
import usePrevious from "react-use/esm/usePrevious"

export function useDidRegainFocus() {
  const isVisible = useIsFocused()
  const lastIsVisible = usePrevious(isVisible) ?? isVisible
  const hasBeenVisibleAtLeastOnce = useRef(false)
  const didJustBecomeVisible = isVisible && !lastIsVisible
  const didRegainFocus = didJustBecomeVisible && hasBeenVisibleAtLeastOnce.current

  if (isVisible) {
    hasBeenVisibleAtLeastOnce.current = true
  }

  return didRegainFocus
}

export const OnDidRegainFocus: React.FC<{ onRegainFocus(): void }> = ({ onRegainFocus }) => {
  const didRegainFocus = useDidRegainFocus()
  useEffect(() => {
    if (didRegainFocus) {
      onRegainFocus()
    }
  }, [didRegainFocus, onRegainFocus])
  return null
}
