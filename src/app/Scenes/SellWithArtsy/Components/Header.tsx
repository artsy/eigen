import {
  ActionType,
  ContextModule,
  OwnerType,
  TappedConsignArgs,
  TappedConsignmentInquiry,
} from "@artsy/cohesion"
import { Spacer, Flex, Text } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/store/GlobalStore"
import { isPad } from "app/utils/hardware"
import { Button } from "palette"
import { Image, ImageBackground } from "react-native"
import { useScreenDimensions } from "shared/hooks"

interface HeaderProps {
  onConsignPress: (tappedConsignArgs: TappedConsignArgs) => void
  onInquiryPress: (inquiryTrackingArgs?: TappedConsignmentInquiry) => void
}

export const Header: React.FC<HeaderProps> = ({ onConsignPress, onInquiryPress }) => {
  const enableNewSWALandingPage = useFeatureFlag("AREnableNewSWALandingPage")

  const handleSubmitPress = (subject: string) => {
    onConsignPress(tracks.consignArgs(subject))
  }

  const handleInquiryPress = () => {
    onInquiryPress(tracks.consignmentInquiryTapped())
  }

  return enableNewSWALandingPage ? (
    <NewHeader handleInquiryPress={handleInquiryPress} handleSubmitPress={handleSubmitPress} />
  ) : (
    <OldHeader handleInquiryPress={handleInquiryPress} handleSubmitPress={handleSubmitPress} />
  )
}

const OldHeader: React.FC<{
  handleInquiryPress: () => void
  handleSubmitPress: (subject: string) => void
}> = ({ handleInquiryPress, handleSubmitPress }) => {
  const screenDimensions = useScreenDimensions()

  const enableInquiry = useFeatureFlag("AREnableConsignmentInquiry")

  const buttonText = "Submit an Artwork"
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

          <Spacer y={2} />

          <Text variant="sm-display" color="white100">
            Our experts will find the best sales option for you, at auction, private sale, or
            listing on Artsy.
          </Text>
        </Flex>

        <Spacer y={2} />

        <Button
          testID="header-cta"
          variant="fillLight"
          block
          onPress={() => {
            handleSubmitPress(buttonText)
          }}
          haptic
        >
          <Text variant="sm" weight="medium">
            {buttonText}
          </Text>
        </Button>

        {!!enableInquiry && (
          <>
            <Spacer y={2} />
            <Button
              testID="header-inquiry-cta"
              variant="outlineLight"
              block
              onPress={handleInquiryPress}
              haptic
            >
              Get in Touch
            </Button>
          </>
        )}

        <Spacer y={2} />

        <Text variant="xs" italic color="white100">
          Alex Katz, Forest, 2009
        </Text>
      </Flex>
    </ImageBackground>
  )
}

const NewHeader: React.FC<{
  handleInquiryPress: () => void
  handleSubmitPress: (subject: string) => void
}> = ({ handleInquiryPress, handleSubmitPress }) => {
  const buttonText = "Start Selling"
  const { width } = useScreenDimensions()
  const isTablet = isPad()
  return (
    <Flex>
      <Image
        source={require("images/swa-landing-page-header.png")}
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
