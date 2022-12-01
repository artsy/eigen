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
  onInquiryPress: () => void
}

export const Header: React.FC<HeaderProps> = ({ onConsignPress, onInquiryPress }) => {
  const handleSubmitPress = () => {
    onConsignPress(consignArgs)
  }

  const handleInquiryPress = () => {
    // TODO: Tracking
    onInquiryPress()
  }
  const screenDimensions = useScreenDimensions()

  return (
    <ImageBackground
      style={{ height: 430, width: screenDimensions.width }}
      resizeMode="cover"
      source={require("images/SellWithArtsyHeader.webp")}
    >
      <Flex px={2} pb={2} justifyContent="flex-end" height="100%">
        <Flex>
          <Text variant="xl" color="white100">
            Sell Artworks from Your Collection
          </Text>

          <Spacer mb={2} />

          <Text variant="sm" color="white100">
            Our experts will find the best sales option for you, at auction, private sale, or
            listing on Artsy.
          </Text>
        </Flex>

        <Spacer mb={3} />

        <Button testID="header-cta" variant="fillLight" block onPress={handleSubmitPress} haptic>
          <Text variant="sm" weight="medium">
            Submit an Artwork
          </Text>
        </Button>
        <Spacer mb={2} />
        <Button
          testID="header-inquiry-cta"
          variant="outlineLight"
          block
          onPress={handleInquiryPress}
          haptic
        >
          <Text variant="sm">Get in Touch</Text>
        </Button>

        <Spacer mb={2} />

        <Text variant="xs" italic color="white100">
          Alex Katz, Forest, 2009
        </Text>
      </Flex>
    </ImageBackground>
  )
}
