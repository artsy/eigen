import { Flex, NAVBAR_HEIGHT } from "@artsy/palette-mobile"
import { Platform } from "react-native"

const LARGE_HEADER_HEIGHT = 100

export const LargeHeaderView: React.FC = () => {
  if (Platform.OS !== "ios") {
    return null
  }

  return <Flex height={NAVBAR_HEIGHT + LARGE_HEADER_HEIGHT} />
}
