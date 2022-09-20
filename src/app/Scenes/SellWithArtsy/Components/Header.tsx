import { ContextModule, OwnerType, TappedConsignArgs } from "@artsy/cohesion"
import { Button, Flex, Spacer, Text } from "palette"
import { ImageBackground } from "react-native"
import { useScreenDimensions } from "shared/hooks"

const consignArgs: TappedConsignArgs = {
  contextModule: ContextModule.sellHeader,
  contextScreenOwnerType: OwnerType.sell,
  subject: "Submit a work",
}

interface HeaderProps {
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
}

export const Header: React.FC<HeaderProps> = ({ onConsignPress }) => {
  const handlePress = () => {
    onConsignPress(consignArgs)
  }
  const screenDimensions = useScreenDimensions()

  return (
    <ImageBackground
      style={{ height: 430, width: screenDimensions.width }}
      resizeMode="cover"
      source={require("images/SellWithArtsyHeader.webp")}
    >
      <Flex px={2} pt={5} pb={2} justifyContent="center" height="100%">
        <Flex>
          <Text variant="lg" color="white100">
            Sell Artworks from Your Collection
          </Text>

          <Spacer mb={2} />

          <Text variant="sm" color="white100">
            Let our experts find the best sales option for you, whether via auction, private sale,
            or direct listing on Artsy.
          </Text>
        </Flex>

        <Spacer mb={5} />

        <Button testID="header-cta" variant="fillLight" block onPress={handlePress} haptic>
          <Text variant="sm" weight="medium">
            Submit an Artwork
          </Text>
        </Button>

        <Spacer mb={2} />

        <Text variant="sm" italic color="white100">
          Alex Katz, Forest, 2009
        </Text>
      </Flex>
    </ImageBackground>
  )
}
