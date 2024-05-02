import { Flex, Text } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { Image } from "react-native"
import { isTablet } from "react-native-device-info"

export const Header: React.FC = () => {
  const { width } = useScreenDimensions()

  return (
    <Flex>
      <Image
        source={require("images/swa-landing-page-header.webp")}
        style={{ width: isTablet() ? "100%" : width, height: isTablet() ? 480 : 340 }}
        resizeMode={isTablet() ? "contain" : "cover"}
      />

      <Flex mx={2} mt={1}>
        <Text variant="xl" mb={1}>
          Sell art from your collection
        </Text>
        <Text variant="xs">
          With our global reach and art market expertise, our specialists will find the best sales
          option for your work.
        </Text>
      </Flex>
    </Flex>
  )
}
