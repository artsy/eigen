import { useIsFocused, useNavigation } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import { RandomNumberGenerator } from "app/utils/placeholders"
import { useEffect, useState } from "react"

export const useSetActivePopover = (isDisplayable: boolean) => {
  const [popoverId] = useState(() => new RandomNumberGenerator(Math.random()).next().toString())
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)
  const {
    sessionState: { activePopover },
  } = GlobalStore.useAppState((state) => state.progressiveOnboarding)
  const { setActivePopover, setIsReady } = GlobalStore.actions.progressiveOnboarding
  // add a ref here to only allow it once
  // or play around with isReady state

  // This is a listener that will be called when the screen is blurred
  // This is to make sure that the popover is not displayed when the screen is not focused
  useEffect(() => {
    const blurListener = navigation.addListener("blur", () => {
      setIsPopoverVisible(false)
    })

    return blurListener
  }, [isDisplayable, isFocused, navigation])

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      setIsPopoverVisible(true)
    })

    return focusListener
  }, [isDisplayable, isFocused, navigation])

  useEffect(() => {
    if (!isDisplayable || activePopover || !popoverId || !isPopoverVisible) {
      return
    }
    if (isPopoverVisible && isDisplayable && !activePopover) {
      setActivePopover(popoverId)
    }
  }, [activePopover, isDisplayable, popoverId, isPopoverVisible])

  const clearActivePopover = () => {
    setActivePopover(undefined)
    setIsReady(true)
  }

  return {
    isActive: !!isDisplayable && activePopover === popoverId,
    clearActivePopover,
  }
}
