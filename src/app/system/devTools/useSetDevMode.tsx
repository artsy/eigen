import { useToast } from "app/Components/Toast/toastHook"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect, useState } from "react"
import useDebounce from "react-use/lib/useDebounce"

export const useSetDevMode = () => {
  const toast = useToast()
  const [tapCount, updateTapCount] = useState(0)
  const { value: userIsDev, flipValue: userIsDevFlipValue } = GlobalStore.useAppState(
    (store) => store.artsyPrefs.userIsDev
  )

  useEffect(() => {
    const flip = (userIsDev && tapCount >= 3) || (!userIsDev && tapCount >= 7)
    if (flip) {
      updateTapCount((_) => 0)
      GlobalStore.actions.artsyPrefs.userIsDev.setFlipValue(!userIsDevFlipValue)
      const nextValue = !userIsDev
      if (nextValue) {
        toast.show('Developer mode enabled.\nTap "Version" three times to disable it.', "bottom")
      } else {
        toast.show("Developer mode disabled.", "bottom")
      }
    }
  }, [tapCount])

  useDebounce(
    () => {
      if (tapCount !== 0) {
        updateTapCount((_) => 0)
      }
    },
    300,
    [tapCount]
  )

  return {
    updateTapCount,
  }
}
