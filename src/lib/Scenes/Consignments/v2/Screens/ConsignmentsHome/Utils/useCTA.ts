import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { useRef } from "react"
import { ScrollView } from "react-native"

export function useCTA() {
  const navRef = useRef<ScrollView>(null)

  const handleCTAPress = () => {
    if (navRef.current) {
      const route = "/collections/my-collection/artworks/new/submissions/new"
      SwitchBoard.presentModalViewController(navRef.current, route)
    }
  }

  return {
    navRef,
    handleCTAPress,
  }
}
