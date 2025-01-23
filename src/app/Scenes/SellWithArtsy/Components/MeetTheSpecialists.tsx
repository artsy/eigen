import { ActionType, ContextModule, OwnerType, TappedConsignmentInquiry } from "@artsy/cohesion"
import { Button, Flex, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { MeetTheSpecialists_staticContent$key } from "__generated__/MeetTheSpecialists_staticContent.graphql"
import { useExtraLargeWidth } from "app/Components/ArtworkRail/useExtraLargeWidth"
import { ReadMore } from "app/Components/ReadMore"
import { GlobalStore } from "app/store/GlobalStore"
import { AnimateHeight } from "app/utils/animations/AnimateHeight"
import { MotiView } from "moti"
import { useState } from "react"
import { FlatList, ImageBackground } from "react-native"
import { isTablet } from "react-native-device-info"
import LinearGradient from "react-native-linear-gradient"
import { Easing } from "react-native-reanimated"
import { graphql, useFragment } from "react-relay"

const IMG_HEIGHT_TO_WIDTH_RATIO = 1.511 // based on designs

type InqueryPress = (
  trackingargs?: TappedConsignmentInquiry,
  recipientEmail?: string,
  recipientName?: string
) => void

export const MeetTheSpecialists: React.FC<{
  onInquiryPress: InqueryPress
  staticContent: MeetTheSpecialists_staticContent$key
}> = ({ onInquiryPress, staticContent }) => {
  const staticContentData = useFragment(specialistFragment, staticContent)

  const space = useSpace()

  const specialistBios = staticContentData?.specialistBios

  if (!specialistBios) {
    return null
  }

  return (
    <Flex>
      <Text variant="lg-display" mx={2} mb={1}>
        Meet the specialists
      </Text>
      <Text variant="xs" mb={2} mx={2}>
        Our specialists span today’s most popular collecting categories.
      </Text>
      <Spacer y={2} />
      <FlatList
        contentContainerStyle={{ marginLeft: space(2) }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={specialistBios}
        renderItem={({ item }) => {
          return <Specialist specialist={item} onInquiryPress={onInquiryPress} />
        }}
        keyExtractor={(item) => item.name}
        ListFooterComponent={() => <Spacer x={4} />}
      />
      <Flex mx={2} mt={2}>
        <Text variant="md" mb={2}>
          Not sure who’s the right fit for your collection? Get in touch and we’ll connect you.
        </Text>

        <Button
          testID="MeetTheSpecialists-inquiry-CTA"
          block
          onPress={() => {
            onInquiryPress(tracks.consignmentInquiryTapped("Get in Touch"))
          }}
        >
          Get in Touch
        </Button>
      </Flex>
    </Flex>
  )
}

interface SpecialistProps {
  specialist: {
    image: { imageURL: string | undefined | null }
    firstName: string
    name: string
    jobTitle: string
    bio: string
    email: string
  }
  onInquiryPress: InqueryPress
}
const Specialist: React.FC<SpecialistProps> = ({ specialist, onInquiryPress }) => {
  const [isBioExpanded, setIsBioExpanded] = useState(false)

  const space = useSpace()
  const theme = GlobalStore.useAppState((state) => state.devicePrefs.colorScheme)

  const imgWidth = useExtraLargeWidth()
  const imgHeight = imgWidth * IMG_HEIGHT_TO_WIDTH_RATIO

  const buttonText = `Contact ${specialist.firstName}`

  const bioTextLimit = isTablet() ? 160 : 88

  return (
    <ImageBackground
      source={{ uri: specialist.image.imageURL || "" }}
      resizeMode="cover"
      style={{
        width: imgWidth,
        height: imgHeight,
        marginRight: space(1),
      }}
    >
      <MotiView
        style={{
          position: "absolute",
          height: "100%",
          flexDirection: "row",
        }}
        animate={{ bottom: isBioExpanded ? -20 : -imgHeight / 3 }}
        transition={{
          type: "timing",
          duration: 400,
          easing: Easing.out(Easing.exp),
        }}
      >
        <LinearGradient
          colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
          style={{
            width: "100%",
          }}
        />
      </MotiView>
      <Flex position="absolute" bottom={0} pb={2} mt={1} mx={1}>
        <AnimateHeight>
          <Text
            variant="lg-display"
            // We want to set the color to white here regardless of the theme
            color="white"
          >
            {specialist.name}
          </Text>
          <Text
            variant="xs"
            fontWeight="bold"
            mb={1}
            // We want to set the color to white here regardless of the theme
            color="white"
          >
            {specialist.jobTitle}
          </Text>
          <Flex>
            <ReadMore
              content={specialist.bio}
              maxChars={bioTextLimit}
              textStyle="new"
              textVariant="xs"
              linkTextVariant="xs"
              // We want to set the color to white here regardless of the theme
              color="white"
              showReadLessButton
              onExpand={(isExpanded) => setIsBioExpanded(isExpanded)}
            />
          </Flex>
        </AnimateHeight>
        <Spacer y={2} />
        <Button
          size="small"
          variant={theme === "light" ? "outlineLight" : "fillDark"}
          testID="MeetTheSpecialists-contact-CTA"
          onPress={() => {
            onInquiryPress(
              tracks.consignmentInquiryTapped(buttonText),
              specialist.email,
              specialist.firstName
            )
          }}
        >
          {buttonText}
        </Button>
      </Flex>
    </ImageBackground>
  )
}

const tracks = {
  consignmentInquiryTapped: (subject: string): TappedConsignmentInquiry => ({
    action: ActionType.tappedConsignmentInquiry,
    context_module: ContextModule.sellMeetTheSpecialists,
    context_screen: OwnerType.sell,
    context_screen_owner_type: OwnerType.sell,
    subject,
  }),
}

const specialistFragment = graphql`
  fragment MeetTheSpecialists_staticContent on StaticContent {
    specialistBios {
      name
      firstName
      jobTitle
      bio
      email
      image {
        imageURL
      }
    }
  }
`
