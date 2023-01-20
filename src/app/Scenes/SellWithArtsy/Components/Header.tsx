import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedConsignArgs,
  TappedConsignmentInquiry,
} from "@artsy/cohesion"
import { useFeatureFlag } from "app/store/GlobalStore"
import { Button, Flex, Spacer, Text } from "palette"
import { ImageBackground } from "react-native"
import { useTracking } from "react-tracking"
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
  const { trackEvent } = useTracking()
  const handleSubmitPress = () => {
    onConsignPress(consignArgs)
  }

  const handleInquiryPress = () => {
    trackEvent(tracks.consignmentInquiryTapped())
    onInquiryPress()
  }
  const screenDimensions = useScreenDimensions()

  const enableInquiry = useFeatureFlag("AREnableConsignmentInquiry")

  return (
    <ImageBackground
      style={{ height: 430, width: screenDimensions.width }}
      resizeMode="cover"
      source={require("images/SellWithArtsyHeader.jpg")}
    >
      <Flex px={2} pb={2} justifyContent="flex-end" height="100%">
        <Flex>
          <Text variant="lg-display" color="white100">
            Sell Artworks from Your Collection
          </Text>

          <Spacer mb={2} />

          <Text variant="sm-display" color="white100">
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

        {!!enableInquiry && (
          <>
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
          </>
        )}

        <Spacer mb={2} />

        <Text variant="xs" italic color="white100">
          Alex Katz, Forest, 2009
        </Text>
      </Flex>
    </ImageBackground>
  )
}

const tracks = {
  consignmentInquiryTapped: (): TappedConsignmentInquiry => ({
    action: ActionType.tappedConsignmentInquiry,
    context_module: ContextModule.sellHeader,
    context_screen: OwnerType.sell,
    context_screen_owner_type: OwnerType.sell,
    subject: "Get in Touch",
  }),
}
