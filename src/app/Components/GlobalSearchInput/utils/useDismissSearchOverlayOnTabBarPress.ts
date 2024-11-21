import { useIsFocused, useNavigation } from "@react-navigation/native"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

/**
 * Dismisses the GlobalSearchInputOverlay when the tab bar is pressed
 */
export const useDismissSearchOverlayOnTabBarPress = ({
  isVisible,
  ownerType,
  setIsVisible,
}: {
  isVisible: boolean
  ownerType: string
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const isFocused = useIsFocused()
  const selectedTab = GlobalStore.useAppState((state) => state.bottomTabs.sessionState.selectedTab)

  const navigation = useNavigation()

  useEffect(() => {
    const tabsNavigation = navigation?.getParent()
    const unsubscribe = tabsNavigation?.addListener("tabPress" as any, () => {
      if (!isFocused || !isVisible) {
        return
      }

      if (ownerType === selectedTab.toLowerCase()) {
        setIsVisible(false)
      }
    })
    return unsubscribe
  }, [isVisible, selectedTab, navigation, isFocused])
}
