import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedConsignArgs,
  TappedConsignmentInquiry,
} from "@artsy/cohesion"
import { Flex, Text, Button } from "@artsy/palette-mobile"
import { isPad } from "app/utils/hardware"
import { useScreenDimensions } from "app/utils/hooks"
import { Image } from "react-native"

interface HeaderProps {
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
  onInquiryPress: (inquiryTrackingArgs?: TappedConsignmentInquiry) => void
}

export const Header: React.FC<HeaderProps> = ({ onConsignPress, onInquiryPress }) => {
  const buttonText = "Start Selling"
  const { width } = useScreenDimensions()
  const isTablet = isPad()

  const handleSubmitPress = (subject: string) => {
    onConsignPress(tracks.consignArgs(subject))
  }

  const handleInquiryPress = () => {
    onInquiryPress(tracks.consignmentInquiryTapped())
  }

  return (
    <Flex>
      <Image
        source={require("images/swa-landing-page-header.webp")}
        style={{ width: isTablet ? "100%" : width, height: isTablet ? 480 : 340 }}
        resizeMode={isTablet ? "contain" : "cover"}
      />

      <Flex mx={2} mt={1}>
        <Text variant="xl" mb={1}>
          Sell art from your collection
        </Text>
        <Text variant="xs" mb={2}>
          With our global reach and art market expertise, our specialists will find the best sales
          option for your work.
        </Text>
        <Flex justifyContent="center" alignItems="center">
          <Button
            testID="header-consign-CTA"
            block
            onPress={() => {
              handleSubmitPress(buttonText)
            }}
            my={1}
            variant="fillDark"
          >
            {buttonText}
          </Button>
          <Button
            testID="Header-inquiry-CTA"
            block
            onPress={handleInquiryPress}
            my={1}
            variant="outline"
          >
            Get in Touch
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

const tracks = {
  consignArgs: (subject: string): TappedConsignArgs => ({
    contextModule: ContextModule.sellHeader,
    contextScreenOwnerType: OwnerType.sell,
    subject,
  }),
  consignmentInquiryTapped: (): TappedConsignmentInquiry => ({
    action: ActionType.tappedConsignmentInquiry,
    context_module: ContextModule.sellHeader,
    context_screen: OwnerType.sell,
    context_screen_owner_type: OwnerType.sell,
    subject: "Get in Touch",
  }),
}
