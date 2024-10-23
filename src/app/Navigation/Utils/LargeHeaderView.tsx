import { Flex, NAVBAR_HEIGHT } from "@artsy/palette-mobile"
import { useHeaderHeight } from "@react-navigation/elements"
import { Platform } from "react-native"

export const LargeHeaderView: React.FC = () => {
  const headerHeight = useHeaderHeight()

  if (Platform.OS !== "ios") {
    return null
  }

  return <Flex height={NAVBAR_HEIGHT + headerHeight} />
}
